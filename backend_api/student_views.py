from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Opportunity
from datetime import date

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
