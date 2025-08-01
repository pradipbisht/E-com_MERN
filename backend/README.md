# Backend API

A secure Node.js/Express backend API with user authentication, input validation, rate limiting, and comprehensive error handling.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Input Validation**: Comprehensive validation using Joi
- **Security**: Rate limiting, input sanitization, security headers with Helmet
- **Error Handling**: Custom error classes and global error handling
- **Database**: MongoDB with Mongoose ODM
- **Code Quality**: ES6 modules, async/await, and clean architecture

## 📦 Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
MONGODB_URL=mongodb://localhost:27017/your-database-name
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

5. Start the development server:

```bash
npm run dev
```

## 📚 API Endpoints

### Authentication Routes

#### Register User

- **POST** `/api/auth/register`
- **Body**:

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login User

- **POST** `/api/auth/login`
- **Body**:

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get User Profile (Protected)

- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`

## 🔒 Security Features

### Rate Limiting

- General API: 100 requests per 15 minutes
- Auth routes: 5 requests per 15 minutes
- Sensitive operations: 3 requests per hour

### Input Validation

- Username: 3-30 alphanumeric characters
- Email: Valid email format
- Password: Minimum 6 characters with uppercase, lowercase, number, and special character

### Security Headers

- Helmet.js for security headers
- CORS enabled
- Input sanitization to prevent NoSQL injection
- HTML tag removal

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   └── authController.js  # Authentication logic
│   ├── middlewares/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handling
│   │   ├── rateLimiter.js    # Rate limiting
│   │   ├── sanitize.js       # Input sanitization
│   │   └── validation.js     # Joi validation schemas
│   ├── models/
│   │   └── authModel.js      # User model
│   ├── routes/
│   │   └── authRoute.js      # Authentication routes
│   ├── utils/
│   │   └── errors.js         # Custom error classes
│   └── index.js              # Main application file
├── package.json
├── .env.example
└── README.md
```

## 🧪 Testing

The API can be tested using tools like Postman, Thunder Client, or curl.

Example curl command:

```bash
# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

## 🚨 Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // For validation errors
}
```

## 📈 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## 🔧 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🛠️ Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **express-mongo-sanitize** - Input sanitization
