# Company Registration App

A full-stack web application for secure company registration and management.

**Live Demo:** https://your-domain.vercel.app  
**GitHub:** https://github.com/abhinandanjain001/compony-registeration-website

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based user authentication with bcrypt
- 📝 **Multi-step Registration** - Guided 4-step company onboarding form
- 📊 **Dashboard** - Real-time analytics with charts and metrics
- 📸 **Image Upload** - Logo/banner uploads with Cloudinary integration
- 🎨 **Modern UI** - React, Tailwind CSS, Material-UI components
- 🌙 **Dark Mode** - Full dark/light theme support
- 📱 **Responsive** - Mobile-first responsive design
- ⚡ **State Management** - Redux Toolkit with async thunks
- 🔒 **Form Validation** - Yup schema validation
- 🚀 **Production Ready** - Docker support, environment configs

## 🛠 Tech Stack

### Frontend
- **React 19** + Vite
- **Redux Toolkit** for state management
- **Tailwind CSS** + **Material-UI** for styling
- **react-hook-form** + **Yup** for forms
- **Recharts** for data visualization
- **Axios** with interceptors

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** database with pooling
- **JWT** authentication
- **Multer** for file uploads
- **Cloudinary** for image storage
- **Helmet** for security headers
- **Morgan** for logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/abhinandanjain001/compony-registeration-website.git
cd compony-registeration-website

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173 in your browser.

## 📦 Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE company_registration;"

# Create user
psql -U postgres -c "CREATE USER company_user WITH PASSWORD 'your_password';"

# Grant privileges
psql -U postgres -d company_registration << EOF
GRANT ALL PRIVILEGES ON DATABASE company_registration TO company_user;
GRANT ALL ON SCHEMA public TO company_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO company_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO company_user;
EOF

# Import schema
psql -U company_user -d company_registration -f database/schema.sql
```

## 🌐 API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-mobile` - Verify phone number
- `GET /api/auth/verify-email/:token` - Email verification

### Company Routes
- `POST /api/company/register` - Create company profile
- `GET /api/company/profile` - Get user's company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/upload-logo` - Upload company logo
- `POST /api/company/upload-banner` - Upload company banner

## 📋 Project Structure

```
company-registration-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Auth, validation
│   │   ├── config/          # Database
│   │   └── utils/           # Helpers
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/           # Page components
│   │   ├── components/      # UI components
│   │   ├── services/        # API client
│   │   ├── store/           # Redux state
│   │   └── utils/           # Utilities
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── schema.sql
├── vercel.json              # Vercel config
├── DEPLOYMENT.md            # Deploy guide
└── README.md
```

## ⚙️ Environment Variables

### Backend (.env)