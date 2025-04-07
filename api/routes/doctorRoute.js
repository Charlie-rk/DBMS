import express from 'express';
import { changeAppointmentStatus, fetchAcceptedAppointmentsByDate, getMonthlyAcceptedAppointmentsByDoctor, getMonthlyAcceptedAppointmentsWithNewPatientsByDoctor, fetchRecentPatientsByDoctor, getAllAppointmentsByDoctor } from '../controllers/doctorController.js';

const router = express.Router();

// GET /api/appointments/accepted-by-date?date=YYYY-MM-DD
router.post('/get-all-appointments', getAllAppointmentsByDoctor);
router.get('/accepted-by-date', fetchAcceptedAppointmentsByDate);
router.post('/count-monthly-appointments', getMonthlyAcceptedAppointmentsByDoctor);
router.post('/count-monthly-appointments/new', getMonthlyAcceptedAppointmentsWithNewPatientsByDoctor);


//route to change appointment status
// {
//     "appointmentId": 1,
//     "status": "Pending"
// }
  
router.post('/change-appointment-status', changeAppointmentStatus);
router.post('/recent-patients', fetchRecentPatientsByDoctor);
export default router;
