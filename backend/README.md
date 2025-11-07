# NexusCreate Backend

Complete Node.js/Express.js backend for the NexusCreate platform.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
```

Then edit `.env` and add your actual values:
- MongoDB connection string
- JWT secrets
- Google OAuth credentials
- OpenAI API key
- Cloudinary credentials
- Email service settings

3. **Start MongoDB** (if running locally):
```bash
mongod
```

4. **Run the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── models/           # MongoDB models
│   ├── User.js
│   ├── Business.js
│   ├── Team.js
│   ├── BlogPost.js
│   ├── Product.js
│   ├── Service.js
│   ├── Customer.js
│   ├── Order.js
│   ├── Appointment.js
│   ├── Chatbot.js
│   ├── File.js
│   ├── Notification.js
│   └── Analytics.js
├── controllers/      # Business logic
│   ├── authController.js
│   ├── businessController.js
│   └── aiController.js
├── routes/          # API routes
│   ├── auth.js
│   ├── businesses.js
│   └── ai.js
├── middleware/      # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   ├── errorHandler.js
│   ├── rateLimit.js
│   ├── upload.js
│   └── teamAuth.js
├── utils/           # Utilities
│   ├── emailService.js
│   └── aiService.js
├── config/          # Configuration
│   ├── database.js
│   ├── cloudinary.js
│   └── passport.js
├── sockets/         # Socket.io
│   └── index.js
├── server.js        # Entry point
├── .env.example     # Environment variables template
└── package.json
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Businesses
- `POST /api/businesses` - Create business
- `GET /api/businesses` - Get all businesses for user
- `GET /api/businesses/:id` - Get single business
- `PUT /api/businesses/:id` - Update business
- `DELETE /api/businesses/:id` - Delete business

### AI/Chatbot
- `POST /api/ai/chat` - Send message to chatbot
- `GET /api/ai/conversations/:sessionId` - Get conversation
- `GET /api/ai/conversations/business/:businessId` - Get all conversations
- `PUT /api/ai/config/:businessId` - Update chatbot config
- `POST /api/ai/generate` - Generate content with AI

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🌐 External Services Required

### MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

### OpenAI API
1. Get API key from https://platform.openai.com/
2. Add to `.env` as `OPENAI_API_KEY`

### Cloudinary (File Uploads)
1. Create account at https://cloudinary.com/
2. Get cloud name, API key, API secret
3. Add to `.env`

### Google OAuth (Optional)
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Add client ID and secret to `.env`

### Email Service (Gmail example)
1. Enable 2-factor authentication on Gmail
2. Generate app password
3. Add to `.env` as `EMAIL_USER` and `EMAIL_PASS`

## 🔧 Environment Variables

Required variables in `.env`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_REFRESH_SECRET=your_refresh_token_secret

# Frontend (for CORS)
FRONTEND_URL=http://localhost:8080

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

## 🚀 Deployment

### Deploy to Railway

1. Create account at https://railway.app/
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables
5. Deploy

### Deploy to Heroku

1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add MongoDB addon: `heroku addons:create mongolab`
4. Set environment variables: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

### Deploy to DigitalOcean

1. Create Droplet
2. SSH into server
3. Install Node.js and MongoDB
4. Clone repository
5. Install dependencies and run with PM2

## 📊 Database Models

### Key Models:
- **User** - Authentication and user data
- **Business** - Business profiles (blogging, ecommerce, services)
- **Team** - Team workspace with members and permissions
- **BlogPost** - Blog content (for blogging businesses)
- **Product** - Products (for ecommerce businesses)
- **Service** - Services (for service businesses)
- **Customer** - Customer data
- **Order** - E-commerce orders
- **Appointment** - Service bookings
- **Chatbot** - AI chatbot conversations and config
- **File** - Uploaded files metadata
- **Notification** - User notifications
- **Analytics** - Business analytics data

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- MongoDB injection prevention

## 🐛 Debugging

Check logs for errors:
```bash
# Server logs
npm run dev

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

## 📝 API Testing

Use Postman or curl to test endpoints:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","fullName":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🤝 Contributing

This is a complete backend implementation. Customize as needed for your specific requirements.

## 📄 License

ISC
