# NB26-LMS – Serverless Learning Management System

A cloud-based Learning Management System built using **React.js and AWS Serverless services**.

NB26-LMS allows administrators and HR teams to manage employees, create courses and quizzes, assign learning content, track employee progress, generate course completion certificates, and verify certificates.

---

# 📌 Project Overview

NB26-LMS is designed using a serverless architecture where the React frontend communicates with AWS backend services through Amazon API Gateway and AWS Lambda.

The system supports the following complete learning workflow:

```text
Create Employee
      ↓
Create Course
      ↓
Assign Course
      ↓
Track Employee Progress
      ↓
Attempt Quiz
      ↓
Pass Course
      ↓
Generate Certificate
      ↓
Store Certificate in Amazon S3
      ↓
Verify Certificate
```

---

# 🚀 Features

## 👥 1. Employee Management

Administrators can create and manage employee records.

Features include:

* Create employees
* Retrieve employee details
* Store employee information
* Support employee onboarding details
* Manage department and role
* Manage reporting manager
* Manage joining date
* Manage employment type
* Track employee status

Example employee IDs:

```text
EMP001
EMP002
EMP003
EMP004
EMP005
```

---

## 📚 2. Course Management

Administrators can create and manage learning courses.

Each course contains:

* Course ID
* Course title
* Description
* External video URL
* Passing score
* Mandatory status
* Assigned roles
* Creation date

### Example Courses

| Course ID | Course Name                 |
| --------- | --------------------------- |
| CRS001    | AWS Cloud Fundamentals      |
| CRS002    | AWS Security Fundamentals   |
| CRS003    | AWS DevOps Fundamentals     |
| CRS004    | AWS Lambda Fundamentals     |
| CRS005    | AWS Serverless Fundamentals |

---

## 🎯 3. Employee Course Assignment

Courses can be assigned to employees and their learning progress can be tracked.

The system tracks:

* Employee ID
* Course ID
* Course title
* Assignment date
* Due date
* Progress percentage
* Attempt count
* Course status

### Course Status

```text
not_started
in progress
passed
failed
```

Example API:

```text
GET /employee-courses?employee_id={employee_id}
```

---

## 📝 4. Quiz System

Employees can attempt quizzes related to assigned courses.

The quiz system supports:

* Multiple-choice questions
* Passing score
* Quiz attempt tracking
* Maximum attempt control
* Automatic evaluation
* Course progress updates
* Passed and failed status

After a successful quiz attempt, the employee's course progress can be updated to completed.

---

## 🏆 5. Certificate Generation

When an employee successfully completes a course, the system can generate a PDF certificate.

The certificate contains:

* Certificate ID
* Employee name
* Employee ID
* Course name
* Completion date
* Certificate status

Certificates are generated using:

```text
AWS Lambda
+
Python
+
ReportLab
```

The generated certificate is stored in Amazon S3.

Example structure:

```text
certificates/
└── EMP004/
    └── CRS001.pdf
```

---

## 🔍 6. Certificate Verification

Certificates can be verified using a unique Certificate ID.

Example endpoint:

```text
GET /verify/{certificate_id}
```

The verification system returns:

* Certificate validity
* Employee name
* Course name
* Completion date
* Certificate status

Example:

```text
GET /verify/CERT-XXXXXXXXXXXX
```

---

## 📄 7. Secure Certificate PDF Access

Generated certificate PDFs are stored privately in Amazon S3.

The application generates temporary secure URLs for accessing certificates instead of making the S3 bucket publicly accessible.

Lambda permissions include:

```text
s3:GetObject
s3:PutObject
```

---

# 🏗️ System Architecture

![NB26-LMS Architecture](images/architecture.png)

```text
                    ┌───────────────────┐
                    │   React Frontend  │
                    │   React + Vite    │
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │ Amazon API Gateway│
                    └─────────┬─────────┘
                              │
                              ▼
                    ┌───────────────────┐
                    │    AWS Lambda     │
                    │  Backend Services │
                    └──────┬─────┬──────┘
                           │     │
                ┌──────────┘     └──────────┐
                ▼                           ▼
       ┌─────────────────┐          ┌─────────────────┐
       │ Amazon DynamoDB │          │    Amazon S3    │
       │                 │          │                 │
       │ • Employees     │          │ PDF Certificates│
       │ • Courses       │          └─────────────────┘
       │ • Quizzes       │
       │ • Assignments   │
       │ • Certificates  │
       └─────────────────┘
```

---

