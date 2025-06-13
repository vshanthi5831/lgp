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
