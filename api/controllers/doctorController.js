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
  console.log(req.body)

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
  const { doctorId } = req.body;
  // console.log(doctorId);

  if (!doctorId) {
    return res.status(400).json({ error: 'doctorId is required' });
  }

  try {
    // Get current time and timestamp for one week ago
    const currTime = new Date();
    // console.log(currTime)
    const prevWeekTime = new Date(currTime.getTime() - 7 * 24 * 60 * 60 * 1000);

    // console.log(`Doctor ID: ${doctorId}`);

    // Fetch accepted appointments in the last week for this doctor
    // Fetch all appointment fields (including patient_id)
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('status', 'accepted')
      .gte('appointment_date', prevWeekTime.toISOString())
      .lte('appointment_date', currTime.toISOString());

    if (appointmentError) throw appointmentError;
    // console.log(appointments);

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ appointments: [] });
    }

    // Extract unique patient IDs from the appointments
    const patientIds = appointments.map(app => app.patient_id);
    const uniquePatientIds = [...new Set(patientIds)];

    // Fetch patient details using the list of unique patientIds
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .in('id', uniquePatientIds);

    if (patientError) throw patientError;

    // Create a lookup map from patient ID to patient details
    const patientMap = {};
    patients.forEach(patient => {
      patientMap[patient.id] = patient;
    });

    // Combine appointment details with corresponding patient info
    const appointmentsWithPatientInfo = appointments.map(app => ({
      ...app,
      patientInfo: patientMap[app.patient_id] || null
    }));

    res.status(200).json({ appointments: appointmentsWithPatientInfo });
  } catch (err) {
    console.error('Error fetching recent appointments:', err);
    next(err);
  }
}

export async function getAllAppointmentsByDoctor(req, res, next) {
  const { doctorId } = req.body;
  // console.log(doctorId);
  try {
    // Fetch appointments for the doctor
    const { data: appointments, error: appointmentError, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' })
      .eq('doctor_id', doctorId);

    if (appointmentError) {
      return res.status(500).json({ error: appointmentError.message });
    }

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ appointments: [], count: 0 });
    }

    // Extract unique patient IDs from the appointments
    const patientIds = [...new Set(appointments.map(app => app.patient_id))];

    // Fetch patient details (id and name) from the patients table
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('id, name')
      .in('id', patientIds);

    if (patientError) {
      return res.status(500).json({ error: patientError.message });
    }

    // Create a lookup map for patient ID -> patient name
    const patientMap = {};
    patients.forEach(patient => {
      patientMap[patient.id] = patient.name;
    });

    // Merge the patient's name into each appointment object
    const appointmentsWithPatientNames = appointments.map(app => ({
      ...app,
      patient_name: patientMap[app.patient_id] || null
    }));

    return res.status(200).json({ appointments: appointmentsWithPatientNames, count });
  } catch (err) {
    console.error("Error in getAllAppointmentsByDoctor:", err);
    next(err);
  }
}


export async function getMyLiveStatus(req, res, next) {
  try {
    const { doctorId } = req.body;

    const { data, error } = await supabase
      .from('users')
      .select('live_status')
      .eq('id', doctorId)
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json({ live_status: data.live_status });
  } catch (err) {
    console.error('❌ Error fetching live status:', err);
    next(err);
  }
}

export async function changeMyLiveStatus(req, res, next) {
  try {
    const { doctorId } = req.body;

    // Fetch current live_status
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('live_status')
      .eq('id', doctorId)
      .single();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    // Toggle live_status
    const newStatus = !user.live_status;

    // Update live_status
    const { error: updateError } = await supabase
      .from('users')
      .update({ live_status: newStatus })
      .eq('id', doctorId);

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.json({ message: 'Live status updated successfully', live_status: newStatus });
  } catch (err) {
    console.error('❌ Error updating live status:', err);
    next(err);
  }
}


export async function fetchPatientsByDoctor(req, res, next) {
  const { doctorId } = req.body;
  console.log(doctorId);

  if (!doctorId) {
    return res.status(400).json({ error: 'doctorId is required' });
  }

  try {
    console.log(`Doctor ID: ${doctorId}`);

    // Fetch all accepted appointments for this doctor without any time filtering
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctorId)
      .eq('status', 'accepted');

    if (appointmentError) throw appointmentError;
    console.log(appointments);

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ appointments: [] });
    }

    // Extract unique patient IDs from the appointments
    const patientIds = appointments.map(app => app.patient_id);
    const uniquePatientIds = [...new Set(patientIds)];

    // Fetch all patient details for these patient IDs from the patients table
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .in('id', uniquePatientIds);

    if (patientError) throw patientError;

    // Create a lookup map from patient ID to full patient details
    const patientMap = {};
    patients.forEach(patient => {
      patientMap[patient.id] = patient;
    });

    // Merge patient details into each appointment object
    const appointmentsWithPatientInfo = appointments.map(app => ({
      ...app,
      patientInfo: patientMap[app.patient_id] || null
    }));

    res.status(200).json({ appointments: appointmentsWithPatientInfo });
  } catch (err) {
    console.error('Error fetching appointments with patient info:', err);
    next(err);
  }
}
