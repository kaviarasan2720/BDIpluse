import unittest
from app import app, db

class TaskManagerTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.client = app.test_client()
        with app.app_context():
            db.create_all()

    def test_register(self):
        response = self.client.post('/api/register', json={
            'name': 'Test User',
            'email': 'test@example.com',
            'password': 'password'
        })
        self.assertEqual(response.status_code, 201)

if __name__ == '__main__':
    unittest.main()
