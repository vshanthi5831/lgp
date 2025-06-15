from flask import Blueprint, jsonify , request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Opportunity , Application , db , Student
from datetime import date 
import datetime

# Student Blueprint
student_bp = Blueprint('student', __name__, url_prefix='/student')

@student_bp.route('/opportunities', methods=['GET'])
@jwt_required()
def fetch_active_opportunities():
    today = date.today()

    active_opportunities = Opportunity.query.filter(
        Opportunity.is_active.is_(True),
        Opportunity.deadline >= today
    ).order_by(Opportunity.deadline.asc()).all()

    opportunities_data = []
    for opp in active_opportunities:
        opportunities_data.append({
            'id': opp.id,
            'title': opp.title,
            'company': opp.company,
            'type': opp.type,
            'stipend': opp.stipend,
            'ctc': opp.ctc,
            'future_ctc_on_conversion': opp.future_ctc_on_conversion,
            'domain': opp.domain,
            'description': opp.description,
            'deadline': opp.deadline.strftime('%Y-%m-%d'),
            'created_at': opp.created_at.strftime('%Y-%m-%d %H:%M'),
        })

    return jsonify({
        'status': 'success',
        'opportunities': opportunities_data
    }), 200



@student_bp.route('/opportunity/<int:opportunity_id>', methods=['GET'])
@jwt_required()
def get_opportunity(opportunity_id):
    identity = get_jwt_identity()
    student_id = identity['id']

    opportunity = Opportunity.query.get(opportunity_id)
    if not opportunity:
        return jsonify({'status': 'error', 'message': 'Opportunity not found'}), 404

    # Check if student already applied
    already_applied = Application.query.filter_by(student_id=student_id, opportunity_id=opportunity_id).first() is not None

    return jsonify({
        'status': 'success',
        'opportunity': {
            'id': opportunity.id,
            'title': opportunity.title,
            'company': opportunity.company,
            'description': opportunity.description,
            'type': opportunity.type,
            'domain': opportunity.domain,
            'deadline': opportunity.deadline.strftime('%Y-%m-%d'),
            'ctc': opportunity.ctc,
            'stipend': opportunity.stipend,
            'future_ctc_on_conversion': opportunity.future_ctc_on_conversion,
        },
        'already_applied': already_applied
    }), 200




@student_bp.route('/apply/<int:opportunity_id>', methods=['POST'])
@jwt_required()
def apply_for_opportunity(opportunity_id):
    identity = get_jwt_identity()

    if identity['role'] != 'student':
        return jsonify({'status': 'error', 'message': 'Only students can apply'}), 403

    student_id = identity['id']

    opportunity = Opportunity.query.filter_by(id=opportunity_id, is_active=True).first()
    if not opportunity:
        return jsonify({'status': 'error', 'message': 'Opportunity not found or is inactive'}), 404

    existing = Application.query.filter_by(student_id=student_id, opportunity_id=opportunity_id).first()
    if existing:
        return jsonify({'status': 'error', 'message': 'You have already applied for this opportunity'}), 400

    try:
        new_application = Application(
            student_id=student_id,
            opportunity_id=opportunity_id,
            applied_on=datetime.datetime.utcnow()
        )
        db.session.add(new_application)
        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Application submitted successfully'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': f'Error: {str(e)}'}), 500


@student_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def student_profile():
    identity = get_jwt_identity()
    current_user_id = identity['id']

    student = Student.query.get(current_user_id)
    if not student:
        return jsonify({'status': 'error', 'message': 'Student not found'}), 404

    if request.method == 'GET':
        return jsonify({
            'status': 'success',
            'student': {
                'full_name': student.full_name,
                'email': student.email,
                'usn': student.usn,
                'branch': student.branch,
                'tenth_percent': student.tenth_percent,
                'twelfth_percent': student.twelfth_percent,
                'btech_aggregate': student.btech_aggregate,
                'contact': student.contact,
                'resume_url': student.resume_url,
                'domain_prefs': student.domain_prefs
            }
        }), 200

    elif request.method == 'PUT':
        data = request.json

        student.contact = data.get('contact', student.contact)
        student.resume_url = data.get('resume_url', student.resume_url)
        student.domain_prefs = data.get('domain_prefs', student.domain_prefs)

        try:
            if data.get('btech_aggregate') is not None:
                student.btech_aggregate = float(data.get('btech_aggregate'))
        except ValueError:
            return jsonify({'status': 'error', 'message': 'Invalid BTech Aggregate value'}), 400

        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Profile updated successfully'}), 200


@student_bp.route('/applications', methods=['GET'])
@jwt_required()
def get_student_applications():
    identity = get_jwt_identity()
    student_id = identity['id']

    student = Student.query.get(student_id)
    if not student:
        return jsonify({'status': 'error', 'message': 'Student not found'}), 404

    applications = Application.query.filter_by(student_id=student_id).all()

    app_list = []
    for app in applications:
        opp = Opportunity.query.get(app.opportunity_id)
        app_list.append({
            'title': opp.title,
            'company': opp.company,
            'opportunity_type': opp.type,
            'applied_on': app.applied_on.strftime('%Y-%m-%d'),
        })

    return jsonify({'status': 'success', 'applications': app_list}), 200