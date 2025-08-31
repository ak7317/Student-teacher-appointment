# Student-teacher-appointment


A web-based system built with **Firebase (Auth + Firestore)** and **HTML/CSS/JS** that allows students to book appointments with teachers.  
Admin manages teacher approvals, teachers handle appointment requests, and students can view and book appointments.

---

## 🚀 Features

### 👨‍🎓 Student
- Login/Register using Firebase Authentication
- View their appointments with teachers
- Book new appointment (select teacher, date, time)
- Check appointment status (Pending / Approved / Rejected)

### 👩‍🏫 Teacher
- Login with teacher account
- View all appointment requests assigned to them
- Approve or reject appointment requests
- Manage their schedule in real time

### 🛠️ Admin
- Manage all users (students, teachers, admins)
- Approve newly registered teachers
- Monitor appointments in the system

---

## 🗂️ Project Structure
student-teacher-appointment/
│── index.html # Login page
│── dashboard.html # Student dashboard
│── teacher.html # Teacher dashboard
│── admin.html # Admin dashboard
│
├── css/
│ └── style.css # Main styles
│
├── js/
│ ├── firebase.js # Firebase config & init
│ ├── auth.js # Authentication handling
│ ├── student.js # Student dashboard logic
│ ├── teacher.js # Teacher dashboard logic
│ ├── admin.js # Admin dashboard logic
│
└── README.md # Project documentation

---

## 🔧 Setup Instructions

### 1️⃣ Clone the project
```bash
git clone https://github.com/your-username/student-teacher-appointment.git
cd student-teacher-appointment
2️⃣ Setup Firebase

Go to Firebase Console

Create a new project

Enable Authentication (Email/Password)

Enable Cloud Firestore

Copy your Firebase config from Project Settings > SDK Setup

Update js/firebase.js:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

3️⃣ Start Local Server

You can use Python or VS Code Live Server.
python -m http.server 8000
Then visit 👉 http://127.0.0.1:8000/index.html

Firestore Collections
📌 users Collection

Each document = one user.
{
  "name": "Mr. Sachin Sir",
  "email": "sachinsir123@gmail.com",
  "role": "teacher",       // student | teacher | admin
  "department": "AI",
  "subject": "ML",
  "approved": true,        // only for teachers
  "createdAt": "timestamp"
}
📌 appointments Collection

Each document = one appointment.
{
  "studentId": "uid123",
  "studentName": "Aman",
  "teacherId": "uid456",
  "teacherName": "Dr. Varun Sir",
  "date": "2025-09-01",
  "time": "10:00",
  "status": "pending",    // pending | approved | rejected
  "createdAt": "timestamp"
}
✅ Roles in the System

Student → can book appointments & view status

Teacher → can approve/reject appointment requests

Admin → can approve teachers & manage all users




