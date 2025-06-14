from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Opportunity
from datetime import date

# Student Blueprint with URL Prefix
student_bp = Blueprint('student', __name__, url_prefix='/student')

@student_bp.route('/opportunities', methods=['GET'])
@jwt_required()
def get_active_opportunities():
    today = date.today()

    opportunities = Opportunity.query.filter(
        Opportunity.is_active == True,
        Opportunity.deadline >= today
    ).order_by(Opportunity.deadline.asc()).all()

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
            'created_at': opp.created_at.strftime('%Y-%m-%d %H:%M'),
        })

    return jsonify({
        'status': 'success',
        'opportunities': data
    }), 200

