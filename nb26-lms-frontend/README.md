# NB26-LMS – Serverless Learning Management System

A cloud-based Learning Management System built using **React.js and AWS Serverless services**.

NB26-LMS allows administrators and HR teams to manage employees, create courses and quizzes, assign learning content, track employee progress, generate course completion certificates, and verify certificates.

---

# 📌 Project Overview

NB26-LMS is designed using a serverless architecture where the React frontend communicates with AWS backend services through **Amazon API Gateway HTTP API** and **AWS Lambda**.

The system supports the following learning workflow:

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

Example:

```text
Employee: TEST_E2E_002
Course: CRS002
Progress: 100%
Status: passed
Attempt Count: 1
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

After a successful quiz attempt, the employee's course progress is updated to completed/passed.

Example:

```text
Total Questions: 2
Correct Answers: 2
Score: 100
Status: passed
Attempt Count: 1
```

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

### Duplicate Certificate Protection

The certificate generation process checks whether a certificate already exists for the same employee and course.

If a certificate already exists, the system returns the existing certificate information instead of creating a duplicate certificate.

Example response:

```text
Certificate already exists

Certificate ID:
CERT-8D68F9DB9183

Employee:
TEST_E2E_002

Course:
CRS002

Status:
ISSUED
```

---

## 🔍 6. Certificate Verification

Certificates can be verified using a unique Certificate ID.

Example:

```text
GET /verify/{certificate_id}
```

The verification system returns:

* Certificate validity
* Certificate ID
* Employee name
* Employee ID
* Course name
* Course ID
* Completion date
* Certificate status

Example successful verification:

```json
{
  "valid": true,
  "message": "Certificate is valid",
  "certificate_id": "CERT-XXXXXXXXXXXX",
  "employee_id": "EMP004",
  "employee_name": "Employee Name",
  "course_id": "CRS001",
  "course_name": "AWS Cloud Fundamentals",
  "completion_date": "29 August 2026",
  "status": "ISSUED"
}
```

---

## 📄 7. Secure Certificate PDF Access

Generated certificate PDFs are stored privately in Amazon S3.

The application does not require the S3 bucket to be publicly accessible.

Instead, the backend generates **temporary S3 presigned URLs** for certificate PDF access.

```text
Private S3 Bucket
       ↓
Lambda
       ↓
Generate Presigned URL
       ↓
Frontend
       ↓
Open Certificate PDF
```

Presigned URLs are temporary and should not be committed to the Git repository.

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
                    ┌──────────────────────┐
                    │ Amazon API Gateway   │
                    │     HTTP API         │
                    └──────────┬───────────┘
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
| Amazon API Gateway | Exposes HTTP APIs to the frontend     |
| AWS Lambda         | Serverless backend business logic     |
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
           │
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

Certificate files are accessed through temporary presigned URLs.

The S3 bucket should remain private.

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

> AWS credentials, access keys, secret keys, temporary tokens, and presigned URLs should never be committed to the repository.

---

# 📧 Amazon SES

Amazon SES can be used for certificate and learning-related email notifications where configured.

If the AWS account is operating in SES sandbox mode, recipient email addresses must be verified before emails can be sent.

For an error such as:

```text
Email address is not verified
MessageRejected
```

verify the recipient identity in Amazon SES in the configured AWS region.

The certificate should ideally remain issued even if an optional email notification fails.

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

The React frontend communicates with the AWS backend through Amazon API Gateway.

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
| POST   | `/courses` | Create a course            |

Example:

```text
GET /courses
```

---

## 🎯 Employee Courses

| Method | Endpoint                             | Description                       |
| ------ | ------------------------------------ | --------------------------------- |
| GET    | `/employee-courses?employee_id={id}` | Get assigned courses and progress |
| POST   | `/assign-course`                     | Assign a course to an employee    |

Example:

```text
GET /employee-courses?employee_id=EMP001
```

Example response:

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

## 📝 Quizzes

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/quizzes`     | Retrieve quiz questions    |
| POST   | `/quizzes`     | Create quiz questions      |
| POST   | `/quiz/submit` | Submit and evaluate a quiz |

The quiz submission process automatically evaluates answers and updates the employee's course progress and status.

---

## 📊 Skill Gap

| Method | Endpoint     | Description                                     |
| ------ | ------------ | ----------------------------------------------- |
| GET    | `/skill-gap` | Retrieve skill-gap and department learning data |

This data can be used by the dashboard to display department-level training progress.

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

The certificate generation process:

```text
Employee + Course
       ↓
Check Completion
       ↓
Check Existing Certificate
       ↓
Generate PDF
       ↓
Upload PDF to S3
       ↓
Create Certificate Record
       ↓
Return Certificate Information
```

If a certificate already exists, the existing certificate record is returned.

---

## 🔍 Certificate Verification

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| GET    | `/verify/{certificate_id}` | Verify certificate validity |

Example:

```text
GET /verify/CERT-XXXXXXXXXXXX
```

Example successful response:

