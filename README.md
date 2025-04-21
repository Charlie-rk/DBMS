# 🏥 Hospital Management System

![Version](https://img.shields.io/badge/version-1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

🌐 **Website:** [https://dbms-upbd.onrender.com/sign-in](https://dbms-upbd.onrender.com/sign-in)

## 📋 Overview

This comprehensive Hospital Management System (HMS) streamlines hospital operations, enhances patient care, and provides robust analytics for administrators, doctors, front desk operators, and data entry operators. The system features role-based access, multi-factor authentication, and modern dashboards tailored to each user group.

## ✨ Key Features

### 🔐 Authentication & Security

- **Multi-field login** with username, email, password, and OTP verification
- **Role-based access control** ensuring users access only permitted features
- **Secure password management** and detailed audit trails for sensitive actions

### 👥 User Roles & Dashboards

| Role | Key Functions |
|------|--------------|
| **👑 Admin** | User/department management, analytics, messaging, resource tracking, security, billing |
| **👨‍⚕️ Doctor** | View/manage appointments, patient histories, prescribe treatments, performance analytics |
| **🖥️ Front Desk** | Patient registration, appointment scheduling, admissions/discharges, notifications, billing |
| **📝 Data Entry** | Enter test/treatment data, upload/view reports, audit records, message staff |

## 🧩 Core Modules

### 🧑‍🤝‍🧑 Patient Management

- Register new or returning patients with full demographics and contact information
- Unique patient ID assignment with automatic age calculation
- Complete patient journey tracking across appointments, admissions, treatments, and reports

### 📅 Appointment & Admission

- **Intelligent scheduling** with real-time doctor and room availability checks
- Emergency case flagging with priority queue management
- Room assignment by category (Executive, Premium, Basic) with occupancy tracking

### 👨‍⚕️ Doctor Operations

- **Analytics dashboard** showing patient trends, appointment statistics, and efficiency metrics
- Appointment management with accept/decline functionality
- Comprehensive patient history access and prescription management

### 📊 Data Entry & Reporting

- Streamlined diagnostic test result entry and treatment documentation
- Report management system with PDF upload capability
- Detailed audit logging for all data modifications

### 📈 Analytics & Reporting

- **Real-time statistics** for beds, doctors, patients, and admissions/discharges
- Interactive charts for urgency distribution, patient flow, and departmental performance
- Recent activity tracking with detailed drill-down capabilities

### 💬 Messaging & Notifications

- Secure internal communication between staff members
- Automated notifications for appointments, test results, and emergencies
- Comprehensive communication logs for audit purposes

## 🗄️ Database Schema

```
Users ─────┐
           │
Patients ──┼── Appointments ── Treatments
           │       │
Doctors ───┘       │
           │       │
Departments┼── Admissions ──── Rooms
           │       │
Reports ───┼── Diagnostic Tests
           │
Audit Logs ┘
```

## 🔌 API Endpoints

### Authentication
- `/signin` - User authentication with OTP

### Admin
- `/admin/register` - Register new users
- `/admin/rooms` - Room availability
- `/admin/doctors` - Doctor availability
- `/admin/patients` - Patient analytics

### Front Desk
- `/fdo/register-patient` - Register new patient
- `/fdo/schedule-appointment` - Book appointment
- `/fdo/admit` - Admit patient
- `/fdo/discharge` - Discharge patient

### Doctor
- `/doctor/details` - Doctor profile and stats
- `/doctor/appointments/daily` - Today's appointments

### Data Entry
- `/edo/test-entry` - Enter diagnostic data
- `/edo/treatment-entry` - Log treatments
- `/edo/upload-report` - Upload reports
- `/edo/reports` - View all reports

## 💻 UI Highlights

- **Modern, responsive dashboards** customized for each role
- **User-friendly forms** with step-by-step validation
- **Real-time resource monitoring** with visual indicators
- **Interactive charts** for data visualization
- **Secure navigation** with profile management

## 🚀 Getting Started

1. Clone the repository: `git clone https://github.com/yourusername/hospital-management-system.git`
2. Install dependencies: `npm install`
3. Configure database using provided schema
4. Set up environment variables for authentication and storage
5. Start the application: `npm start`
6. Access admin dashboard to create initial users

## 🤝 Contribution & Support

Contributions are welcome! Please submit issues or pull requests through our GitHub repository.

For support, refer to the in-app Help section or contact the admin team at support@hms.example.com.

---

> ### *Your health, our promise.*
> *A modern, secure, and efficient solution for hospital management.*
