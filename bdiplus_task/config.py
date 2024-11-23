from datetime import timedelta

class Config:
    SECRET_KEY = 'your_super_secret_key_here'  # Replace with a secure random key
    SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:1234567890@localhost:5432/taskdb'  # Database connection string
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = 'your_jwt_secret_key_here'  # Replace with a secure random key for JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)  # Token expires in 1 hour
