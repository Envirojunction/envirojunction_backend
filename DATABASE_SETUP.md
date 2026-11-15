# Database Setup & API Documentation

## Overview

The Enviro Junction backend uses **MongoDB** with **Mongoose ODM** for data persistence. All user data (signup, login, profile) is automatically saved to MongoDB.

---

## Database Configuration

### MongoDB Connection Details

The application connects to MongoDB using the connection string defined in `.env`:

```
MONGODB_URI=mongodb://localhost:27017/enviro_prod
```

**Components:**
- **Host**: `localhost` (your machine)
- **Port**: `27017` (MongoDB default port)
- **Database**: `enviro_prod` (where all data is stored)

---

## Setup Instructions

### 1. Install MongoDB

#### On macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### On macOS (using Docker - Recommended):
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### Other Platforms:
Visit: https://www.mongodb.com/try/download/community

---

### 2. Start MongoDB

#### Using Homebrew:
```bash
brew services start mongodb-community
```

#### Using Docker:
```bash
docker start mongodb
```

#### Verify MongoDB is Running:
```bash
mongosh  # Connect to MongoDB shell
```

You should see:
```
test>
```

Type `exit` to quit.

---

### 3. Install Project Dependencies

```bash
npm install
```

---

### 4. Configure Environment Variables

Ensure `.env` file has these variables:

```dotenv
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/enviro_prod

# JWT Secret Key (for authentication)
JWT_SECRET=envirojunction_sk_live_5xK9mL2@qP7$vN3wR8_yJ4&tG6%sZ1!bC9^hF5*dE2-uO4x

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

---

### 5. Start the Application

```bash
npm run start:dev
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║          🌍 ENVIRO JUNCTION - Backend Server 🌍           ║
╚═══════════════════════════════════════════════════════════╝

✅ Application is running on: http://localhost:3000
📦 Environment: development
🗄️  Database: mongodb://localhost:27017/enviro_prod
🔐 CORS enabled for origins:
   - http://localhost:3000
   - http://localhost:3001
   - http://localhost:5173

Available Endpoints:
  POST   /auth/signup        - Register new user
  POST   /auth/login         - Login user
  GET    /users/profile      - Get current user profile (requires JWT)
  GET    /users              - Get all users (requires JWT)
```

---

## API Endpoints

### 1. **POST /auth/signup** - Register New User

**Request:**
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active"
  }
}
```

**Where Data is Saved:**
- ✅ User document stored in MongoDB `users` collection
- ✅ Password is hashed using bcryptjs before storing
- ✅ Unique email constraint enforced

---

### 2. **POST /auth/login** - Login User

**Request:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active"
  }
}
```

**Where Data is Retrieved:**
- 🔍 User queried from MongoDB `users` collection by email
- 🔐 Password verified using bcryptjs.compare()
- 🎫 JWT token generated and returned

---

### 3. **GET /users/profile** - Get Current User Profile

**Request:**
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "active",
  "createdAt": "2026-04-02T10:30:00.000Z",
  "updatedAt": "2026-04-02T10:30:00.000Z"
}
```

**Where Data is Retrieved:**
- 🔍 User queried from MongoDB using decoded JWT `userId`
- 🔒 Requires valid JWT token in Authorization header
- 🚫 Password field is excluded from response

---

### 4. **GET /users** - Get All Users

**Request:**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "createdAt": "2026-04-02T10:30:00.000Z",
    "updatedAt": "2026-04-02T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "status": "active",
    "createdAt": "2026-04-02T11:45:00.000Z",
    "updatedAt": "2026-04-02T11:45:00.000Z"
  }
]
```

**Where Data is Retrieved:**
- 🔍 All users fetched from MongoDB `users` collection
- 🔒 Requires valid JWT token
- 🚫 Password field is excluded from all responses

---

## Data Schema

### User Collection in MongoDB

```javascript
{
  "_id": ObjectId,           // MongoDB unique identifier
  "name": String,            // User's full name
  "email": String,           // User's email (unique)
  "password": String,        // Hashed password (bcryptjs)
  "status": "active" | "inactive" | "suspended",  // User status
  "createdAt": Date,         // Created timestamp
  "updatedAt": Date,         // Last updated timestamp
  "__v": Number              // Version field (Mongoose internal)
}
```

---

## Database Operations Flow

### Signup Flow:
```
1. User submits: { name, email, password }
2. Check if email already exists in DB
   ├─ If yes → Return error "Email already exists"
   └─ If no → Continue
3. Hash password using bcryptjs (salt rounds: 10)
4. Create new user document in MongoDB
5. Generate JWT token (valid for 7 hours)
6. Return token + user data (without password)
```

### Login Flow:
```
1. User submits: { email, password }
2. Query MongoDB for user by email
   ├─ If not found → Return error "Invalid email or password"
   └─ If found → Continue
3. Compare submitted password with hashed password
   ├─ If mismatch → Return error "Invalid email or password"
   └─ If match → Continue
4. Generate JWT token (valid for 7 hours)
5. Return token + user data (without password)
```

### Profile Retrieval Flow:
```
1. Client sends request with JWT in Authorization header
2. JWT middleware verifies token and extracts userId
3. Query MongoDB for user by ID
4. Return user data (without password) or 401 if not found
```

---

## Verify Database Content

To view saved data in MongoDB:

### Using MongoDB Shell:
```bash
mongosh

# Connect to database
use enviro_prod

# See all users
db.users.find()

# See specific user
db.users.findOne({ email: "john@example.com" })

# Count users
db.users.countDocuments()
```

### Using MongoDB Compass (GUI):
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Navigate to `enviro_prod` database → `users` collection
4. View all saved users visually

---

## Common Issues & Solutions

### Issue: "connect ECONNREFUSED 127.0.0.1:27017"
**Problem:** MongoDB is not running

**Solution:**
```bash
# Start MongoDB
brew services start mongodb-community

# Or with Docker:
docker start mongodb
```

### Issue: "Email already exists"
**Problem:** User with that email already in database

**Solution:**
Use a different email or delete the user from MongoDB:
```bash
mongosh
use enviro_prod
db.users.deleteOne({ email: "john@example.com" })
```

### Issue: "Invalid token" or "Invalid email or password"
**Problem:** Wrong JWT or credentials

**Solution:**
- Ensure you're using the correct token from signup/login
- Tokens expire after 7 hours
- Check email and password are correct

### Issue: CORS errors
**Problem:** Frontend origin not in allowed list

**Solution:**
Update `ALLOWED_ORIGINS` in `.env`:
```dotenv
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173,http://your-frontend-url:port
```

---

## Summary

✅ **Data Storage:** MongoDB collection `enviro_prod.users`
✅ **Password Security:** Hashed with bcryptjs (10 salt rounds)
✅ **User Authentication:** JWT tokens (7-hour expiration)
✅ **Data Retrieval:** Automatic on login/signup/profile requests
✅ **Database Persistence:** All data persists even after server restart

Your signup and profile APIs are fully functional and all data is being saved to MongoDB!
