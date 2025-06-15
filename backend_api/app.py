from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, User, Student, Admin  

from admin_views import admin_bp
from student_views import student_bp

import json

from flask_mail import Mail , Message
app = Flask(__name__)
CORS(app)

# App Config
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'test85482480@gmail.com'            # <-- your email
app.config['MAIL_PASSWORD'] = 'yzme lrlt bbeq ynmh'      # <-- use app password, not your Gmail password
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = ('NXT help', 'test85482480@gmail.com'),

mail = Mail(app)

# Init Extensions
db.init_app(app)
jwt = JWTManager(app)

app.register_blueprint(admin_bp)
app.register_blueprint(student_bp)



# ------------------------------
# Register Route
# ------------------------------
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        full_name = data.get('full_name')

        if not all([email, password, role, full_name]):
            return jsonify({'status': 'error', 'message': 'Missing required fields'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'status': 'error', 'message': 'Email already registered'}), 400

        if role == 'student':
            student = Student(
                email=email,
                role='student',
                full_name=full_name,
                usn=data.get('usn'),
                contact=data.get('contact'),
                branch=data.get('branch'),
                tenth_percent=data.get('tenth_percent'),
                twelfth_percent=data.get('twelfth_percent'),
                btech_aggregate=data.get('btech_aggregate'),
                resume_url=data.get('resume_url'),
                domain_prefs=data.get('domain_prefs')
            )
            student.set_password(password)
            db.session.add(student)

        elif role == 'admin':
            admin = Admin(
                email=email,
                role='admin',
                full_name=full_name
            )
            admin.set_password(password)
            db.session.add(admin)

        else:
            return jsonify({'status': 'error', 'message': 'Invalid role provided'}), 400

        db.session.commit()

        return jsonify({
            'status': 'success',
            'message': f'{role.capitalize()} registered successfully'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'status': 'error', 'message': str(e)}), 500

# ------------------------------
# Login Route
# ------------------------------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'error', 'message': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        token_data = {
            'id': user.id,
            'email': user.email,
            'role': user.role
        }
        access_token = create_access_token(identity=token_data)

        if user.role == 'student':
            student = Student.query.get(user.id)
            return jsonify({
                'status': 'success',
                'message': 'Student login successful',
                'token': access_token,
                'student': {
                    'student_id': student.id,
                    'full_name': student.full_name,
                    'email': user.email,
                    'usn': student.usn
                }
            }), 200

        elif user.role == 'admin':
            admin = Admin.query.get(user.id)
            return jsonify({
                'status': 'success',
                'message': 'Admin login successful',
                'token': access_token,
                'admin': {
                    'admin_id': admin.id,
                    'full_name': admin.full_name,
                    'email': user.email
                }
            }), 200

    return jsonify({'status': 'error', 'message': 'Invalid credentials'}), 401

# ------------------------------
# Protected Route Example
# ------------------------------
@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    return jsonify({
        'status': 'success',
        'message': f"Hello, {identity['email']}!",
        'user': identity
    }), 200

# ------------------------------
# Run the App
# ------------------------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
