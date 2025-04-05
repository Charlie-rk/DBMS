import express from 'express';
import {
  registerPatient,
  scheduleAppointment,
  admitPatient,
  dischargePatient,
  getRoomsSummary,
  seedRooms,
  seedDepartments
} from '../controllers/fdoController.js';

const router = express.Router();

// Input: { name, mobile, dob, address }
router.post('/register-patient', registerPatient);

// Input: { patientId, doctorId, appointmentDate, appointmentTime, condition }
router.post('/schedule-appointment', scheduleAppointment);

// Input: { patientId, roomId, admissionDate, notes }
router.post('/admit', admitPatient);

// Input: { patientId, dischargeDate, remarks }
router.post('/discharge', dischargePatient);


router.get('/rooms-summary', getRoomsSummary);

// New route: Seed rooms data
router.post('/seed-departments', seedDepartments);
router.post('/seed-rooms', seedRooms);

export default router;
