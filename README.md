# bdipluse_task



# User Registration and Authentication System

## Project Overview

This project is a **User Registration and Authentication System** built with the following technologies:

- **Frontend**: ReactJS with Material UI for building the user interface.
- **Backend**: Flask REST API for handling user authentication and management.
- **Database**: PostgreSQL for data storage.
- **Authentication**: JWT (JSON Web Tokens) for secure access and token-based authentication.

The project allows users to register, log in, and access secured resources based on their JWT tokens.

---

## Technologies and Libraries Used

### Frontend:
- **ReactJS**: JavaScript library for building user interfaces.
- **Material UI**: React components library for building UI with pre-built styles.
- **React Router**: For managing client-side routing.
- **Axios**: For making API requests from the frontend to the Flask backend.

---

### Backend:
- **Flask**: Micro web framework for building the RESTful API.
- **Flask-JWT-Extended**: For handling JWT-based authentication.
- **Flask-SQLAlchemy**: For ORM-based interaction with PostgreSQL.
- **Flask-Cors**: For handling Cross-Origin Resource Sharing (CORS) between the frontend and backend.
- **PostgreSQL**: Relational database for storing user data.

---

## How to Run the Back End Project Locally

### 1. Clone the Repository

```bash
git clone (https://github.com/kaviarasan2720/BDIpluse.git)
```
### 2. Setup Backend (Flask API)
Install Dependencies
Make sure you have pip and virtualenv installed.

### 3.Create a virtual environment:

```bash
python -m venv venv
```
### 4.Activate the virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```
### 5.Install required packages:
```bash
pip install -r requirements.txt
```
### 6.Setup PostgreSQL Database:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL
);
```
```SQLALCHEMY_DATABASE_URI = 'postgresql://your_username:your_password@localhost/user_management'```
#### Run Comment:
`python app.py `
By default, the backend will be available at `http://127.0.0.1:5000.`
### 7.Access Swagger documentation:
    - Open your browser and navigate to http://127.0.0.1:5000/swagger.
  ---
## Swagger Integration Steps
### 1.Swagger Setup in Code:
    - Swagger is integrated using the flask-swagger-ui package.
    - The Swagger JSON file is located at static/swagger.json
### 2.Access the Swagger UI:
    - Visit the Swagger UI at /swagger (e.g., http://127.0.0.1:5000/swagger).
### 3.Testing Endpoints:
    - Each API endpoint is documented with details about parameters, responses, and request bodies.
    - You can test API requests directly from the Swagger UI.
---
## Endpoints Overview
### User Management:
| Method | Endpoint  | Description|Authentication Required|
| ------- | ---------| ---------- |--------|
| **POST** | `/api/register`| Register a new user | No |
| **POST** |`/api/login` |Log in a user|No|
| **GET** |  `/api/users` |Retrieve all users|Yes|
| **PUT** | `/api/user/<id>` |Update user information	|Yes|
| **DELETE** | `/api/user/<id>` |Delete a user| Yes|

## Running Unit Tests:
To ensure all endpoints work as expected, run the unit tests:
```bash
pytest test_app.py
```
### Swagger UI
Example of the Swagger UI:
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20140354.png)


------
## Front End Project Locally

## Setup Frontend (ReactJS)
Install Dependencies
## Navigate to the frontend directory:

```bash
npx create-react-app .
```
bash
Copy code
npm install
## Configure API Base URL
In the frontend project, configure the Axios instance to use the correct API base URL. Open ``src/Utils/axiosInstance.js`` and update the base URL:

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your API base URL
});

// Function to set the Authorization header globally
export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Add a request interceptor (optional, ensures token is always included)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors globally (e.g., token expiration)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token'); // Clear the token
      window.location.href = '/login'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

export default axiosInstance;
```

Start React Development Server

## To run the React app:

```bash
npm start
The frontend will be available at http://localhost:3000.
```

## Testing the APIs
API Endpoints
--
`POST api/register: User registration endpoint.`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
}
Response: 201 Created (Success) or error message (e.g., 400 Bad Request for invalid input).
```
--
`POST api/login: User login endpoint to receive a JWT token.`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
Response: 200 OK with the JWT token if successful.
```
```json
{
  "access_token": "<jwt-token>"
}
```
--
`GET /api/users: Protected route to retrieve user profile information. Requires JWT token in the Authorization header.`
**Headers:**
`Authorization: Bearer <jwt-token>`
Response: 200 OK with user data.
UI Screenshots
Here are some screenshots of the user interface:


Registration Screen:
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20135946.png)
Login Screen:
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20135926.png)
CRUD Screen:
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20212636.png)
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20212657.png)
![App Screenshot](https://github.com/kaviarasan2720/bdipluse_task/blob/main/Screenshot%202024-11-23%20212711.png)
