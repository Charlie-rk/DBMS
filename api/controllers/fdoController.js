import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

////////done//////////may be we can use sql for age counting////////
export async function registerPatient(req, res, next) {
  const { name, mobile, dob, address } = req.body;
  
  if (!name || !mobile || !dob || !address) {
    return res.status(400).json({ error: 'Name, mobile, DOB, and address are required.' });
  }
  
  try {
    // Check for an existing patient by mobile number.
    const { data: existingPatients, error: fetchError } = await supabase
      .from('patients')
      .select('*')
      .eq('mobile', mobile);
    if (fetchError) throw fetchError;
    
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
        .update({ name, dob, address, age, status: 'registered' })
        .eq('id', patient.id);
      if (updateError) throw updateError;
    } else {
      // Create a new patient record.
      const { data, error: insertError } = await supabase
        .from('patients')
        .insert([{ name, mobile, dob, address, age, status: 'registered' }])
        .select();
      if (insertError) throw insertError;
      patient = data[0];
    }
    
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

//////////algorithm reamining & doctor's appointment information also //////////////
export async function scheduleAppointment(req, res, next) {
  const { patientId, doctorId, appointmentDate, appointmentTime, condition } = req.body;
  
  if (!patientId || !doctorId || !appointmentDate || !appointmentTime || !condition) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Combine date and time into a proper ISO string.
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}:00Z`).toISOString();
    
    // Insert the new appointment with status set as 'scheduled'.
    const { data, error } = await supabase
      .from('appointments')
      .insert([{ 
        patient_id: patientId, 
        doctor_id: doctorId, 
        appointment_date: appointmentDateTime, 
        condition, 
        status: 'scheduled' 
      }])
      .select();
    if (error) throw error;
    
    // TODO: Run algorithm to determine the best available slot & send notifications if needed.
    
    res.status(200).json({ message: 'Appointment scheduled successfully.', appointment: data[0] });
  } catch (err) {
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
  
  try {
    // Insert a new admission record.
    const { data: admissionData, error: admissionError } = await supabase
      .from('admissions')
      .insert([{ patient_id: patientId, room_id: roomId, admission_date: admissionDate, notes }])
      .select();
    if (admissionError) throw admissionError;
    
    // Update patient's status to 'admitted'.
    const { error: patientError } = await supabase
      .from('patients')
      .update({ status: 'admitted' })
      .eq('id', patientId);
    if (patientError) throw patientError;
    
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


/**
 * Seed Rooms Data:
 * Inserts room data for multiple departments.
 * For each department (assumed to have IDs 1 to 10), three room types are added:
 *  - Premium: total_count = 30
 *  - Executive: total_count = 40
 *  - General: total_count = 50
 */
export async function seedRooms(req, res, next) {
  try {
    // Define 10 departments with assumed IDs and names
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
    
    // Prepare room data for each department
    const roomsToInsert = [];
    for (const dept of departments) {
      roomsToInsert.push(
        { department_id: dept.id, room_type: 'Premium', total_count: 30, occupied_count: 0 },
        { department_id: dept.id, room_type: 'Executive', total_count: 40, occupied_count: 0 },
        { department_id: dept.id, room_type: 'General', total_count: 50, occupied_count: 0 }
      );
    }
    
    // Insert the rooms data into the "rooms" table
    const { data, error } = await supabase
      .from('rooms')
      .insert(roomsToInsert)
      .select();
      
    if (error) throw error;
    
    res.status(200).json({ message: 'Rooms seeded successfully.', rooms: data });
  } catch (err) {
    next(err);
  }
}


