import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createActivity } from './userController.js';
import nodemailer from "nodemailer";
import { errorHandler } from '../utilis/error.js';
import { io } from '../index.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 1. Patient Registration
 * - Check if patient exists (using mobile number as identifier).
 * - Update details if necessary.
 * - Calculate and store the patient's age.
 * - Set patient status to 'registered'.
 */
// Create a mail transporter (move credentials to your .env file)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rustampavri1275@gmail.com',
    pass: 'djyh phga iwhf nkyr', // Note: Move to environment variables
  },
});


/**
 * Helper function: Handle extra tasks for emergency appointments.
 * - Emits a real-time alert via Socket.IO.
 * - Sends an email alert to the provided email address.
 */
async function handleEmergencyAppointmentExtra(appointment, email) {
  // (a) Emit a socket notification (you might want to target a specific user or broadcast to all)
  io.emit('emergencyAppointment', appointment);
  console.log(`Emitted emergencyAppointment for appointment ${appointment.id}`);

  // (b) Send email alert (customize the email content as needed)
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Emergency Appointment Scheduled',
    html: `
      <h2>Emergency Appointment Alert</h2>
      <p>An emergency appointment has been scheduled.</p>
      <p>
        <strong>Appointment ID:</strong> ${appointment.id}<br/>
        <strong>Doctor ID:</strong> ${appointment.doctor_id}<br/>
        <strong>Patient ID:</strong> ${appointment.patient_id}<br/>
        <strong>Time:</strong> ${appointment.appointment_date}
      </p>
      <p>Please take immediate action.</p>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending emergency email:', error);
    } else {
      console.log('Emergency email sent:', info.response);
    }
  });
}







////////done//////////may be we can use sql for age counting////////
export async function registerPatient(req, res, next) {
  console.log("registration");
  const {fdo, name, mobile, gender, dob, address } = req.body;
  console.log(req.body);
  
  if (!fdo || !name || !mobile || !gender || !dob || !address) {
    return res.status(400).json({ error: 'Name, mobile, gender, DOB, and address are required.' });
  }
  
  try {
    // Check for an existing patient by mobile number.
    const { existingPatients, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('mobile', mobile);


    // console.log(error);
    if (fetchError) throw fetchError;
    // console.log("Exisiting",data);
    
    // Calculate age from DOB.
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    
    let patient;
    if (existingPatients && existingPatients.length > 0) {
      // Update patient details if an existing record is found.
      patient = existingPatients[0];
      const { error: updateError } = await supabase
        .from('patients')
        .update({ name, gender, dob, address, age, status: 'registered' })
        .eq('id', patient.id);
      if (updateError) throw updateError;
    } else {
      // Create a new patient record.
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert([{ name, mobile, gender, dob, address, age, status: 'registered' }])
        .select();
      if (insertError) throw insertError;
      patient = data[0];
    }
    createActivity(fdo,`Patient ${name} registered successfully. `);
    
    res.status(200).json({ message: 'Patient registered successfully.', patient });
  } catch (err) {
    next(err);
  }
}

/**
 * 2. Appointment Scheduling
 * - Insert a new appointment record linking the patient and doctor.
 * - For simplicity, this example assumes the provided appointment date/time is valid.
 * - Placeholder for running an algorithm to determine available slots.
 * - Sends back the created appointment record.
 */
export async function scheduleAppointment(req, res, next) {
  console.log("Scheduling appointment");
  const { fdo, patientId, doctorId, appointmentDate, slot, condition, emergency } = req.body;

  console.log(req.body);

  // For emergency appointments, slot is not required.
  if (!fdo || !patientId || !doctorId || !appointmentDate || !condition || (!emergency && !slot)) {
    return res.status(400).json({ error: 'All appointment fields are required.' });
  }

  try {
    let appointmentDateTime;

    if (emergency) {
      // For emergency appointments, schedule immediately (using current time).
      appointmentDateTime = new Date().toISOString();
    } else {
      // Count existing pending appointments for the doctor in the same slot and date.
      const { count, error: countError } = await supabase
        .from('appointments')
        .select('id', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('slot', slot)
        .neq('status', 'declined')
        .gte('appointment_date', `${appointmentDate}T00:00:00Z`)
        .lte('appointment_date', `${appointmentDate}T23:59:59Z`);
      
      if (countError) throw countError;

      const totalCount = count ?? 0;
      if (totalCount >= 10) {
        return res.status(400).json({ error: 'No available appointment slots for this time slot.' });
      }

      // Determine base time based on slot.
      let baseHour;
      if (slot === 1) baseHour = 9;
      else if (slot === 2) baseHour = 14;
      else if (slot === 3) baseHour = 18;
      else return res.status(400).json({ error: 'Invalid slot provided.' });

      const baseTime = new Date(`${appointmentDate}T${String(baseHour).padStart(2, '0')}:00:00Z`);
      appointmentDateTime = new Date(baseTime.getTime() + (totalCount * 15 * 60 * 1000)).toISOString();
    }

    // Build the payload. For emergency appointments, slot is not included.
    const appointmentPayload = {
      patient_id: patientId,
      doctor_id: doctorId,
      appointment_date: appointmentDateTime,
      reason: condition,
      status: 'pending',
      emergency: emergency
    };

    if (!emergency) {
      appointmentPayload.slot = slot;
    }

    // Insert the new appointment.
    const { data: appointmentData, error: insertError } = await supabase
      .from('appointments')
      .insert([ appointmentPayload ])
      .select();

    if (insertError) throw insertError;

    // Log activity.
    await createActivity(fdo, `Appointment Scheduled for Patient ID: ${patientId}`);
// Get the scheduled appointment record.
const scheduledAppointment = appointmentData[0];
    if (emergency) {
      // Fetch the doctor's email from the users table based on doctor_id.
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('email')
        .eq('id', doctorId)
        .single();

      if (doctorError || !doctorData) {
        console.error("Error fetching doctor's email:", doctorError);
        // Fallback to a default email if needed.
        doctorData = { email: "emergency@yourdomain.com" };
      }

      const emergencyEmail = doctorData.email;
      await handleEmergencyAppointmentExtra(scheduledAppointment, emergencyEmail);
    }

    res.status(200).json({
      message: emergency
        ? 'Emergency appointment scheduled successfully. Please proceed immediately to the emergency department.'
        : 'Appointment scheduled successfully and department patient count updated.',
      appointment: appointmentData[0],
      scheduledTime: appointmentDateTime
    });
    
  } catch (err) {
    console.error("Error in scheduleAppointment:", err);
    next(err);
  }
}

/**
 * 3. Admit Patient
 * - Creates an admission record linking the patient to a room.
 * - Updates the patient's status to 'admitted'.
 * - Increments the occupied count in the Rooms table.
 */
////part of room updation and type of rooms needed///////
export async function admitPatient(req, res, next) {
  const { patientId, roomId, admissionDate, notes } = req.body;
  
  if (!patientId || !roomId || !admissionDate) {
    return res.status(400).json({ error: 'patientId, roomId, and admissionDate are required.' });
  }
  
  // Convert patientId to a number since the table uses a numeric id.
  const numericPatientId = Number(patientId);
  
  try {
    // Insert a new admission record.
    const { data: admissionData, error: admissionError } = await supabase
      .from('admissions')
      .insert([{ patient_id: numericPatientId, room_id: roomId, admission_date: admissionDate, notes }])
      .select();
    if (admissionError) throw admissionError;
    
    // Update patient's status to 'admitted'.
    const { error: patientError } = await supabase
      .from('patients')
      .update({ status: 'admitted' })
      .eq('id', numericPatientId);  // Now comparing numbers
    if (patientError) throw patientError;

    console.log("hii1");
    
    // Update room occupancy: increment occupied_count.
    const { data: roomData, error: roomFetchError } = await supabase
      .from('rooms')
      .select('occupied_count')
      .eq('id', roomId)
      .single();
    if (roomFetchError) throw roomFetchError;
    
    const newOccupiedCount = roomData.occupied_count + 1;
    const { error: roomUpdateError } = await supabase
      .from('rooms')
      .update({ occupied_count: newOccupiedCount })
      .eq('id', roomId);
    if (roomUpdateError) throw roomUpdateError;
    
    res.status(200).json({ message: 'Patient admitted successfully.', admission: admissionData[0] });
  } catch (err) {
    next(err);
  }
}


/**
 * 4. Discharge Patient
 * - Updates the corresponding admission record with discharge details.
 * - Updates the patient's status to 'discharged'.
 * - Decrements the room occupancy in the Rooms table.
 */
//done////////////////
export async function dischargePatient(req, res, next) {
  const { patientId, dischargeDate, remarks } = req.body;
  
  if (!patientId || !dischargeDate) {
    return res.status(400).json({ error: 'patientId and dischargeDate are required.' });
  }
  
  try {
    // Update the admission record for the patient (only the active admission).
    const { data: admissionData, error: admissionError } = await supabase
      .from('admissions')
      .update({ discharge_date: dischargeDate, notes: remarks })
      .eq('patient_id', patientId)
      .is('discharge_date', null)
      .select();
    if (admissionError) throw admissionError;
    if (!admissionData || admissionData.length === 0) {
      return res.status(404).json({ error: 'Active admission record not found for this patient.' });
    }
    console.log(admissionData[0]);
    const admissionRecord = admissionData[0];
    
    // Update the patient's status to 'discharged'.
    const { error: patientError } = await supabase
      .from('patients')
      .update({ status: 'discharged' })
      .eq('id', patientId);
    if (patientError) throw patientError;
    
    // Update room occupancy: decrement occupied_count.
    const roomId = admissionRecord.room_id;
    const { data: roomData, error: roomFetchError } = await supabase
      .from('rooms')
      .select('occupied_count')
      .eq('id', roomId)
      .single();
    if (roomFetchError) throw roomFetchError;
    
    const newOccupiedCount = Math.max(0, roomData.occupied_count - 1);
    const { error: roomUpdateError } = await supabase
      .from('rooms')
      .update({ occupied_count: newOccupiedCount })
      .eq('id', roomId);
    if (roomUpdateError) throw roomUpdateError;
    
    res.status(200).json({ message: 'Patient discharged successfully.', admission: admissionRecord });
  } catch (err) {
    next(err);
  }
}

/**
 * GET: Retrieve summary of rooms by department and room type.
 * Returns an array of objects with:
 * - department_id
 * - department_name
 * - room_type
 * - total_count
 * - occupied_count
 * - available_rooms (total_count - occupied_count)
 */

export async function getRoomsSummary(req, res, next) {
  console.log("Room Summary");
  try {
    // We assume that each room row represents a unique department & room type combination.
    // Optionally, you can use a join to fetch department name from the departments table.
    const { data, error } = await supabase
      .from('rooms')
      .select(`
        id,
        department_id,
        room_type,
        total_count,
        occupied_count,
        departments (
          id,
          name
        )
      `);
      
    if (error) throw error;
    
    // Map through the data to calculate available_rooms and format the response.
    const summary = data.map(room => ({
      room_id : room.id,
      department_id: room.department_id,
      department_name: room.departments ? room.departments.name : null,
      room_type: room.room_type,
      total_count: room.total_count,
      occupied_count: room.occupied_count,
      available_rooms: room.total_count - room.occupied_count
    }));
    
    res.status(200).json({ summary });
  } catch (err) {
    next(err);
  }
}

export async function seedRooms(req, res, next) {
  console.log("Adding Emergency room type for each department");

  try {
    // Define the 10 departments
    const departments = [
      { id: 1, name: 'Cardiology' },
      { id: 2, name: 'Neurology' },
      { id: 3, name: 'Orthopedics' },
      { id: 4, name: 'Pediatrics' },
      { id: 5, name: 'Oncology' },
      { id: 6, name: 'Gynecology' },
      { id: 7, name: 'Dermatology' },
      { id: 8, name: 'Gastroenterology' },
      { id: 9, name: 'Pulmonology' },
      { id: 10, name: 'Urology' }
    ];

    const emergencyRoomsResults = [];

    for (const dept of departments) {
      // Check if an Emergency room record already exists for this department
      const { data: existing, error: fetchError } = await supabase
        .from('rooms')
        .select('id')
        .eq('department_id', dept.id)
        .eq('room_type', 'Emergency')
        .maybeSingle();

      if (fetchError) {
        throw fetchError;
      }

      if (existing) {
        // Update the existing Emergency room record
        const { data: updated, error: updateError } = await supabase
          .from('rooms')
          .update({ total_count: 10, occupied_count: 0 })
          .eq('id', existing.id)
          .select();

        if (updateError) {
          throw updateError;
        }
        emergencyRoomsResults.push(updated[0]);
      } else {
        // Insert a new Emergency room record
        const { data: inserted, error: insertError } = await supabase
          .from('rooms')
          .insert({
            department_id: dept.id,
            room_type: 'Emergency',
            total_count: 10,  // Adjust the count as needed
            occupied_count: 0
          })
          .select();

        if (insertError) {
          throw insertError;
        }
        emergencyRoomsResults.push(inserted[0]);
      }
    }

    res.status(200).json({ message: 'Emergency rooms added/updated successfully.', rooms: emergencyRoomsResults });
  } catch (err) {
    next(err);
  }
}



/**
 * Seed Departments Data:
 * Inserts department data for 10 departments.
 */
export async function seedDepartments(req, res, next) {
  console.log("sedding department ");
  const departmentsData = [
    { name: 'Cardiology', description: 'Heart related treatments.' },
    { name: 'Neurology', description: 'Brain and nervous system.' },
    { name: 'Orthopedics', description: 'Bone and joint treatments.' },
    { name: 'Pediatrics', description: 'Child health and care.' },
    { name: 'Oncology', description: 'Cancer diagnosis and treatment.' },
    { name: 'Gynecology', description: 'Women\'s health care.' },
    { name: 'Dermatology', description: 'Skin related treatments.' },
    { name: 'Gastroenterology', description: 'Digestive system treatments.' },
    { name: 'Pulmonology', description: 'Lung and respiratory treatments.' },
    { name: 'Urology', description: 'Urinary tract and male reproductive health.' }
  ];

  try {
    const { data, error } = await supabase
      .from('departments')
      .insert(departmentsData)
      .select();
     console.log("hii");
     console.log(error);
    if (error) throw error;
    console.log("byee")

    res.status(200).json({ message: 'Departments seeded successfully.', departments: data });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Example function to add a new doctor and update the department's doctor_count
export async function addDoctor(req, res, next) {
  // Assume the request body includes: name, username, email, department, etc.
  const { name, username, email, department, ...otherDetails } = req.body;
  
  if (!name || !username || !email || !department) {
    return res.status(400).json({ error: 'Missing required doctor fields.' });
  }
  
  try {
    // Insert the doctor record into the "users" table.
    const { data: doctorData, error: insertError } = await supabase
      .from('users')
      .insert([{ name, username, email, department, ...otherDetails }])
      .select();
    if (insertError) throw insertError;
    
    // Fetch current doctor_count from the departments table for this department.
    const { data: deptData, error: deptError } = await supabase
      .from('departments')
      .select('doctor_count')
      .eq('name', department)
      .single();
    if (deptError) throw deptError;
    
    const newDoctorCount = deptData.doctor_count + 1;
    
    // Update the department's doctor_count.
    const { error: updateError } = await supabase
      .from('departments')
      .update({ doctor_count: newDoctorCount })
      .eq('name', department);
    if (updateError) throw updateError;
    
    res.status(200).json({
      message: 'Doctor added successfully and department count updated.',
      doctor: doctorData[0],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a doctor (user) and update the department's doctor_count.
 * Expects doctorId as a URL parameter.
 */
export async function deleteDoctor(req, res, next) {
  const { doctorId } = req.params;
  if (!doctorId) {
    return res.status(400).json({ error: 'doctorId is required.' });
  }
  try {
    // Get the doctor's department.
    const { data: doctorData, error: doctorError } = await supabase
      .from('users')
      .select('department')
      .eq('id', doctorId)
      .single();
    if (doctorError) throw doctorError;
    const department = doctorData.department;
    
    // Delete the doctor.
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', doctorId);
    if (deleteError) throw deleteError;
    
    // Fetch current doctor_count for the department.
    const { data: deptData, error: deptError } = await supabase
      .from('departments')
      .select('doctor_count')
      .eq('name', department)
      .single();
    if (deptError) throw deptError;
    
    // Decrement the count.
    const newDoctorCount = Math.max(0, deptData.doctor_count - 1);
    const { error: updateError } = await supabase
      .from('departments')
      .update({ doctor_count: newDoctorCount })
      .eq('name', department);
    if (updateError) throw updateError;
    
    res.status(200).json({
      message: 'Doctor deleted and department doctor count updated.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a patient and update the department's patient_count.
 * Expects patientId as a URL parameter.
 * This function deletes the patient record and associated appointments,
 * then for each distinct department (derived from the doctor of the appointment),
 * decrements the patient_count by 1.
 */
export async function deletePatient(req, res, next) {
  const { patientId } = req.params;
  if (!patientId) {
    return res.status(400).json({ error: 'patientId is required.' });
  }
  try {
    // Get all appointments for this patient.
    const { data: appointments, error: appError } = await supabase
      .from('appointments')
      .select('doctor_id')
      .eq('patient_id', patientId);
    if (appError) throw appError;
    
    // Gather distinct departments for these appointments.
    const departmentSet = new Set();
    for (const appointment of appointments) {
      const { data: doctorData, error: doctorError } = await supabase
        .from('users')
        .select('department')
        .eq('id', appointment.doctor_id)
        .single();
      if (doctorError) throw doctorError;
      if (doctorData && doctorData.department) {
        departmentSet.add(doctorData.department);
      }
    }
    
    // Delete appointments for the patient.
    const { error: deleteAppsError } = await supabase
      .from('appointments')
      .delete()
      .eq('patient_id', patientId);
    if (deleteAppsError) throw deleteAppsError;
    
    // Delete the patient record.
    const { error: deletePatientError } = await supabase
      .from('patients')
      .delete()
      .eq('id', patientId);
    if (deletePatientError) throw deletePatientError;
    
    // For each department, decrement the patient_count by 1.
    for (const dept of departmentSet) {
      const { data: deptData, error: fetchError } = await supabase
        .from('departments')
        .select('patient_count')
        .eq('name', dept)
        .single();
      if (fetchError) throw fetchError;
      const newPatientCount = Math.max(0, deptData.patient_count - 1);
      const { error: updateError } = await supabase
        .from('departments')
        .update({ patient_count: newPatientCount })
        .eq('name', dept);
      if (updateError) throw updateError;
    }
    
    res.status(200).json({
      message: 'Patient deleted and department patient counts updated.',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Delete a department and update related information if needed.
 * Expects departmentId as a URL parameter.
 */
export async function deleteDepartment(req, res, next) {
  console.log("deleting department");
  const { departmentId } = req.params;
  if (!departmentId) {
    return res.status(400).json({ error: 'departmentId is required.' });
  }
  try {
    // Optionally, you could check if there are any doctors or appointments associated with this department.
    // For now, we attempt the deletion directly.
    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', departmentId);
    if (error) throw error;
    
    res.status(200).json({
      message: 'Department deleted successfully.'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Upsert a department and its related room data.
 * Input (JSON body):
 *  - departmentName: string
 *  - doctorCount: number
 *  - patientCount: number
 *  - premiumRoomCount: number
 *  - executiveRoomCount: number
 *  - basicRoomCount: number
 */
export async function upsertDepartmentAndRooms(req, res, next) {
  console.log("Inserting department");
  const { departmentName, doctorCount, patientCount, premiumRoomCount, executiveRoomCount, basicRoomCount } = req.body;

  if (
    !departmentName ||
    doctorCount === undefined ||
    patientCount === undefined ||
    premiumRoomCount === undefined ||
    executiveRoomCount === undefined ||
    basicRoomCount === undefined
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Upsert the department: check if it exists by its unique name.
    let departmentId;
    const { data: existingDept, error: deptError } = await supabase
      .from('departments')
      .select('*')
      .eq('name', departmentName)
      .single();

    if (deptError && existingDept === null) {
      // If error and no department found, we'll insert new below.
      // (We assume error here means no record found; adjust if needed.)
    }

    if (existingDept) {
      // Update the department's doctor and patient counts.
      const { error: updateDeptError } = await supabase
        .from('departments')
        .update({ doctor_count: doctorCount, patient_count: patientCount })
        .eq('name', departmentName);
      if (updateDeptError) throw updateDeptError;
      departmentId = existingDept.id;
    } else {
      // Insert new department.
      const { data: newDept, error: insertDeptError } = await supabase
        .from('departments')
        .insert([{ name: departmentName, doctor_count: doctorCount, patient_count: patientCount }])
        .select();
      if (insertDeptError) throw insertDeptError;
      departmentId = newDept[0].id;
    }

    // Define room types and their respective counts.
    const roomTypes = [
      { roomType: 'Premium', total_count: premiumRoomCount },
      { roomType: 'Executive', total_count: executiveRoomCount },
      { roomType: 'Basic', total_count: basicRoomCount },
    ];

    // Upsert room records for each room type in the given department.
    for (const room of roomTypes) {
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('*')
        .eq('department_id', departmentId)
        .eq('room_type', room.roomType)
        .single();

      if (existingRoom) {
        // Update the room's total_count.
        const { error: updateRoomError } = await supabase
          .from('rooms')
          .update({ total_count: room.total_count })
          .eq('department_id', departmentId)
          .eq('room_type', room.roomType);
        if (updateRoomError) throw updateRoomError;
      } else {
        // Insert new room record with occupied_count = 0.
        const { error: insertRoomError } = await supabase
          .from('rooms')
          .insert([{
            department_id: departmentId,
            room_type: room.roomType,
            total_count: room.total_count,
            occupied_count: 0
          }]);
        if (insertRoomError) throw insertRoomError;
      }
    }

    res.status(200).json({ message: "Department and room data upserted successfully." });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all registered patients.
 * This function fetches all records from the "patients" table with status "registered".
 */
export async function getAllRegisteredPatients(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
      
    if (error) throw error;
    
    res.status(200).json({ patients: data });
  } catch (err) {
    next(err);
  }
}

export async function getrRecentRegisteredPatients(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .limit(4);
      
    if (error) throw error;
    
    res.status(200).json({ patients: data });
  } catch (err) {
    next(err);
  }
}



export async function getSlotDistributionByDate(req, res, next) {
  const { doctorId, date } = req.body;
  console.log(req.body);
  if (!doctorId || !date) {
    return res.status(400).json({ error: 'doctorId and date are required in request body (format: YYYY-MM-DD)' });
  }

  const totalPerSlot = 10;

  try {
    const slots = [1, 2, 3];
    const distribution = {};

    for (const slot of slots) {
      // Count accepted appointments for this slot
      const { count: acceptedCount, error: acceptedError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('slot', slot)
        .eq('status', 'accepted')
        .gte('appointment_date', `${date}T00:00:00Z`)
        .lte('appointment_date', `${date}T23:59:59Z`);

      if (acceptedError) throw acceptedError;

      // Count pending appointments for this slot
      const { count: pendingCount, error: pendingError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('doctor_id', doctorId)
        .eq('slot', slot)
        .eq('status', 'pending')
        .gte('appointment_date', `${date}T00:00:00Z`)
        .lte('appointment_date', `${date}T23:59:59Z`);

      if (pendingError) throw pendingError;

      const accepted = acceptedCount || 0;
      const pending = pendingCount || 0;
      const available = Math.max(0, totalPerSlot - accepted - pending);

      distribution[`slot${slot}`] = {
        total: totalPerSlot,
        accepted,
        pending,
        available,
      };
    }

    res.status(200).json(distribution);
  } catch (err) {
    console.error('Error in getSlotDistributionByDate:', err);
    next(err);
  }
}



export async function fetchDoctorByPatient(req, res, next) {
  const { patientId } = req.body;
  console.log("fetching patiend doctor data");

  if (!patientId) {
    return res.status(400).json({ error: 'Patient ID is required in the URL parameters.' });
  }

  try {
    // Fetch all appointments for the given patient
    const { data: appointments, error: appointmentError } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId);

    if (appointmentError) throw appointmentError;

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ error: 'No appointments found for the given patient ID.' });
    }

    // Extract unique doctor IDs from the appointments
    const doctorIds = [...new Set(appointments.map(appointment => appointment.doctor_id))];
    console.log(doctorIds);
    // Fetch doctor details from the users table
    const { data: doctors, error: doctorError } = await supabase
      .from('users')
      .select('id, name, username, email, department, specialisation, mobile, profile_picture')
      .in('id', doctorIds);

    if (doctorError) throw doctorError;

    res.status(200).json({ appointments, doctors });
  } catch (err) {
    next(err);
  }
}
// /**
//  * Get full history for a patient including basic info, appointments, admissions, tests, treatments, and reports.
//  * Expects a patientId as a URL parameter.
//  */
// export async function getPatientHistory(req, res, next) {
//   console.log("Fetching patient history...");

//   const { patientId } = req.params;
//   if (!patientId) {
//     return res.status(400).json({ error: 'patientId is required.' });
//   }
  
//   try {
//     // 1. Get basic patient details.
//     const { data: patient, error: patientError } = await supabase
//       .from('patients')
//       .select('*')
//       .eq('id', patientId)
//       .single();
//     if (patientError) throw patientError;
    
//     // 2. Get appointments for this patient.
//     const { data: appointmentsData, error: appointmentsError } = await supabase
//       .from('appointments')
//       .select('*')
//       .eq('patient_id', patientId);
//     if (appointmentsError) throw appointmentsError;
    
//     // 3. Fetch doctor details for appointments separately.
//     const doctorIds = [
//       ...new Set(appointmentsData.map(app => app.doctor_id))
//     ];
//     let doctorsData = [];
//     if (doctorIds.length > 0) {
//       const { data: doctors, error: doctorsError } = await supabase
//         .from('users')
//         .select('id, name, username, email, department, specialisation')
//         .in('id', doctorIds);
//       if (doctorsError) throw doctorsError;
//       doctorsData = doctors;
//     }
    
//     // 4. Merge doctor details manually into appointments.
//     const appointments = appointmentsData.map(app => {
//       const doctor = doctorsData.find(doc => doc.id === app.doctor_id);
//       return {
//         ...app,
//         doctor,  // add doctor info to each appointment
//       };
//     });
    
//     // 5. Get admissions for this patient.
//     const { data: admissionsData, error: admissionsError } = await supabase
//       .from('admissions')
//       .select('*')
//       .eq('patient_id', patientId);
//     if (admissionsError) throw admissionsError;
    
//     // 6. Fetch room details for admissions separately.
//     // Here we assume that each admission has a "room_id" field referencing a room.
//     const roomIds = [
//       ...new Set(admissionsData.map(adm => adm.room_id))
//     ];
//     let roomsData = [];
//     if (roomIds.length > 0) {
//       const { data: rooms, error: roomsError } = await supabase
//         .from('rooms')
//         .select('id, department_id, room_type, total_count, occupied_count')
//         .in('id', roomIds);
//       if (roomsError) throw roomsError;
//       roomsData = rooms;
//     }
    
//     // 7. Merge room details manually into admissions.
//     const admissions = admissionsData.map(adm => {
//       const room = roomsData.find(rm => rm.id === adm.room_id);
//       return {
//         ...adm,
//         room,  // add room info to each admission
//       };
//     });
    
//     // 8. Get tests for this patient.
//     const { data: tests, error: testsError } = await supabase
//       .from('Tests')
//       .select('*')
//       .eq('patient_id', patientId);
//     if (testsError) throw testsError;
    
//     // 9. Get treatments for this patient.
//     const { data: treatments, error: treatmentsError } = await supabase
//       .from('Treatments')
//       .select('*')
//       .eq('patient_id', patientId);
//     if (treatmentsError) throw treatmentsError;
    
//     // 10. Get reports for this patient.
//     const { data: reports, error: reportsError } = await supabase
//       .from('Reports')
//       .select('*')
//       .eq('patient_id', patientId);
//     if (reportsError) throw reportsError;
    
//     // Aggregate all data into a single object.
//     const history = {
//       patient,
//       appointments,
//       admissions,
//       tests,
//       treatments,
//       reports,
//     };
    
//     res.status(200).json({ history });
//   } catch (err) {
//     next(err);
//   }
// }


/**
 * Get full history for a patient including basic info, appointments, admissions, tests, treatments, and reports.
 * Expects a patientId as a URL parameter.
 */
export async function getPatientHistory(req, res, next) {
  const { patientId } = req.params;
  if (!patientId) {
    return res.status(400).json({ error: 'patientId is required.' });
  }
  
  try {
    // 1. Get basic patient details.
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
    if (patientError) throw patientError;
    
    // 2. Get appointments for this patient (without using relationship aliases).
    const { data: appointmentsRaw, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_id', patientId);
    if (appointmentsError) throw appointmentsError;
    
    // Extract unique doctor IDs from appointments.
    const doctorIds = [...new Set(appointmentsRaw.map(apt => apt.doctor_id))];
    let doctorsMap = {};
    if (doctorIds.length > 0) {
      const { data: doctorsData, error: doctorsError } = await supabase
        .from('users')
        .select('*')
        .in('id', doctorIds);
      if (doctorsError) throw doctorsError;
      doctorsData.forEach(doctor => {
        doctorsMap[doctor.id] = doctor;
      });
    }
    // Attach doctor details manually.
    const appointments = appointmentsRaw.map(apt => ({
      ...apt,
      doctor: doctorsMap[apt.doctor_id] || null
    }));
    
    // 3. Get admissions for this patient.
    const { data: admissionsRaw, error: admissionsError } = await supabase
      .from('admissions')
      .select('*')
      .eq('patient_id', patientId);
    if (admissionsError) throw admissionsError;
    
    // Extract unique room IDs from admissions.
    const roomIds = [...new Set(admissionsRaw.map(adm => adm.room_id))];
    let roomsMap = {};
    if (roomIds.length > 0) {
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .in('id', roomIds);
      if (roomsError) throw roomsError;
      roomsData.forEach(room => {
        roomsMap[room.id] = room;
      });
    }
    // Attach room details to admissions.
    const admissions = admissionsRaw.map(adm => ({
      ...adm,
      room: roomsMap[adm.room_id] || null
    }));
    
    // 4. Get tests for this patient.
    const { data: tests, error: testsError } = await supabase
      .from('tests')
      .select('*')
      .eq('patient_id', patientId);
    if (testsError) throw testsError;
    
    // 5. Get treatments for this patient.
    const { data: treatments, error: treatmentsError } = await supabase
      .from('treatments')
      .select('*')
      .eq('patient_id', patientId);
    if (treatmentsError) throw treatmentsError;
    
    // 6. Get reports for this patient.
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('patient_id', patientId);
    if (reportsError) throw reportsError;
    
    // Aggregate all data.
    const history = {
      patient,
      appointments,
      admissions,
      tests,
      treatments,
      reports
    };
    
    res.status(200).json({ history });
  } catch (err) {
    next(err);
  }
}


/**
 * Get FDO Home Page Statistics:
 * - Total Patients Registered
 * - Total Active Admissions (admissions where discharge_date is null)
 * - Total Appointments for today (with status either 'pending' or 'accepted')
 */
export async function getFdoHomeStats(req, res, next) {
  try {
    // Count all patients in the "patients" table.
    const { count: totalPatients, error: patientsError } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true });
    if (patientsError) throw patientsError;
    
    // Count active admissions: discharge_date is null.
    const { count: activeAdmissions, error: admissionsError } = await supabase
      .from('admissions')
      .select('*', { count: 'exact', head: true })
      .is('discharge_date', null);
    if (admissionsError) throw admissionsError;
    
    // Get today's start and end times (UTC)
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString();
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999)).toISOString();
    
    // Count appointments for today where status is either 'pending' or 'accepted'.
    const { count: totalAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'accepted'])
      .gte('appointment_date', startOfDay)
      .lte('appointment_date', endOfDay);
    if (appointmentsError) throw appointmentsError;
    
    res.status(200).json({
      totalPatients,
      activeAdmissions,
      totalAppointments
    });
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentExtremes(req, res, next) {
  try {
    // 1. Max Patient Department
    const { data: maxPatientData, error: maxPatientError } = await supabase
      .from('departments')
      .select('*')
      .order('patient_count', { ascending: false })
      .limit(1)
      .single();
    if (maxPatientError) throw maxPatientError;

    // 2. Min Patient Department
    const { data: minPatientData, error: minPatientError } = await supabase
      .from('departments')
      .select('*')
      .order('patient_count', { ascending: true })
      .limit(1)
      .single();
    if (minPatientError) throw minPatientError;

    // 3. Max Doctor Department
    const { data: maxDoctorData, error: maxDoctorError } = await supabase
      .from('departments')
      .select('*')
      .order('doctor_count', { ascending: false })
      .limit(1)
      .single();
    if (maxDoctorError) throw maxDoctorError;

    // 4. Min Doctor Department
    const { data: minDoctorData, error: minDoctorError } = await supabase
      .from('departments')
      .select('*')
      .order('doctor_count', { ascending: true })
      .limit(1)
      .single();
    if (minDoctorError) throw minDoctorError;

    // ---- 5. Max Rooms Department ----
    const { data: maxRoomAggData, error: maxRoomAggError } = await supabase
      .from('rooms')
      .select('department_id, total_count')
      .order('total_count', { ascending: false })
      .limit(1)
      .single();
    if (maxRoomAggError) throw maxRoomAggError;

    let maxRoomDepartment = null;
    if (maxRoomAggData) {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .eq('id', maxRoomAggData.department_id)
        .single();
      if (deptError) throw deptError;
      maxRoomDepartment = {
        ...deptData,
        total_rooms: maxRoomAggData.total_count,
      };
    }

    // ---- 6. Min Rooms Department ----
    const { data: minRoomAggData, error: minRoomAggError } = await supabase
      .from('rooms')
      .select('department_id, total_count')
      .order('total_count', { ascending: true })
      .limit(1)
      .single();
    if (minRoomAggError) throw minRoomAggError;

    let minRoomDepartment = null;
    if (minRoomAggData) {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .eq('id', minRoomAggData.department_id)
        .single();
      if (deptError) throw deptError;
      minRoomDepartment = {
        ...deptData,
        total_rooms: minRoomAggData.total_count,
      };
    }

    // --- Final Response ---
    res.status(200).json({
      maxPatientDepartment: maxPatientData,
      minPatientDepartment: minPatientData,
      maxDoctorDepartment: maxDoctorData,
      minDoctorDepartment: minDoctorData,
      maxRoomDepartment,
      minRoomDepartment,
    });
  } catch (err) {
    next(err);
  }
}


/**
 * Get all appointments (no doctor filter)
 * Route: GET /appointments/all
 */
export async function getAllAppointments(req, res, next) {
  try {
    // Fetch every appointment, with an exact row count
    const { data: appointments, error: appointmentError, count } = await supabase
      .from('appointments')
      .select('*', { count: 'exact' });

    if (appointmentError) {
      return res.status(500).json({ error: appointmentError.message });
    }

    // If there are none, return empty array + zero count
    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ appointments: [], count: 0 });
    }

    // Gather all unique patient IDs
    const patientIds = [...new Set(appointments.map(app => app.patient_id))];

    // Fetch those patients’ names
    const { data: patients, error: patientError } = await supabase
      .from('patients')
      .select('id, name')
      .in('id', patientIds);

    if (patientError) {
      return res.status(500).json({ error: patientError.message });
    }

    // Build lookup map patient_id → name
    const patientMap = {};
    patients.forEach(p => {
      patientMap[p.id] = p.name;
    });

    // Merge patient_name into each appointment
    const appointmentsWithPatientNames = appointments.map(app => ({
      ...app,
      patient_name: patientMap[app.patient_id] || null
    }));

    // Respond with full list plus count
    return res.status(200).json({
      appointments: appointmentsWithPatientNames,
      count
    });
  } catch (err) {
    console.error("Error in getAllAppointments:", err);
    next(err);
  }
}
