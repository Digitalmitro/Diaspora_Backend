# Diaspora Backend

A comprehensive backend API for the Diaspora platform - a job portal connecting job seekers and employers globally.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Job Seeker, Employer, Admin)
  - Secure password hashing with bcrypt
  - Protected routes middleware

- **Content Management System (CMS)**
  - Dynamic page creation and management
  - Image upload with Cloudinary integration
  - Multi-section page support (banners, secondary images)
  - Slug-based routing

- **User Profiles**
  - Job Seeker profiles with skills, experience, and education
  - Employer profiles with company information
  - Profile verification system

- **Job Management**
  - Job posting and applications
  - Job alerts system
  - Advanced filtering and search

- **Subscription System**
  - Subscription plans management
  - Payment processing integration
  - User subscription tracking

- **Additional Features**
  - Blog management
  - FAQ system
  - Testimonials
  - Partner management
  - Static pages

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Diaspora_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGO_URI=mongodb://localhost:27017/diaspora_db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Client URL
   CLIENT_URL=http://localhost:3000

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm start

   # Production mode
   node index.js
   ```

The server will start at `http://localhost:5000`

## 📁 Project Structure

```
Diaspora_Backend/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary setup
│   └── db.js            # MongoDB connection
├── controller/          # Route controllers
│   ├── AuthController.js
│   └── cmsController.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js  # JWT authentication
│   └── upload.js          # Multer & Cloudinary upload
├── model/              # Mongoose models
│   ├── authModel.js
│   ├── jobSeekerProfileModel.js
│   ├── employerProfileModel.js
│   ├── jobModel.js
│   ├── applicationModel.js
│   ├── blogModel.js
│   ├── cmsModel.js
│   ├── faqModel.js
│   ├── jobAlertModel.js
│   ├── partnerModel.js
│   ├── paymentModel.js
│   ├── staticPageModel.js
│   ├── subscriptionModel.js
│   ├── subscriptionPlanModel.js
│   └── testimonialModel.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── cmsRoutes.js
├── services/           # Business logic
│   ├── authServices.js
│   └── cmsService.js
├── utils/              # Utility functions
│   └── authUtils.js
├── Tests/              # Test files
│   ├── testModels.js
│   ├── quickTest.js
│   ├── testValidations.js
│   ├── testJobsAndApplications.js
│   └── seedSubscriptionPlans.js
├── .env                # Environment variables
├── .gitignore
├── index.js            # Application entry point
└── package.json
```

## 🔌 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |

### CMS Routes (`/cms`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/cms` | Create a new page | Admin |
| GET | `/cms` | Get all pages | No |
| GET | `/cms/:slug` | Get page by slug | No |
| PUT | `/cms/:slug` | Update page | Admin |

### Example Requests

**Sign Up**
```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "role": "jobseeker"
  }'
```

**Login**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Get Current User**
```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🧪 Testing

The project includes comprehensive test suites for models and validations.

```bash
# Run all model tests
npm test

# Quick validation test
npm run test:quick

# Validation and method tests
npm run test:validate

# Seed subscription plans
node Tests/seedSubscriptionPlans.js

# Force seed (replace existing plans)
node Tests/seedSubscriptionPlans.js --force
```

See [Tests/README.md](Tests/README.md) for detailed testing documentation.

## 🔒 Security Features

- **Helmet.js**: Security headers configuration
- **CORS**: Cross-Origin Resource Sharing with whitelist
- **JWT**: Secure token-based authentication
- **bcrypt**: Password hashing with salt rounds
- **Input Validation**: Express-validator for request validation
- **Environment Variables**: Sensitive data protection

## 🖼️ File Upload

The application uses Cloudinary for image storage with the following configuration:

- Maximum file size: Configurable via Multer
- Supported formats: Images (jpg, png, webp, etc.)
- Storage: Cloud-based (Cloudinary)
- Upload fields: banner, secondaryImage, home sections

## 📊 Database Models

### Core Models

- **User**: Authentication and user management
- **JobSeekerProfile**: Job seeker information and qualifications
- **EmployerProfile**: Company and employer details
- **Job**: Job postings
- **Application**: Job applications
- **Subscription**: User subscriptions
- **SubscriptionPlan**: Available subscription plans

### CMS Models

- **CMS**: Dynamic pages
- **Blog**: Blog posts
- **FAQ**: Frequently asked questions
- **Testimonial**: User testimonials
- **Partner**: Partner organizations
- **StaticPage**: Static content pages

## 🚦 Middleware

### Authentication Middleware (`protect`)
Protects routes by verifying JWT tokens and attaching user information to requests.

### Upload Middleware
Handles file uploads with Multer and Cloudinary integration.

## 🔧 Scripts

```json
{
  "start": "nodemon index.js",          // Development server with auto-reload
  "test": "node Tests/testModels.js",   // Run model tests
  "test:quick": "node Tests/quickTest.js", // Quick validation
  "test:validate": "node Tests/testValidations.js" // Validation tests
}
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No (default: 7d) |
| `CLIENT_URL` | Frontend URL for CORS | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# Verify connection string in .env
echo $MONGO_URI
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Cloudinary Upload Errors
- Verify API credentials in `.env`
- Check file size limits
- Ensure proper file format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Diaspora Team** - *Initial work*

## 🙏 Acknowledgments

- Express.js for the robust web framework
- MongoDB & Mongoose for database management
- Cloudinary for image hosting
- JWT for secure authentication
- All contributors and maintainers

## 📞 Support

For support, email support@diaspora.com or create an issue in the repository.

---

**Built with ❤️ by the Diaspora Team**
