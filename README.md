# Eduyata Platform - Structured Backend

## Project Structure
```
e:\Edutaspring\
├── backend/                           # Spring Boot Backend
│   ├── src/main/java/com/eduyata/platform/
│   │   ├── EduyataPlatformApplication.java    # Main application
│   │   ├── model/                             # Entity models
│   │   │   ├── Student.java
│   │   │   ├── Educator.java
│   │   │   ├── Course.java
│   │   │   └── Enrollment.java
│   │   ├── repository/                        # Data access layer
│   │   │   ├── StudentRepository.java
│   │   │   ├── EducatorRepository.java
│   │   │   ├── CourseRepository.java
│   │   │   └── EnrollmentRepository.java
│   │   ├── service/                           # Business logic
│   │   │   ├── StudentService.java
│   │   │   ├── EducatorService.java
│   │   │   └── CourseService.java
│   │   ├── controller/                        # REST controllers
│   │   │   ├── StudentController.java
│   │   │   ├── EducatorController.java
│   │   │   └── CourseController.java
│   │   └── config/                            # Configuration
│   │       └── SecurityConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── frontend/                          # React Frontend
    ├── src/
    │   ├── App.tsx                   # Complete frontend
    │   ├── main.tsx
    │   └── index.css
    ├── package.json
    ├── vite.config.ts
    └── index.html
```

## Prerequisites
- **Java 17+** (JDK 17 or higher)
- **Node.js 18+** (with npm)
- **MySQL 8.0** (running on localhost:3306)
- **Maven 3.6+** (for building backend)

## Setup Instructions

### 1. Database Setup

**Step 1:** Start MySQL server and create database
```sql
CREATE DATABASE eduyata_db;
```

**Step 2:** Verify MySQL connection
- Host: `localhost`
- Port: `3306`
- Database: `eduyata_db`
- Username: `root`
- Password: `root`

*Note: Update credentials in `backend/src/main/resources/application.properties` if different*

### 2. Backend Setup (Spring Boot)

**Step 1:** Navigate to backend directory
```bash
cd backend
```

**Step 2:** Clean and compile
```bash
mvn clean compile
```

**Step 3:** Run the application
```bash
mvn spring-boot:run
```

**Alternative:** Run with IDE
- Open `EduyataPlatformApplication.java`
- Right-click → Run

**Backend will start on:** http://localhost:8080

### 3. Frontend Setup (React + Vite)

**Step 1:** Navigate to frontend directory
```bash
cd frontend
```

**Step 2:** Install dependencies
```bash
npm install
```

**Step 3:** Start development server
```bash
npm run dev
```

**Frontend will start on:** http://localhost:5173

## Troubleshooting

### Common Issues

**1. Port 8080 already in use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**2. Database connection failed**
- Ensure MySQL is running
- Verify database `eduyata_db` exists
- Check credentials in `application.properties`

**3. Maven build fails**
```bash
# Clean and reinstall dependencies
mvn clean install
```

**4. Frontend build fails**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**5. CORS errors**
- Ensure backend is running on port 8080
- Frontend should be on port 5173
- CORS is configured for both ports

## Backend Architecture

### Models (Entity Layer)
- **Student.java** - Student entity with profile management
- **Educator.java** - Teacher entity with approval workflow
- **Course.java** - Course entity with instructor relationships
- **Enrollment.java** - Student-course enrollment tracking

### Repositories (Data Access Layer)
- **StudentRepository.java** - Student data operations
- **EducatorRepository.java** - Teacher data operations
- **CourseRepository.java** - Course data operations
- **EnrollmentRepository.java** - Enrollment data operations

### Services (Business Logic Layer)
- **StudentService.java** - Student business logic
- **EducatorService.java** - Teacher business logic
- **CourseService.java** - Course management logic

### Controllers (API Layer)
- **StudentController.java** - Student authentication & profile APIs
- **EducatorController.java** - Teacher management APIs
- **CourseController.java** - Course & enrollment APIs

### Configuration
- **SecurityConfig.java** - Spring Security configuration
- **application.properties** - Database and app configuration

## API Endpoints

### Authentication
- `POST /api/auth/student/register` - Student registration
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/teacher/register` - Teacher registration
- `POST /api/auth/teacher/login` - Teacher login
- `GET /api/auth/get_student` - Get student details

### Courses
- `GET /api/courses/dashboard_stats` - Dashboard statistics
- `GET /api/courses/my_courses` - User's enrolled courses
- `GET /api/courses/all` - All available courses

## Features
- ✅ Student Authentication (Login/Register)
- ✅ Teacher Registration & Approval
- ✅ Dashboard with Statistics
- ✅ Course Management
- ✅ Progress Tracking
- ✅ Structured Spring Boot Architecture
- ✅ Complete API Integration
- ✅ CORS Configuration
- ✅ JWT Authentication
- ✅ MySQL Database Integration

## Development Workflow

### Running in Development
1. **Start MySQL** (ensure it's running on port 3306)
2. **Start Backend** (runs on port 8080)
   ```bash
   cd backend && mvn spring-boot:run
   ```
3. **Start Frontend** (runs on port 5173)
   ```bash
   cd frontend && npm run dev
   ```
4. **Access Application** at http://localhost:5173

### Building for Production

**Backend:**
```bash
cd backend
mvn clean package
java -jar target/eduyata-backend-1.0.0.jar
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ folder to web server
```

## Test Login Credentials
- **Student**: Use any student ID with password: `123456789` (master password)
- **Teacher**: Register through the application
- **Admin**: Configure in database

## Configuration Files

### Backend Configuration
**File:** `backend/src/main/resources/application.properties`
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/eduyata_db
spring.datasource.username=root
spring.datasource.password=root

# Server
server.port=8080

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true
```

### Frontend Configuration
**File:** `frontend/vite.config.ts`
```typescript
export default defineConfig({
  server: {
    port: 5173
  }
})
```

## Support
For issues or questions:
- Check the troubleshooting section above
- Ensure all prerequisites are installed
- Verify database connection
- Check console logs for detailed error messages