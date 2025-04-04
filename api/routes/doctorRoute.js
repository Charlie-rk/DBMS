import express from 'express';
import { fetchAcceptedAppointmentsByDate } from '../controllers/doctorController.js';

const router = express.Router();

// GET /api/appointments/accepted-by-date?date=YYYY-MM-DD
router.get('/accepted-by-date', fetchAcceptedAppointmentsByDate);

export default router;