# ☁️ AWS Infrastructure

![NB26-LMS AWS Infrastructure](images/infrastructure.png)

The project uses the following AWS services:

| AWS Service        | Purpose                               |
| ------------------ | ------------------------------------- |
| Amazon API Gateway | Exposes REST APIs to the frontend     |
| AWS Lambda         | Serverless backend logic              |
| Amazon DynamoDB    | Stores application data               |
| Amazon S3          | Stores generated PDF certificates     |
| AWS IAM            | Controls permissions between services |
| Amazon SES         | Email notifications, where configured |

---

# 🔄 Application Working Flow

![NB26-LMS Working Flow](images/working-flow.png)

```text
┌───────────────┐
│ Admin / HR    │
└───────┬───────┘
        │
        ▼
┌───────────────────────┐
│ Create Employee       │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Create / Manage Course│
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Assign Course         │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Employee Learning     │
│ Progress Tracking     │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Attempt Quiz          │
└───────┬───────────────┘
        │
        ▼
   ┌───────────────┐
   │ Quiz Passed?  │
   └───────┬───────┘
       Yes │
           ▼
┌───────────────────────┐
│ Generate Certificate  │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Store PDF in S3       │
└───────┬───────────────┘
        │
        ▼
┌───────────────────────┐
│ Verify Certificate    │
└───────────────────────┘
```

---

# ⚙️ AWS Lambda Functionality

AWS Lambda functions handle the backend business logic.

Main functionality includes:

* Employee creation
* Employee retrieval
* Course management
* Course assignment
* Quiz creation
* Quiz submission
* Employee progress tracking
* Certificate generation
* Certificate retrieval
* Certificate verification

Example backend flow:

```text
API Request
     │
     ▼
Amazon API Gateway
     │
     ▼
AWS Lambda
     │
 ┌───┴───────────────┐
 │                   │
 ▼                   ▼
DynamoDB             S3
Application Data     PDF Certificates
```

---

# 🗄️ DynamoDB

Amazon DynamoDB is used to store application data.

The system stores information related to:

* Employees
* Courses
* Quizzes
* Employee course assignments
* Quiz attempts
* Certificates

Example data relationship:

```text
Employee
   │
   └── Assigned Courses
             │
             └── Quiz Attempts
                       │
                       └── Course Completion
                                  │
                                  └── Certificate
```

---

# 📦 Amazon S3

Amazon S3 stores generated PDF certificates.

Example structure:

```text
Certificate Bucket
│
└── certificates
    │
    ├── EMP001
    │   └── CRS001.pdf
    │
    └── EMP004
        └── CRS001.pdf
```

Certificate files are accessed through temporary generated URLs.

---

# 🔐 Security and IAM

AWS IAM roles and policies control access between AWS services.

Sensitive backend operations are performed by AWS Lambda using IAM permissions.

