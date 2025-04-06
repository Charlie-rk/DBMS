import express from 'express';
import {
  registerPatient,
  scheduleAppointment,
  admitPatient,
  dischargePatient,
  getRoomsSummary,
  seedRooms,
  seedDepartments,
  addDoctor,
  deleteDoctor,
  deletePatient,
  deleteDepartment,
  upsertDepartmentAndRooms
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

//to get number of room of particular type per derpartment.
router.get('/rooms-summary', getRoomsSummary);

// Doctor-related routes
router.post('/add-doctor', addDoctor);
router.delete('/delete-doctor/:doctorId', deleteDoctor);

// Patient deletion route
router.delete('/delete-patient/:patientId', deletePatient);

// Department deletion route
router.delete('/delete-department/:departmentId', deleteDepartment);

// New route: Upsert department and update rooms.
router.post('/upsert-department', upsertDepartmentAndRooms);

// New route: Seed rooms data
router.post('/seed-departments', seedDepartments);
router.post('/seed-rooms', seedRooms);

export default router;
