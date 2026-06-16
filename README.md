# Hospital Management System

A web-based Hospital Management System built using the MERN stack (MongoDB, Express, React, Node.js). This project is designed to handle everyday hospital operations by providing dedicated dashboards for patients, doctors, staff, and admins. The interface includes a custom Dark Mode built entirely with plain CSS, without relying on external UI libraries like Tailwind.

## Key Features

* **Patient Portal:** Patients can book or cancel appointments, update basic medical details (like blood group and allergies), and download their test reports.
* **Doctor Portal:** Doctors can check their daily schedules, accept or reschedule appointments, and directly upload test reports to a patient's profile.
* **Staff Portal:** Hospital staff can oversee all appointments across the hospital and manage the list of available doctors.
* **Admin Portal:** Admins have full system access to view overall statistics, activate or remove users, and manage the entire platform.

## Tech Stack

* **Frontend:** React.js, React Router, and standard CSS.
* **Backend:** Node.js, Express.js, and MongoDB (with Mongoose).
* **Authentication & Storage:** JWT for secure user logins and Cloudinary for storing PDF/image report files.