Example certificate bucket permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": "arn:aws:s3:::YOUR-CERTIFICATE-BUCKET/*"
    }
  ]
}
```

> AWS credentials, access keys, secret keys, temporary tokens, and presigned URLs should not be committed to the repository.

---

# 💻 Frontend Technology

The frontend is built using:

* React.js
* Vite
* JavaScript
* CSS
* Lucide React Icons

Main frontend modules include:

```text
Dashboard
Employees
Courses
Assignments
Quiz
Certificate
```

---

# 📜 Certificate Module

The Certificate page allows users to:

1. Enter an Employee ID.
2. Enter a Course ID.
3. Generate a certificate.
4. View certificate information.
5. Open the generated certificate PDF.
6. Verify an existing certificate using the Certificate ID.

Example:

```text
Employee ID: EMP004
Course ID: CRS001
```

---

# 🔌 API Documentation

The React frontend communicates with AWS services through Amazon API Gateway.

The API base URL should be configured using an environment variable.

Example:

```env
VITE_API_BASE_URL=https://YOUR-API-ID.execute-api.YOUR-REGION.amazonaws.com
```

---

## 👥 Employees

| Method | Endpoint     | Description            |
| ------ | ------------ | ---------------------- |
| GET    | `/employees` | Retrieve all employees |
| POST   | `/employees` | Create a new employee  |

### Example Create Employee Request

```json
{
  "employee_id": "EMP010",
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "department": "Engineering",
  "role": "Cloud Engineer",
  "manager": "Manager",
  "joining_date": "2026-08-23",
  "employment_type": "Full-time",
  "status": "active"
}
```

---

## 📚 Courses

| Method | Endpoint   | Description                |
| ------ | ---------- | -------------------------- |
| GET    | `/courses` | Retrieve available courses |

Example:

```text
GET /courses
```

---

## 🎯 Employee Courses

| Method | Endpoint                             | Description                       |
| ------ | ------------------------------------ | --------------------------------- |
| GET    | `/employee-courses?employee_id={id}` | Get assigned courses and progress |

Example:

```text
GET /employee-courses?employee_id=EMP001
```

Example response data:

```json
{
  "employee_id": "EMP001",
  "course_id": "CRS005",
  "course_title": "AWS Serverless Fundamentals",
  "progress": 100,
  "status": "passed",
  "attempt_count": 2
}
```

---

## 🏆 Certificates

| Method | Endpoint        | Description            |
| ------ | --------------- | ---------------------- |
| POST   | `/certificates` | Generate a certificate |
| GET    | `/certificates` | Retrieve certificates  |

### Example Certificate Generation Request

```json
{
  "employee_id": "EMP004",
  "course_id": "CRS001"
}
```

---

## 🔍 Certificate Verification

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/verify/{certificate_id}` | Verify certificate validity |

Example:

```text
GET /verify/CERT-XXXXXXXXXXXX
```

---

# 📁 Project Structure

```text
NB26-LMS/
│
├── README.md
│
├── images/
│   ├── architecture.png
│   ├── infrastructure.png
│   ├── working-flow.png
│   └── screenshots/
│
├── nb26-lms-frontend/
│   │
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Assignments.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── Certificate.jsx
│   │   │
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── AWS Backend/
    ├── Amazon API Gateway
    ├── AWS Lambda Functions
    ├── Amazon DynamoDB
    ├── Amazon S3
    └── AWS IAM
```

---

# 🖼️ Application Screenshots

Add your application screenshots here.

## Dashboard

![Dashboard](images/screenshots/dashboard.png)

## Employee Management

![Employees](images/screenshots/employees.png)

## Course Management

![Courses](images/screenshots/courses.png)

## Certificate Generation

![Certificate](images/screenshots/certificate.png)

---

# ▶️ Running the Frontend

## 1. Clone the Repository

```bash
git clone <your-repository-url>
```

## 2. Navigate to the Frontend

```bash
cd NB26-LMS/nb26-lms-frontend
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Configure Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=https://YOUR-API-ID.execute-api.YOUR-REGION.amazonaws.com
```

## 5. Start the Application

```bash
npm run dev
```

The application will run on the Vite development server.

---

# 🧪 Current Working Functionality

The following functionality has been tested and is currently working:

* ✅ Employee retrieval
* ✅ Employee creation
* ✅ Course retrieval
* ✅ Employee course retrieval
* ✅ Course progress tracking
* ✅ Quiz attempt tracking
* ✅ Passed and failed course status
* ✅ Certificate generation
* ✅ PDF certificate creation
* ✅ Certificate storage in Amazon S3
* ✅ Secure certificate PDF access
* ✅ Certificate verification
* ✅ React frontend integration with AWS API Gateway

---

# 📊 Example Working Data

## Employee

```text
EMP001
Rahul Sharma
Cloud Engineer
Engineering
```

## Course

```text
CRS001
AWS Cloud Fundamentals
```

## Certificate

```text
Certificate ID: CERT-XXXXXXXXXXXX
Employee: Sneha Patel
Course: AWS Cloud Fundamentals
Status: ISSUED
```

---

# 🔮 Future Improvements

Possible future enhancements include:

* User authentication using Amazon Cognito
* Separate Admin and Employee dashboards
* Role-based access control
* Email notifications using Amazon SES
* Automatic course reminders
* Automatic certificate generation after quiz completion
* Improved analytics dashboard
* Search and filtering
* Course completion reports
* Employee login and personalized learning dashboard
* Certificate renewal and expiry management
* Infrastructure as Code using AWS SAM, Terraform, or CloudFormation

---

# 📈 Project Status

**NB26-LMS is currently functional with the main Learning Management System workflow implemented.**

Current implemented workflow:

```text
Employee Management
        ↓
Course Management
        ↓
Course Assignment
        ↓
Progress Tracking
        ↓
Quiz Attempt
        ↓
Course Completion
        ↓
Certificate Generation
        ↓
Amazon S3 Storage
        ↓
Certificate Verification
```

---

# 👨‍💻 Author

**Narayan Behera**

AWS Cloud & Full Stack Development Project

**NB26-LMS – Serverless Learning Management System**
