import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Fetch all accepted appointments for a specific date
 */
export async function fetchAcceptedAppointmentsByDate(req, res, next) {
    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ error: 'Date is required in query string (e.g., ?date=2025-04-04)' });
    }

    try {
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('status', 'accepted')
            .gte('appointment_date', `${date}T00:00:00Z`)
            .lte('appointment_date', `${date}T23:59:59Z`);

        if (error) throw error;

        res.status(200).json({ appointments: data });
    } catch (err) {
        next(err);
    }
}

/**
 * POST: Get number of accepted appointments for a doctor in a given month/year
 * Body: { doctorId, month, year }
 */
export async function getMonthlyAcceptedAppointmentsByDoctor(req, res, next) {
    const { doctorId, month, year } = req.body;

    if (!doctorId || !month || !year) {
        return res.status(400).json({ error: 'doctorId, month, and year are required in request body.' });
    }

    try {
        // Format: YYYY-MM-DD
        const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
        const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();

        const { count, error } = await supabase
            .from('appointments')
            .select('*', { count: 'exact', head: true })
            .eq('doctor_id', doctorId)
            .eq('status', 'accepted')
            .gte('appointment_date', startDate)
            .lte('appointment_date', endDate);

        if (error) throw error;

        res.status(200).json({
            doctorId,
            month,
            year,
            acceptedAppointments: count,
        });
    } catch (err) {
        next(err);
    }
}


/**
 * POST: Get number of accepted appointments for a doctor in a given month/year,
 * only counting patients who are visiting for the first time.
 * Body: { doctorId, month, year }
 */
export async function getMonthlyAcceptedAppointmentsWithNewPatientsByDoctor(req, res, next) {
    const { doctorId, month, year } = req.body;
  
    if (!doctorId || !month || !year) {
      return res.status(400).json({ error: 'doctorId, month, and year are required in request body.' });
    }
  
    try {
      // First & last day of the month in UTC
      const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59)).toISOString();
  
      // **STEP 1: Get patient IDs where visit_no <= 1**
      const { data: patients, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .lte('visit_no', 1);
  
      if (patientError) throw patientError;
      if (!patients || patients.length === 0) {
        return res.status(200).json({ doctorId, month, year, acceptedAppointmentsWithNewPatients: 0 });
      }
  
      const patientIds = patients.map(p => p.id);
  
      // **STEP 2: Fetch accepted appointments for those patients**
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('status', 'accepted')
        .gte('appointment_date', startDate)
        .lte('appointment_date', endDate)
        .in('patient_id', patientIds); // ✅ Now passing a proper array
  
      if (error) throw error;
  
      res.status(200).json({
        doctorId,
        month,
        year,
        acceptedAppointmentsWithNewPatients: count,
      });
    } catch (err) {
      next(err);
    }
  }

  export async function changeAppointmentStatus(req, res, next) {
    let { appointmentId, status } = req.body;
    console.log(appointmentId);
    if (!appointmentId || !status) {
      return res.status(400).json({ error: "Missing appointmentId or status" });
    }
  
    // Convert to lowercase and validate against allowed enum values
    status = status.toLowerCase();
    const validStatuses = ['accepted', 'declined', 'pending'];
  
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select(); // Optional: include this to return updated record
  
      if (error) {
        return res.status(500).json({ error: error.message });
      }
  
      return res.status(200).json({ message: 'Status updated successfully', data });
    } catch (err) {
      next(err); // Or handle error explicitly
    }
  }


  //Post: get recent patients within 24hrs
  
  export async function fetchRecentPatientsByDoctor(req, res, next) {
    const { username } = req.body;
    console.log(username);
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
  
    try {
      // Get current and previous day's timestamp (24 hours ago)
      const currTime = new Date();
      const prevDayTime = new Date(currTime.getTime() - 24 * 60 * 60 * 1000);
  
      // Get doctorId using username
      console.log(currTime);
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();
  
      if (doctorError || !doctorData) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
  
      const doctorId = doctorData.id;
      console.log(`Doctor ID: ${doctorId}`);
  
      // Fetch accepted appointments in last 24 hours for this doctor
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('doctor_id', doctorId)
        .eq('status', 'accepted')
        .gte('appointment_date', prevDayTime.toISOString())
        .lte('appointment_date', currTime.toISOString());
  
      if (appointmentError) throw appointmentError;
      console.log(appointments);
  
      const patientIds = appointments.map(app => app.patient_id);
  
      if (patientIds.length === 0) {
        return res.status(200).json({ patients: [] });
      }
  
      // Fetch patient details using the list of patientIds
      const { data: patients, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .in('id', patientIds);
  
      if (patientError) throw patientError;
  
      res.status(200).json({ patients });
    } catch (err) {
      console.error('Error fetching recent patients:', err);
      next(err);
    }
  }
  