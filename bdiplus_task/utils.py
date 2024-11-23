from flask import jsonify
from flask_jwt_extended import decode_token
from marshmallow import Schema, fields, ValidationError


# Helper function to generate standardized error responses
def error_response(message, status_code):
    return jsonify({"error": message}), status_code


# Custom Input Validation Schema using Marshmallow
class UserRegistrationSchema(Schema):
    name = fields.String(required=True, error_messages={"required": "Name is required."})
    email = fields.Email(required=True, error_messages={"required": "Valid email is required."})
    password = fields.String(required=True, validate=lambda x: len(x) >= 6,
                             error_messages={"required": "Password is required.",
                                             "validator_failed": "Password must be at least 6 characters long."})


class UserLoginSchema(Schema):
    email = fields.Email(required=True, error_messages={"required": "Valid email is required."})
    password = fields.String(required=True, error_messages={"required": "Password is required."})


# Function to validate request input against a schema
def validate_request_data(schema_class, data):
    schema = schema_class()
    try:
        schema.load(data)
        return None
    except ValidationError as err:
        return err.messages


# Decode JWT to extract the token's payload
def decode_jwt(token):
    try:
        decoded = decode_token(token)
        return decoded
    except Exception as e:
        return str(e)
