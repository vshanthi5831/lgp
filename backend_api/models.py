from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from sqlalchemy import CheckConstraint

db = SQLAlchemy()

# ------------------------------------------------------------------
# 1. Base User (abstract)

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(10), nullable=False)  # 'student' or 'admin'
    contact = db.Column(db.String(15), nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint(
            role.in_(['student', 'admin']),
            name='valid_user_role'
        ),
    )

    __mapper_args__ = {
        'polymorphic_identity': 'user',
        'polymorphic_on': role
    }

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# ------------------------------------------------------------------
# 2. Student Table

class Student(User):
    __tablename__ = 'students'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    usn = db.Column(db.String(30), unique=True, nullable=False)
    branch = db.Column(db.String(20), nullable=False)
    tenth_percent = db.Column(db.Float)
    twelfth_percent = db.Column(db.Float)
    btech_aggregate = db.Column(db.Float)
    resume_url = db.Column(db.String(300))
    domain_prefs = db.Column(db.Text)  # JSON string of preferences

    applications = db.relationship('Application', backref='student', lazy=True)

    __mapper_args__ = {
        'polymorphic_identity': 'student',
    }

    __table_args__ = (
        CheckConstraint(
            branch.in_(['CSE', 'ISE', 'AIML', 'ECE', 'EEE', 'MECH', 'CIVIL' , '']),
            name='valid_branch_constraint'
        ),
    )


# ------------------------------------------------------------------
# 3. Admin Table

class Admin(User):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)

    opportunities = db.relationship('Opportunity', backref='posted_by_admin', lazy=True)

    __mapper_args__ = {
        'polymorphic_identity': 'admin',
    }


# ------------------------------------------------------------------
# 4. Opportunity Table

class Opportunity(db.Model):
    __tablename__ = 'opportunities'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=False)

    type = db.Column(db.String(30), nullable=False)

    stipend = db.Column(db.String(50), nullable=True)
    ctc = db.Column(db.String(50), nullable=True)
    future_ctc_on_conversion = db.Column(db.String(50), nullable=True)

    duration_months = db.Column(db.Integer, nullable=True) 

    domain = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    deadline = db.Column(db.Date, nullable=False)

    posted_by = db.Column(db.Integer, db.ForeignKey('admins.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship('Application', backref='opportunity', lazy=True)

    __table_args__ = (
        CheckConstraint(
            type.in_(['internship', 'fulltime', 'internship_with_ctc']),
            name='valid_opportunity_type'
        ),
    )
# ------------------------------------------------------------------
# 5. Application Table

class Application(db.Model):
    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.id'), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey('opportunities.id'), nullable=False)
    applied_on = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint('student_id', 'opportunity_id', name='unique_application'),
    )
