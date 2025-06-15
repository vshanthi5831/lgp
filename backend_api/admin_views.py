from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Opportunity , Application , User , Admin , Student
from datetime import datetime
from datetime import date

from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from io import BytesIO
import pandas as pd
from datetime import datetime

# Admin Blueprint with URL Prefix
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/create-opportunity', methods=['POST'])
@jwt_required()
def create_opportunity():
    identity = get_jwt_identity()

    if identity['role'] != 'admin':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    data = request.json  

    required_fields = ['title', 'company', 'type', 'domain', 'description', 'deadline']
    missing_fields = [field for field in required_fields if not data.get(field)]

    if missing_fields:
        return jsonify({
            'status': 'error',
            'message': f'Missing fields: {", ".join(missing_fields)}'
        }), 400

    try:
        opportunity = Opportunity(
            title=data['title'],
            company=data['company'],
            type=data['type'],
            stipend=data.get('stipend'),
            ctc=data.get('ctc'),
            future_ctc_on_conversion=data.get('future_ctc_on_conversion'),
            domain=data['domain'],
            description=data['description'],
            deadline=datetime.strptime(data['deadline'], '%Y-%m-%d'),
            posted_by=identity['id']
        )
        db.session.add(opportunity)
        db.session.commit()

        return jsonify({'status': 'success', 'message': 'Opportunity created'}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500


@admin_bp.route('/opportunities', methods=['GET'])
@jwt_required()
def get_admin_opportunities():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    admin_id = identity['id']
    filter_type = request.args.get('filter', 'all')  

    try:
        query = Opportunity.query

        if filter_type == 'active':
            query = query.filter_by(is_active=True)
        elif filter_type == 'posted_by_me':
            query = query.filter_by(posted_by=admin_id)

        opportunities = query.order_by(Opportunity.created_at.desc()).all()

        result = [
            {
                'id': opp.id,
                'title': opp.title,
                'company': opp.company,
                'type': opp.type,
                'ctc': opp.ctc,
                'stipend': opp.stipend,
                'deadline': opp.deadline.strftime('%Y-%m-%d'),
                'is_active': opp.is_active,
                'created_at': opp.created_at.strftime('%Y-%m-%d %H:%M')
            }
            for opp in opportunities
        ]

        return jsonify({'status': 'success', 'opportunities': result}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def admin_analytics():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    try:
        total_opportunities = Opportunity.query.count()
        total_applications = Application.query.count()
        active_opportunities = Opportunity.query.filter_by(is_active=True).count()

        # FTE distribution
        fte_opps = Opportunity.query.filter_by(type='internship').all()
        count_dream = count_high = count_good = count_it = 0

        for opp in fte_opps:
            try:
                ctc = float(opp.ctc or 0)
            except ValueError:
                ctc = 0

            if ctc >= 18:
                count_dream += 1
            elif 14 <= ctc < 18:
                count_high += 1
            elif 8 <= ctc < 14:
                count_good += 1
            elif 3 <= ctc < 8:
                count_it += 1

        return jsonify({
            'status': 'success',
            'total_opportunities': total_opportunities,
            'total_applications': total_applications,
            'active_opportunities': active_opportunities,
            'fte_distribution': [count_dream, count_high, count_good, count_it]
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

@admin_bp.route('/opportunity/<int:opp_id>/applicants', methods=['GET'])
@jwt_required()
def get_applicants_for_opportunity(opp_id):
    identity = get_jwt_identity()
    current_user_id = identity['id'] 

    admin = db.session.get(Admin, current_user_id)

    if not admin:
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

    opportunity = Opportunity.query.filter_by(id=opp_id).first()

    if not opportunity:
        return jsonify({'status': 'error', 'message': 'Opportunity not found or not yours'}), 404

    applications = Application.query.filter_by(opportunity_id=opp_id).all()


    applicants_data = []
    for app in applications:
        student = db.session.get(Student, app.student_id)
        if student:
            applicants_data.append({
                'full_name': student.full_name,
                'usn': student.usn,
                'branch': student.branch,
                'email': student.email,
                'resume_url': student.resume_url,
                'applied_on': app.applied_on.strftime('%Y-%m-%d %H:%M')
            })

    return jsonify({
        'status': 'success',
        'opportunity': {
            'id': opportunity.id,
            'title': opportunity.title,
            'company': opportunity.company,
            'type': opportunity.type,
            'stipend': opportunity.stipend,
            'ctc': opportunity.ctc,
            'deadline': opportunity.deadline.strftime('%Y-%m-%d'),
            'created_at': opportunity.created_at.strftime('%Y-%m-%d %H:%M'),
            'is_active': opportunity.is_active,
            'posted_by' : opportunity.posted_by
        },
        'applicants': applicants_data
    }), 200

<<<<<<< HEAD




@admin_bp.route('/opportunity/<int:opp_id>/deactivate', methods=['PATCH'])
@jwt_required()
def deactivate_opportunity(opp_id):
=======
@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def platform_analytics():
>>>>>>> 4a24703655aca50bf15fb2142d2ea21c71fcaf61
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

<<<<<<< HEAD
    opportunity = Opportunity.query.get(opp_id)

    if not opportunity:
        return jsonify({'status': 'error', 'message': 'Opportunity not found'}), 404

    if opportunity.posted_by != identity['id']:
        return jsonify({'status': 'error', 'message': 'Forbidden'}), 403

    if not opportunity.is_active:
        return jsonify({'status': 'error', 'message': 'Already inactive'}), 400

    opportunity.is_active = False
    db.session.commit()

    return jsonify({'status': 'success', 'message': 'Opportunity deactivated'}), 200



@admin_bp.route('/opportunity/<int:opp_id>/applicants/excel', methods=['GET'])
@jwt_required()
def download_applicants_excel(opp_id):
    identity = get_jwt_identity()
    admin = db.session.get(Admin, identity['id'] if isinstance(identity, dict) else identity)

    opportunity = Opportunity.query.filter_by(id=opp_id, posted_by=admin.id).first()
    if not opportunity:
        return jsonify({'status': 'error', 'message': 'Opportunity not found'}), 404

    applications = Application.query.filter_by(opportunity_id=opp_id).all()
    rows = []

    for app in applications:
        student = db.session.get(Student, app.student_id)
        if student:
            rows.append({
                'Full Name': student.full_name,
                'USN': student.usn,
                'Branch': student.branch,
                'Email': student.email,
                'Applied On': app.applied_on.strftime('%Y-%m-%d %H:%M'),
                'Resume URL': student.resume_url
            })

    if not rows:
        # Still return an empty sheet with headers
        rows.append({col: '' for col in ['Full Name', 'USN', 'Branch', 'Email', 'Applied On', 'Resume URL']})

    import pandas as pd
    from io import BytesIO

    df = pd.DataFrame(rows)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Applicants')

    output.seek(0)

    filename = f"{opportunity.title}_{opportunity.company}_{opportunity.type}.xlsx".replace(" ", "_")

    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name=filename
    )
=======
    try:
        total_opportunities = Opportunity.query.count()
        total_applications = Application.query.count()
        active_opportunities = Opportunity.query.filter_by(is_active=True).count()

        # FTE distribution
        fte_opps = Opportunity.query.filter_by(type='fte').all()
        count_dream = count_high = count_good = count_it = 0

        for opp in fte_opps:
            ctc = opp.ctc or 0
            if ctc >= 18:
                count_dream += 1
            elif 14 <= ctc < 18:
                count_high += 1
            elif 8 <= ctc < 14:
                count_good += 1
            elif 3 <= ctc < 8:
                count_it += 1

        return jsonify({
            'status': 'success',
            'total_opportunities': total_opportunities,
            'total_applications': total_applications,
            'active_opportunities': active_opportunities,
            'fte_distribution': [count_dream, count_high, count_good, count_it]
        }), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500
>>>>>>> 4a24703655aca50bf15fb2142d2ea21c71fcaf61
