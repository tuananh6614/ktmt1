
# Backend API Documentation

## Overview
This directory contains the backend API implementation for the DT&KTMT1 application.

## Directory Structure
```
backend/
├── config/        # Database and other configurations
├── controllers/   # Request handlers
├── middleware/    # Custom middleware
└── routes/        # API routes
```

## Setup & Usage
1. Ensure MySQL is running (XAMPP)
2. Create database `dbktmt1`
3. Run SQL migrations
4. Start the server: `node index.js`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/logout` - User logout
- `GET /api/users/me` - Get current user info
- `PUT /api/users/updatedetails` - Update user details
- `PUT /api/users/updatepassword` - Change password

For complete API documentation, check individual route files.
