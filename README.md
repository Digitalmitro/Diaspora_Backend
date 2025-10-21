# Diaspora Backend API

A comprehensive backend API for the Diaspora platform - a job portal connecting job seekers and employers globally.

## Features

- JWT-based authentication with role-based access control
- User management (Job Seekers, Employers, Admin)
- Content Management System (CMS)
- Job posting and management
- Email verification and password reset
- Soft delete functionality
- User metadata and activity tracking
- Education matching system
- Cloudinary integration for media uploads
- Comprehensive logging with Winston

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator
- **File Upload:** Multer with Cloudinary
- **Email:** Nodemailer
- **Logging:** Winston
- **Security:** Helmet, CORS, bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Cloudinary account (for media storage)
- SMTP server or email service (for email notifications)

## Installation

### Step 1: Clone the repository

```bash
git clone <repository-url>
cd Diaspora_Backend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Create environment file

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
FRONTEND_URL=http://localhost:3000

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM_NAME=Diaspora

# Logging
LOG_LEVEL=info
```

### Step 4: Run the application

```bash
# Development mode with auto-reload
npm start

# Production mode
node index.js
```

The server will start at `http://localhost:5000`

## Project Structure

```text
Diaspora_Backend/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary setup
│   ├── constants.js     # Application constants
│   ├── db.js            # MongoDB connection
│   ├── email.js         # Email configuration
│   └── logger.js        # Winston logger setup
├── controller/          # Route controllers
│   ├── AuthController.js
│   └── cmsController.js
├── middleware/          # Custom middleware
│   ├── authMiddleware.js
│   ├── errorHandlerMiddleware.js
│   ├── rateLimitMiddleware.js
│   ├── roleCheckMiddleware.js
│   ├── securityMiddleware.js
│   └── upload.js
├── model/              # Mongoose models
│   ├── authModel.js
│   ├── jobSeekerProfileModel.js
│   ├── employerProfileModel.js
│   ├── experienceModel.js
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
│   ├── testimonialModel.js
│   ├── userMetadataModel.js
│   └── modelNames.js
├── plugins/            # Mongoose plugins
│   └── softDelete.plugin.js
├── routes/             # API routes
│   ├── authRoutes.js
│   └── cmsRoutes.js
├── services/           # Business logic
│   ├── authServices.js
│   └── cmsService.js
├── utils/              # Utility functions
│   ├── apiResponse.js
│   ├── authUtils.js
│   ├── catchAsync.js
│   ├── educationMatcher.js
│   ├── ErrorResponse.js
│   ├── sendEmailUtils.js
│   └── softDeleteUtils.js
├── validators/         # Request validators
│   ├── application.validator.js
│   ├── auth.validator.js
│   ├── cms.validator.js
│   └── job.validator.js
├── Tests/              # Test files
├── logs/               # Log files
├── postman/            # Postman collections
├── .env                # Environment variables
├── .gitignore
├── index.js            # Application entry point
└── package.json
```

## API Endpoints

### Authentication Routes

Base URL: `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register a new user | No |
| POST | `/login` | Login user | No |
| POST | `/verify-email` | Verify email address | No |
| POST | `/forgot-password` | Request password reset | No |
| POST | `/reset-password` | Reset password with token | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/update-profile` | Update user profile | Yes |
| POST | `/change-password` | Change password | Yes |

### CMS Routes

Base URL: `/cms`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new page | Admin |
| GET | `/` | Get all pages | No |
| GET | `/:slug` | Get page by slug | No |
| PUT | `/:slug` | Update page | Admin |
| DELETE | `/:slug` | Delete page | Admin |

### Example API Requests

#### Sign Up

```bash
curl -X POST http://localhost:5000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "jobseeker"
  }'
```

#### Login

```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

#### Get Current User

```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Models

### Core Models

#### User Model

- **Fields:** firstName, lastName, email, password, role, isVerified, isActive
- **Features:** Password hashing, soft delete, email verification

#### JobSeekerProfile Model

