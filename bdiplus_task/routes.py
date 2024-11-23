from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token, get_jwt_identity
)
from models import User, db

api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not all(key in data for key in ('name', 'email', 'password')):
        return jsonify({'error': 'Invalid input'}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400

    user = User(name=data['name'], email=data['email'])
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not all(key in data for key in ('email', 'password')):
        return jsonify({'error': 'Invalid input'}), 400

    user = User.query.filter_by(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity={'id': user.id, 'email': user.email})
    return jsonify({'access_token': access_token}), 200

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'name': u.name, 'email': u.email} for u in users]), 200

@api.route('/user/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.json
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user.name = data.get('name', user.name)
    user.email = data.get('email', user.email)
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200

@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200