```json
{
  "valid": true,
  "message": "Certificate is valid",
  "certificate_id": "CERT-XXXXXXXXXXXX",
  "employee_id": "EMP004",
  "employee_name": "Employee Name",
  "course_id": "CRS001",
  "course_name": "AWS Cloud Fundamentals",
  "completion_date": "29 August 2026",
  "status": "ISSUED"
}
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
│       ├── dashboard.png
│       ├── employees.png
│       ├── courses.png
│       └── certificate.png
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
    ├── Amazon SES
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

> Do not commit `.env` files containing sensitive configuration.

## 5. Start the Application

```bash
npm run dev
```

The application will run on the Vite development server.

---

# 🧪 Current Working Functionality

The following functionality has been tested with the deployed AWS backend:

* ✅ Employee retrieval
* ✅ Employee creation
* ✅ Course retrieval
* ✅ Course creation
* ✅ Employee course assignment
* ✅ Employee course retrieval
* ✅ Course progress tracking
* ✅ Quiz question creation
* ✅ Quiz submission
* ✅ Quiz attempt tracking
* ✅ Passed and failed course status
* ✅ Certificate generation
* ✅ Duplicate certificate prevention
* ✅ PDF certificate creation
* ✅ Certificate storage in Amazon S3
* ✅ Temporary secure certificate PDF access
* ✅ Certificate retrieval
* ✅ Certificate verification
* ✅ React frontend integration with Amazon API Gateway

---

# 🧪 End-to-End Certificate Test

The certificate workflow has been tested using a dedicated end-to-end employee and course.

Example test data:

```text
Employee ID:
TEST_E2E_002

Course ID:
CRS002

Course:
AWS Security Fundamentals
```

Assignment result:

```text
Progress: 100
Status: passed
Attempt Count: 1
```

Completion result:

```text
Correct Answers: 2
Total Questions: 2
Score: 100
Status: passed
```

Certificate result:

```text
Certificate ID:
CERT-XXXXXXXXXXXX

Employee:
EndToEnd Tester 002

Course:
AWS Security Fundamentals

Status:
ISSUED
```

Certificate verification:

```text
valid: true
message: Certificate is valid
status: ISSUED
```

The generated PDF was stored in Amazon S3 using the following structure:

```text
certificates/
└── TEST_E2E_002/
    └── CRS002.pdf
```

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

# 🧭 Current Browser Testing Flow

The frontend supports the following learning workflow:

```text
Create Employee
        ↓
Create Course
        ↓
Assign Course
        ↓
Create Quiz Question
        ↓
Select Employee and Course
        ↓
Take Quiz
        ↓
Pass Quiz
        ↓
Generate Certificate
        ↓
Open PDF
        ↓
Verify Certificate
```

---

# 🌐 Frontend Routes

| Route               | Purpose                                        |
| ------------------- | ---------------------------------------------- |
| `/`                 | Dashboard and learning summary                 |
| `/employees`        | View, search, and create employees             |
| `/courses`          | View and create courses                        |
| `/assign-course`    | Assign a course to an employee                 |
| `/employee-courses` | Select an employee and view assigned courses   |
| `/quiz`             | Create quiz questions                          |
| `/take-quiz`        | Take a quiz for a selected employee and course |
| `/certificates`     | Generate and verify certificates               |

> Keep this route list synchronized with the routes implemented in the current React frontend.

---

# 🧪 Browser Test Procedure

1. Start the frontend:

```bash
npm install
npm run dev
```

2. Open the Vite development URL shown in the terminal.

3. Open **Employees** and create a unique employee.

4. Open **Courses** and create a unique course.

5. Open **Assign Course** and assign the course to the employee.

6. Open **Create Quiz Question**.

7. Use the exact course ID when creating the quiz question.

8. Open **My Courses** and select the new employee.

9. Click **Take Quiz** for the assigned course.

10. Answer all questions and submit the quiz.

11. Confirm that the course status becomes `passed` and progress becomes `100`.

12. Open **Certificates**.

13. Generate the certificate.

14. Open the generated PDF.

15. Copy the certificate ID.

16. Verify the certificate using the Certificate ID.

Use unique IDs for every test because the deployed API uses shared persistent data.

Example:

```text
Employee ID:
BROWSER-EMP-20260829-01

Course ID:
BROWSER-COURSE-20260829-01

Question ID:
BROWSER-Q-20260829-01
```

---

# 📧 Certificate and Amazon SES

Certificate generation uses the deployed AWS backend.

If the backend sends an optional notification email, the recipient email address must be verified in Amazon SES when the AWS account is operating in sandbox mode.

For this error:

```text
Email address is not verified
MessageRejected
```

verify the recipient identity in Amazon SES in the configured AWS region, or use an already verified email address.

The certificate generation workflow should ideally keep the certificate issued when only the optional email notification fails.

---

# 🔍 Validation Commands

Run these commands before sharing or deploying the frontend:

```bash
npm run lint
```

and:

```bash
npm run build
```

Both commands should complete without errors.

---

# 🔐 Repository Security

Before pushing the project to GitHub, make sure the repository does not contain:

```text
.env
AWS Access Keys
AWS Secret Keys
Temporary AWS Session Tokens
S3 Presigned URLs
Private credentials
Passwords
API secrets
```

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
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
* Automated CI/CD deployment

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
PDF Generation
        ↓
Amazon S3 Storage
        ↓
Certificate Retrieval
        ↓
Certificate Verification
```

---

# 👨‍💻 Author

**Narayan Behera**

AWS Cloud & Full Stack Development Project

**NB26-LMS – Serverless Learning Management System**

---

# ⭐ Project Highlights

```text
React.js + Vite
        +
Amazon API Gateway
        +
AWS Lambda
        +
Amazon DynamoDB
        +
Amazon S3
        +
AWS IAM
        +
Amazon SES
        +
Python + ReportLab
```

A complete serverless learning management workflow from **employee onboarding to course completion and certificate verification**.
