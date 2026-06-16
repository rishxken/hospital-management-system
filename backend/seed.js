const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PatientProfile = require('./models/PatientProfile');
const Appointment = require('./models/Appointment');
const Notification = require('./models/Notification');
const DiagnosticReport = require('./models/DiagnosticReport');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await PatientProfile.deleteMany({});
    await Appointment.deleteMany({});
    await Notification.deleteMany({});
    await DiagnosticReport.deleteMany({});
    console.log('Cleared existing data.');

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created: admin@hospital.com / admin123');

    // Create Staff
    const staff = await User.create({
      name: 'Sarah Staff',
      email: 'sarah.staff@hospital.com',
      password: 'staff123',
      role: 'staff',
    });
    console.log('Staff created: sarah.staff@hospital.com / staff123');

    // Create Doctors
    const doctor1 = await User.create({
      name: 'Dr. Anil Sharma',
      email: 'anil.sharma@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      specialization: 'Cardiology',
    });

    const doctor2 = await User.create({
      name: 'Dr. Priya Mehta',
      email: 'priya.mehta@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      specialization: 'Neurology',
    });
    console.log('Doctors created: anil.sharma@hospital.com, priya.mehta@hospital.com / doctor123');

    // Create Patients
    const patient1 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul.verma@gmail.com',
      password: 'patient123',
      role: 'patient',
    });

    const patient2 = await User.create({
      name: 'Sneha Patel',
      email: 'sneha.patel@gmail.com',
      password: 'patient123',
      role: 'patient',
    });

    const patient3 = await User.create({
      name: 'Amit Kumar',
      email: 'amit.kumar@gmail.com',
      password: 'patient123',
      role: 'patient',
    });
    console.log('Patients created: rahul.verma, sneha.patel, amit.kumar @gmail.com / patient123');

    // Create Patient Profiles
    await PatientProfile.create({
      userId: patient1._id,
      age: 32,
      gender: 'male',
      bloodGroup: 'B+',
      phone: '9876543210',
      address: '123 MG Road, Mumbai',
      pastConditions: ['Hypertension'],
      allergies: ['Penicillin'],
    });

    await PatientProfile.create({
      userId: patient2._id,
      age: 28,
      gender: 'female',
      bloodGroup: 'O+',
      phone: '9876543211',
      address: '456 Park Street, Delhi',
      pastConditions: ['Diabetes'],
      allergies: [],
    });

    await PatientProfile.create({
      userId: patient3._id,
      age: 45,
      gender: 'male',
      bloodGroup: 'A-',
      phone: '9876543212',
      address: '789 Lake View, Bangalore',
      pastConditions: ['Asthma', 'High Cholesterol'],
      allergies: ['Sulfa drugs'],
    });
    console.log('Patient profiles created.');

    // Create Sample Appointments
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    await Appointment.create([
      {
        patientId: patient1._id,
        doctorId: doctor1._id,
        date: tomorrow,
        timeSlot: '10:00 AM',
        status: 'confirmed',
        notes: 'Regular checkup for blood pressure',
      },
      {
        patientId: patient2._id,
        doctorId: doctor2._id,
        date: tomorrow,
        timeSlot: '2:00 PM',
        status: 'pending',
        notes: 'Recurring headaches',
      },
      {
        patientId: patient3._id,
        doctorId: doctor1._id,
        date: nextWeek,
        timeSlot: '11:00 AM',
        status: 'pending',
        notes: 'Chest pain follow-up',
      },
      {
        patientId: patient1._id,
        doctorId: doctor2._id,
        date: nextWeek,
        timeSlot: '3:00 PM',
        status: 'pending',
        notes: 'Neurological assessment',
      },
    ]);
    console.log('Sample appointments created.');

    // Create sample notifications
    await Notification.create([
      {
        userId: doctor1._id,
        message: `New appointment request from Rahul Verma on ${tomorrow.toLocaleDateString()}`,
        type: 'appointment',
      },
      {
        userId: patient1._id,
        message: 'Your appointment with Dr. Anil Sharma has been confirmed',
        type: 'appointment',
        isRead: true,
      },
      {
        userId: doctor2._id,
        message: `New appointment request from Sneha Patel on ${tomorrow.toLocaleDateString()}`,
        type: 'appointment',
      },
    ]);
    console.log('Sample notifications created.');

    console.log('\n--- Seed Complete ---');
    console.log('Login Credentials:');
    console.log('  Admin:   admin@hospital.com / admin123');
    console.log('  Staff:   sarah.staff@hospital.com / staff123');
    console.log('  Doctor:  anil.sharma@hospital.com / doctor123');
    console.log('  Doctor:  priya.mehta@hospital.com / doctor123');
    console.log('  Patient: rahul.verma@gmail.com / patient123');
    console.log('  Patient: sneha.patel@gmail.com / patient123');
    console.log('  Patient: amit.kumar@gmail.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedDB();
