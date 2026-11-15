# Enviro Junction - Backend API

A complete backend system built with NestJS, TypeScript, Mongoose, and JWT with MongoDB database integration.

**Features**: User authentication, user management, and news management with pagination.

> **🚀 Quick Start**: [QUICK_FIX_REFERENCE.md](./QUICK_FIX_REFERENCE.md) - Start here for a quick overview
>
> **📘 Setup Guide**: [SETUP.md](./SETUP.md) - Complete setup and troubleshooting
>
> **📰 News API**: [NEWS_API.md](./NEWS_API.md) - News module documentation
>
> **🗄️ Database**: [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Database configuration

## ✨ Features

### Authentication Module
- ✅ User signup with email and password (data saved to MongoDB)
- ✅ User login with JWT token generation
- ✅ JWT authentication for protected routes
- ✅ 7-hour token expiry
- ✅ Password hashing with bcryptjs

### User Management
- ✅ User profile retrieval from MongoDB
- ✅ User list retrieval (authenticated)
- ✅ User data persistence

### News Management
- ✅ Get news with pagination (public API, no auth required)
- ✅ Filter news by category
- ✅ Search news by title or description
- ✅ MongoDB integration with Mongoose
- ✅ Web scraping capability for news data

### Quality & Security
- ✅ Input validation with class-validator
- ✅ CORS configuration
- ✅ ESLint configuration
- ✅ TypeScript strict type checking
- ✅ Comprehensive error handling

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd Enviro
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your settings:**
   ```
   MONGODB_URI=mongodb://localhost:27017/enviro_prod
   JWT_SECRET=your-super-secret-jwt-key
   PORT=3000
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
   ```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

The API will be available at `http://localhost:3000`

## API Endpoints

### 1. Signup (Create User Account)

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
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

### 2. Login (Authenticate User)

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
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

### 3. Get User Profile (Protected)

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "active",
  "createdAt": "2024-03-18T10:30:00.000Z",
  "updatedAt": "2024-03-18T10:30:00.000Z"
}
```

### 4. Get All Users (Protected)

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "active",
    "createdAt": "2024-03-18T10:30:00.000Z",
    "updatedAt": "2024-03-18T10:30:00.000Z"
  }
]
```

## User Schema

The User model has the following fields:

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `_id` | ObjectId | Auto | - | MongoDB ObjectId |
| `name` | String | Yes | - | User's full name |
| `email` | String | Yes | - | Unique email address |
| `password` | String | Yes | - | Hashed password (bcryptjs) |
| `status` | String | No | 'active' | 'active', 'inactive', 'suspended' |
| `createdAt` | Date | Auto | Now | Timestamp of creation |
| `updatedAt` | Date | Auto | Now | Timestamp of last update |

## Authentication Flow

1. User signs up with name, email, and password
2. Password is hashed using bcryptjs
3. User record is created in MongoDB
4. JWT token is generated (valid for 7 hours)
5. User can login with email and password
6. After login, JWT token is provided
7. Protected routes require JWT token in Authorization header
8. Token is validated using Passport JWT strategy

## JWT Token Details

- **Expiry:** 7 hours
- **Algorithm:** HS256
- **Header Format:** `Authorization: Bearer <token>`
- **Payload:**
  ```
  {
    sub: userId,
    email: userEmail,
    iat: issuedAtTime,
    exp: expirationTime
  }
  ```

## CORS Configuration

CORS is enabled to allow requests from specified origins. By default, the following origins are allowed:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`

### Customizing CORS Origins

Edit the `ALLOWED_ORIGINS` environment variable in `.env`:

**For Development:**
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:5173
```

**For Production:**
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### CORS Features

- **Credentials:** Enabled (allows cookies and authentication headers)
- **HTTP Methods:** GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers:** Content-Type, Authorization
- **Max Age:** 3600 seconds (1 hour)

This configuration ensures that:
- Your frontend deployed anywhere can call this API
- Authentication headers are properly transmitted
- Preflight requests are handled correctly
- No CORS errors will occur for allowed origins

## Project Structure

```
src/
├── auth/
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── dto/
│   │   ├── signup.dto.ts
│   │   └── login.dto.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── app.controller.ts
├── app.service.ts
├── app.module.ts
└── main.ts
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start in development mode with watch
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start in production mode
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## Testing with cURL/Postman

### Signup Example
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Profile Example
```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Error Handling

- **400 Bad Request:** Email already exists or validation fails
- **401 Unauthorized:** Invalid credentials or missing/invalid JWT token
- **500 Internal Server Error:** Server error

## Security Considerations

1. Change `JWT_SECRET` in production to a strong random key
2. Use HTTPS in production
3. Store JWT tokens securely on the client side
4. Implement rate limiting for login/signup endpoints
5. Use environment variables for sensitive data
6. Implement refresh token mechanism for long-lived sessions
7. Add CORS configuration as needed

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGODB_URI` in `.env`
- Verify database credentials if using MongoDB Atlas

### JWT Token Issues
- Ensure `JWT_SECRET` is set correctly
- Check token format: `Authorization: Bearer <token>`
- Verify token hasn't expired (7 hours)

## License

UNLICENSED

## Support

For issues or questions, please contact the development team.
