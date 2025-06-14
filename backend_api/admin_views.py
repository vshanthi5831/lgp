from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Opportunity
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
def get_opportunities():
    identity = get_jwt_identity()
    admin_id = identity['id']

    opportunities = Opportunity.query.order_by(Opportunity.created_at.desc()).all()

    data = []
    for opp in opportunities:
        data.append({
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
            'posted_by_me': opp.posted_by == admin_id,
            'is_active': opp.is_active,
            'created_at': opp.created_at.strftime('%Y-%m-%d %H:%M')
        })

    return jsonify({
        'status': 'success',
        'opportunities': data
    }), 200

@admin_bp.route('/analytics', methods=['GET'])
@jwt_required()
def platform_analytics():
    identity = get_jwt_identity()
    if identity['role'] != 'admin':
        return jsonify({'status': 'error', 'message': 'Unauthorized'}), 403

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
