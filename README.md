# MERN Stack Application with MySQL and Docker

A full-stack web application built with MySQL, Express, React, and Node.js, all containerized with Docker.

## 🏗️ Architecture

This application consists of three main services:

- **MySQL Database** - Stores users and posts data
- **Express Backend** - RESTful API server running on port 5000
- **React Frontend** - User interface running on port 3000

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## 🚀 Quick Start

1. **Clone or navigate to the project directory:**
   ```bash
   cd mern-docker
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

   This will:
   - Build the backend and frontend Docker images
   - Start MySQL database
   - Start Express backend
   - Start React frontend

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - MySQL: localhost:3307 (external access)

## 📁 Project Structure

```
mern-docker/
├── docker-compose.yml          # Docker Compose configuration
├── backend/
│   ├── Dockerfile              # Backend Docker image
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express server and API routes
│   ├── db/
│   │   └── init.sql           # Database initialization script
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── Dockerfile             # Frontend Docker image
│   ├── package.json           # Frontend dependencies
│   ├── public/
│   │   └── index.html         # HTML template
│   └── src/
│       ├── App.js             # Main React component
│       ├── App.css            # Application styles
│       ├── index.js           # React entry point
│       ├── index.css          # Global styles
│       └── pages/
│           ├── Home.js        # Home page
│           ├── Users.js       # User management page
│           └── Posts.js       # Post management page
└── README.md                  # This file
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Check backend status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post

## 🎨 Features

### Home Page
- Displays application information
- Shows backend connection status
- Lists application features

### Users Page
- View all users in a table
- Create new users with name, email, and age
- Edit existing users
- Delete users
- Form validation

### Posts Page
- View all posts with author information
- Create new posts with title, content, and author selection
- Posts are associated with users

## 🛠️ Development

### Running in Development Mode

The Docker setup includes volume mounts for hot-reloading:

- Backend changes will require a restart: `docker-compose restart backend`
- Frontend changes will hot-reload automatically

### Database Access

To access MySQL directly:

```bash
# From inside the container (recommended)
docker exec -it mern-mysql mysql -u mern_user -pmern_password mern_db

# From host machine (if you have MySQL client installed)
mysql -h 127.0.0.1 -P 3307 -u mern_user -pmern_password mern_db
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Stopping Services

```bash
docker-compose down
```

To also remove volumes (⚠️ this will delete all data):

```bash
docker-compose down -v
```

## 🔧 Configuration

### Environment Variables

Backend environment variables can be set in `docker-compose.yml` or via a `.env` file:

- `DB_HOST` - MySQL host (default: mysql)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL user (default: mern_user)
- `DB_PASSWORD` - MySQL password (default: mern_password)
- `DB_NAME` - Database name (default: mern_db)
- `PORT` - Backend port (default: 5000)

Frontend environment variables:

- `REACT_APP_API_URL` - Backend API URL (default: http://localhost:5000/api)

## 📝 Database Schema

### Users Table
- `id` - Primary key (auto-increment)
- `name` - User name (required)
- `email` - User email (required, unique)
- `age` - User age (optional)
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Posts Table
- `id` - Primary key (auto-increment)
- `title` - Post title (required)
- `content` - Post content (required)
- `user_id` - Foreign key to users table
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🐛 Troubleshooting

### Port Already in Use
If ports 3000, 5000, or 3307 are already in use, modify the port mappings in `docker-compose.yml`. Note: MySQL uses port 3307 on the host to avoid conflicts with existing MySQL installations.

### Database Connection Issues
Ensure MySQL container is healthy before starting the backend. The backend waits for MySQL to be ready.

### Frontend Can't Reach Backend
Make sure `REACT_APP_API_URL` is correctly set. In Docker, use `http://localhost:5000/api` for local development.

## 🔄 CI/CD with GitHub Actions

This project includes automated CI/CD pipelines using GitHub Actions.

### Workflows

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`)
   - Runs on push and pull requests to main/master/develop branches
   - Tests and builds backend and frontend separately
   - Runs integration tests with Docker Compose
   - Pushes Docker images to GitHub Container Registry on main/master branch

2. **Docker Build and Test** (`.github/workflows/docker-build.yml`)
   - Can be triggered manually or on push/PR
   - Builds all services with Docker Compose
   - Runs comprehensive integration tests
   - Verifies database connectivity and API endpoints

### Workflow Features

- ✅ Automated testing of backend and frontend
- ✅ Docker image building and validation
- ✅ Integration tests with full stack
- ✅ Automatic image publishing to GitHub Container Registry
- ✅ Health checks for all services
- ✅ API endpoint validation

### Viewing Workflow Status

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. View workflow runs and their status

### Using Published Images

Images are published to GitHub Container Registry:
- `ghcr.io/<username>/<repo>-backend:latest`
- `ghcr.io/<username>/<repo>-frontend:latest`

To pull and use:
```bash
docker pull ghcr.io/<username>/<repo>-backend:latest
docker pull ghcr.io/<username>/<repo>-frontend:latest
```

## 📤 Pushing to GitHub

To push this repository to GitHub:

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Create a new repository (e.g., `mern-docker`)

2. **Initialize git and push (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: MERN stack with MySQL and Docker"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. **The CI/CD pipeline will automatically run** on push!

## 📄 License

This project is open source and available for educational purposes.
