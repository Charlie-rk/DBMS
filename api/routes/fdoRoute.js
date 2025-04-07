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
  upsertDepartmentAndRooms,
  getAllRegisteredPatients,
  scheduleAppointment_modified
} from '../controllers/fdoController.js';

const router = express.Router();

router.post('/register-patient', registerPatient);
router.post('/schedule-appointment', scheduleAppointment);
router.post('/admit', admitPatient);
router.post('/discharge', dischargePatient);
router.get('/rooms-summary', getRoomsSummary);

router.post('/add-doctor', addDoctor);
router.delete('/delete-doctor/:doctorId', deleteDoctor);
router.delete('/delete-patient/:patientId', deletePatient);
router.delete('/delete-department/:departmentId', deleteDepartment);
router.post('/upsert-department', upsertDepartmentAndRooms);
router.post('/seed-departments', seedDepartments);
router.post('/seed-rooms', seedRooms);
router.get('/all-patients', getAllRegisteredPatients);

export default router;