- **Fields:** userId, fullName, phone, resumeUrl, skills, education, preferredLocations, bio, profilePicture
- **Features:** Linked to User, soft delete

#### EmployerProfile Model

- **Fields:** userId, companyName, industry, website, verificationDocUrl, verificationStatus, employeeCount, description, logo
- **Features:** Verification system, soft delete

#### Experience Model

- **Fields:** userId, jobTitle, company, location, startDate, endDate, currentlyWorking, description, achievements
- **Features:** Separate schema for searchability, soft delete

#### Job Model

- **Fields:** employerId, title, department, description, location, isRemote, experienceRequired, skills (with levels), education, educationPreferences, salary, jobType, openings, perks, status, isFeatured
- **Features:** Advanced education matching, skill levels, soft delete

#### Application Model

- **Fields:** jobId, jobSeekerId, resumeUrl, coverLetter, status, skillsMatchScore, appliedAt
- **Features:** Skill matching score, soft delete

### CMS Models

#### CMS Page Model

- **Fields:** title, slug, content, sections (banner, secondary images), status, publishedAt
- **Features:** Multi-section support, slug-based routing, soft delete

#### Blog Model

- **Fields:** title, slug, content, excerpt, imageUrl, author, tags, status, publishedAt
- **Features:** Tag system, draft/published states, soft delete

#### FAQ Model

- **Fields:** question, answer, category, order, isActive
- **Features:** Categorization, ordering, soft delete

#### Testimonial Model

- **Fields:** name, designation, company, imageUrl, quote, rating, isActive, order
- **Features:** Rating system (1-5), ordering, soft delete

#### Partner Model

- **Fields:** name, logoUrl, websiteUrl, order, isActive
- **Features:** Ordering, soft delete

#### StaticPage Model

- **Fields:** pageType (privacy, terms, about, contact), title, content, lastUpdatedBy, lastUpdatedAt, history
- **Features:** Full audit history, version tracking, soft delete

### Subscription Models

#### SubscriptionPlan Model

- **Fields:** name (basic, pro, premium), displayName, monthlyPrice, yearlyPrice, currency, features (jobsAllowed, applicantsLimit, resumeViews, analytics, support), isActive
- **Features:** Tiered pricing, feature limits

#### Subscription Model

- **Fields:** employerId, planId, billingCycle, amount, currency, startDate, endDate, status, autoRenew
- **Features:** Auto-renewal, status tracking, soft delete

#### Payment Model

- **Fields:** userId, subscriptionId, amount, currency, paymentMethod, transactionId, status, invoiceUrl, metadata
- **Features:** Transaction tracking, multiple payment methods, soft delete

### Utility Models

#### UserMetadata Model

- **Fields:** userId, voidVariables (Map for temporary data), preferences, activityLog, lastLogin, loginHistory
- **Features:** Temporary token storage, activity tracking, login history

#### JobAlert Model

- **Fields:** jobSeekerId, title, location, skills, jobType, salaryMin, isActive, frequency, lastSent
- **Features:** Alert frequency control (daily, weekly), soft delete

## Security Features

### Authentication & Authorization

- JWT-based authentication
- Role-based access control (Admin, Employer, Job Seeker)
- Password hashing with bcryptjs (10 salt rounds)
- Email verification system
- Password reset with token expiry

### Security Middleware

- **Helmet.js** - Security headers configuration
- **CORS** - Cross-Origin Resource Sharing with whitelist
- **Rate Limiting** - Configurable rate limits per endpoint type
  - Auth endpoints: 5 requests per 15 minutes
  - General endpoints: 100 requests per 15 minutes
  - Strict endpoints: 3 requests per hour

### Data Protection

- Soft delete implementation across all models
- Input validation with Express Validator
- SQL injection prevention with Mongoose
- XSS protection with Helmet

## Logging System

Winston logger with multiple transports:

- **Console** - Colorized output in development
- **File** - Combined logs (combined.log)
- **Error File** - Error-only logs (error.log)
- **Daily Rotate** - Automatic log rotation

