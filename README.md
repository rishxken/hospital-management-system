# Hospital Management System (HMS)

A modern, full-stack Hospital Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). This platform streamlines hospital operations by providing dedicated interfaces and Role-Based Access Control (RBAC) for Patients, Doctors, Hospital Staff, and Administrators.

Featuring a sleek, fully responsive **Dark Mode** UI built from scratch using raw CSS.

## 🌟 Features

### Role-Based Access Control (RBAC)
The system is divided into 4 secure portals:

* **🧑‍⚕️ Patient Portal**
  * Book, view, and cancel appointments
  * Manage personal medical profile (allergies, past conditions, blood group)
  * View and download diagnostic reports (PDFs/Images)
  * Receive notifications on appointment status changes

* **👨‍⚕️ Doctor Portal**
  * View daily schedule and appointment requests
  * Confirm or request to reschedule pending appointments
  * Upload diagnostic reports directly to a patient's record
  * Access comprehensive patient medical histories

* **📋 Staff Portal**
  * Hospital-wide view of all appointments and patients
  * Add and remove doctors from the system
  * Manage system-wide scheduling operations

* **🛡️ Admin Portal**
  * View system-wide metrics and analytics dashboards
  * Manage all users (activate, deactivate, delete, assign roles)
  * Complete oversight of hospital data

### Technical Features
* **Authentication:** Secure JWT (JSON Web Tokens) with HttpOnly cookies/localStorage and bcrypt password hashing.
* **File Uploads:** Cloudinary integration for secure diagnostic report storage.
* **Design System:** Custom CSS design system (No Tailwind or UI libraries) with a responsive dark mode aesthetic and modern typography (Inter & Outfit).
* **API:** RESTful architecture with robust error handling and Mongoose schema validation.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* React Router v6
* Axios
* Plain CSS3 (Flexbox/Grid)

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose
* JSON Web Token (JWT)
* Multer & Cloudinary (File Handling)

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB (Atlas or Local)
* Cloudinary Account (for report uploads)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/hospital-mgmt.git
cd hospital-mgmt
```

### 2. Install Dependencies
This project uses `concurrently` to run both frontend and backend from the root directory.
```bash
# Install root dependencies
npm install

# Install backend & frontend dependencies
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Seed the Database (Optional but recommended)
Populate the database with sample users (Admins, Doctors, Staff, Patients) and mock data:
```bash
cd backend
node seed.js
```

### 5. Run the Application
Run both the frontend and backend development servers concurrently:
```bash
# From the root directory
npm run dev
```
* Frontend runs on `http://localhost:5173`
* Backend runs on `http://localhost:5000`

## 🔐 Default Seed Credentials
If you ran the seed script, you can log in with the following test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@hospital.com | admin123 |
| **Staff** | sarah.staff@hospital.com | staff123 |
| **Doctor** | anil.sharma@hospital.com | doctor123 |
| **Patient** | rahul.verma@gmail.com | patient123 |

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
