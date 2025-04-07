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
    if (!appointmentId || !status) {
      return res.status(400).json({ error: "Missing appointmentId or status" });
    }
  
    // Normalize and validate status
    status = status.toLowerCase();
    const validStatuses = ['accepted', 'declined', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    try {
      // Update the appointment's status
      const { data: updatedAppointment, error: updateError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId)
        .select();
  
      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
  
      // If status is not 'accepted', skip patient count update
      if (status !== 'accepted') {
        return res.status(200).json({ message: 'Status updated successfully', data: updatedAppointment });
      }
  
      // Fetch the doctor_id for this appointment
      const { data: appointmentData, error: fetchAppointmentError } = await supabase
        .from('appointments')
        .select('doctor_id')
        .eq('id', appointmentId)
        .single();
  
      if (fetchAppointmentError) {
        return res.status(500).json({ error: fetchAppointmentError.message });
      }
  
      const doctorId = appointmentData.doctor_id;
  
      // Retrieve the doctor's department
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('department')
        .eq('id', doctorId)
        .single();
  
      if (doctorError) {
        return res.status(500).json({ error: doctorError.message });
      }
  
      const doctorDepartment = doctorData.department;
  
      // Get current patient_count for the department
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('patient_count')
        .eq('name', doctorDepartment)
        .single();
  
      if (deptError) {
        return res.status(500).json({ error: deptError.message });
      }
  
      const newPatientCount = (deptData.patient_count || 0) + 1;
  
      // Update the department's patient_count
      const { error: updateDeptError } = await supabase
        .from('departments')
        .update({ patient_count: newPatientCount })
        .eq('name', doctorDepartment);
  
      if (updateDeptError) {
        return res.status(500).json({ error: updateDeptError.message });
      }
  
      return res.status(200).json({
        message: 'Status updated and department patient count incremented.',
        data: updatedAppointment
      });
  
    } catch (err) {
      console.error("Error in changeAppointmentStatus:", err);
      next(err);
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

  export async function getSlotDistributionByDate(req, res, next) {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required in request body (format: YYYY-MM-DD)' });
    }
  
    // Define the total allowed appointments per slot.
    const totalPerSlot = 10;
  
    // Define time ranges for each slot (using UTC time)
    const slot1Start = new Date(`${date}T09:00:00Z`).toISOString();
    const slot1End = new Date(`${date}T12:00:00Z`).toISOString();
  
    const slot2Start = new Date(`${date}T14:00:00Z`).toISOString();
    const slot2End = new Date(`${date}T17:00:00Z`).toISOString();
  
    const slot3Start = new Date(`${date}T18:00:00Z`).toISOString();
    const slot3End = new Date(`${date}T21:00:00Z`).toISOString();
  
    try {
      // Fetch count of accepted appointments for slot 1.
      const { count: count1, error: error1 } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .gte('appointment_date', slot1Start)
        .lt('appointment_date', slot1End);
  
      if (error1) throw error1;
  
      // Fetch count for slot 2.
      const { count: count2, error: error2 } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .gte('appointment_date', slot2Start)
        .lt('appointment_date', slot2End);
      if (error2) throw error2;
  
      // Fetch count for slot 3.
      const { count: count3, error: error3 } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .gte('appointment_date', slot3Start)
        .lt('appointment_date', slot3End);
      if (error3) throw error3;
  
      // Calculate accepted, available and total for each slot.
      const distribution = {
        slot1: {
          total: totalPerSlot,
          accepted: count1 || 0,
          available: Math.max(0, totalPerSlot - (count1 || 0))
        },
        slot2: {
          total: totalPerSlot,
          accepted: count2 || 0,
          available: Math.max(0, totalPerSlot - (count2 || 0))
        },
        slot3: {
          total: totalPerSlot,
          accepted: count3 || 0,
          available: Math.max(0, totalPerSlot - (count3 || 0))
        }
      };
  
      res.status(200).json(distribution);
    } catch (err) {
      next(err);
    }
  }
  