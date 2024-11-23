from flask import Flask
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint
from models import db
from routes import api
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
jwt = JWTManager(app)

# Swagger setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.json'
swagger_ui = get_swaggerui_blueprint(SWAGGER_URL, API_URL, config={'app_name': "Task Manager API"})
app.register_blueprint(swagger_ui, url_prefix=SWAGGER_URL)

# Register API routes
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
