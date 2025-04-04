import express from 'express';
import { fetchAcceptedAppointmentsByDate, getMonthlyAcceptedAppointmentsByDoctor, getMonthlyAcceptedAppointmentsWithNewPatientsByDoctor } from '../controllers/doctorController.js';

const router = express.Router();

// GET /api/appointments/accepted-by-date?date=YYYY-MM-DD
router.get('/accepted-by-date', fetchAcceptedAppointmentsByDate);
router.post('/count-monthly-appointments', getMonthlyAcceptedAppointmentsByDoctor);
router.post('/count-monthly-appointments/new', getMonthlyAcceptedAppointmentsWithNewPatientsByDoctor);
export default router;