Log levels: error, warn, info, http, debug

## Testing

The project includes comprehensive test suites for models and validations.

```bash
# Run all model tests
npm test

# Quick validation test
npm run test:quick

# Validation and method tests
npm run test:validate
```

Test files are located in the `Tests/` directory.

## Error Handling

Centralized error handling with custom ErrorResponse class:

- **400** - Bad Request (validation errors)
- **401** - Unauthorized (authentication required)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found (resource doesn't exist)
- **429** - Too Many Requests (rate limit exceeded)
- **500** - Internal Server Error

Error responses follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Soft Delete

All deletable models implement soft delete functionality:

- **Fields Added:** isActive, isDeleted, deletedAt, deletedBy
- **Methods:** softDelete(), restore()
- **Query Helpers:** findNotDeleted(), findDeleted()

Benefits:

- Data retention for compliance (GDPR)
- Accidental deletion recovery
- Historical data analysis
- Audit trail maintenance

## Education Matching System

Sophisticated education matching for job applications:

### Institution Types

- IIT (Indian Institutes of Technology)
- NIT (National Institutes of Technology)
- IIIT (Indian Institutes of Information Technology)
- Tier 1, 2, 3 universities
- Ivy League
- Top universities worldwide

### Matching Features

- Pattern-based institution recognition
- Degree level comparison (Highschool to PhD)
- Field of study matching
- Strict vs lenient matching modes
- Scoring system (0-100)

Implementation: `utils/educationMatcher.js`

## Constants & Configuration

Centralized constants in `config/constants.js`:

### Categories

- Authentication & Security
- Rate Limiting
- Validation Constraints
- Status Enums
- User Roles & Types
- File Upload Limits
- Pagination Defaults
- Currency & Scoring
- Education & Skill Levels

Benefits:

- Single source of truth
- Easy configuration changes
- Reduced magic numbers
- Better maintainability

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `CLIENT_URL` | Frontend URL for CORS | Yes | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `EMAIL_HOST` | SMTP host | Yes | - |
| `EMAIL_PORT` | SMTP port | Yes | - |
| `EMAIL_USER` | SMTP username | Yes | - |
| `EMAIL_PASS` | SMTP password | Yes | - |
| `LOG_LEVEL` | Logging level | No | info |

## Postman Collection

Import the Postman collection for easy API testing:

- Collection: `postman/Diaspora_Backend_API.postman_collection.json`
- Development Environment: `postman/Diaspora_Development.postman_environment.json`
- Production Environment: `postman/Diaspora_Production.postman_environment.json`

See `postman/README.md` for detailed instructions.

## Troubleshooting

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
- Check file size limits (max 10MB)
- Ensure proper file format (JPEG, PNG, WebP)

### Email Sending Issues

- Verify SMTP credentials
- Check email service settings
- Enable "Less secure app access" for Gmail
- Use app-specific passwords

## Scripts

```json
{
  "start": "nodemon index.js",
  "test": "node Tests/testModels.js",
  "test:quick": "node Tests/quickTest.js",
  "test:validate": "node Tests/testValidations.js"
}
```

## Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use ES6+ features
- Follow ESLint configuration
- Write meaningful commit messages
- Add JSDoc comments for functions
- Include tests for new features

## License

This project is licensed under the ISC License.

## Authors

- **Diaspora Team** - Initial work

## Acknowledgments

- Express.js for the robust web framework
- MongoDB & Mongoose for database management
- Cloudinary for image hosting
- JWT for secure authentication
- All contributors and maintainers

## Support

For support, email <support@diaspora.com> or create an issue in the repository.

## Links

- [GitHub Repository](https://github.com/Digitalmitro-Org/DIASPORA-BACKEND)
- [API Documentation](https://github.com/Digitalmitro-Org/DIASPORA-BACKEND/wiki)
- [Issue Tracker](https://github.com/Digitalmitro-Org/DIASPORA-BACKEND/issues)

---
