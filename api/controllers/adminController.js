import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';



dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in your environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rustampavri1275@gmail.com',
    pass: 'djyh phga iwhf nkyr', // Note: Move to environment variables
  },
});

/**
 * Send a welcome email to the newly registered user.
 * @param {Object} user - The user object containing registration details.
 * @param {string} secretKey - The secret key generated based on the user's role.
 */

export async function sendWelcomeEmail(user, secretKey) {
  console.log("user ",user);
  // Build the HTML content for the email
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome to We ~ Go Hospital Management</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="background: linear-gradient(135deg, #87CEEB, #f7fafa); padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden;">
        <div style="padding: 20px; text-align: center; background: #f4f4f4;">
          <h1 style="color: #333; margin-bottom: 5px;">🎉 Welcome to We ~ Go</h1>
          <p style="color: #555; margin-top: 0;">Congratulations on your successful registration!</p>
        </div>
        <div style="padding: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Field</th>
              <th style="text-align: left; padding: 8px; border-bottom: 1px solid #ddd;">Details</th>
            </tr>
            <tr>
              <td style="padding: 8px;">Name</td>
              <td style="padding: 8px;">${user.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Username</td>
              <td style="padding: 8px;">${user.username}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Email</td>
              <td style="padding: 8px;">${user.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Role</td>
              <td style="padding: 8px;">${user.role}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Password</td>
              <td style="padding: 8px;">${user.password}</td>
            </tr>
            <tr>
              <td style="padding: 8px;">Secret Key</td>
              <td style="padding: 8px;">${secretKey}</td>
            </tr>
          </table>
        </div>
        <div>  
        <p style="font-style: italic; color: #ff0000; margin: 5px 5px 5px 5px;"> Please Sign-In and update your Password. 
        </p>
        </div>
        <div style="padding: 20px; text-align: center; background: #f4f4f4;">
          <p style="font-style: italic; color: #777; margin: 0 0 10px 0;">
            "Healthcare is the art of compassion, where every touch, every smile, and every heartbeat creates a legacy of hope and healing."
          </p>
          <p style="color: #555; margin: 0;">
            Thank you,<br/>
            Our Team - We ~ Go<br/>
            Where compassion meets innovation.
          </p>
        </div>
      </div>
    </div>
  </body>
  </html>
  `;

  // Configure the mail options
  const mailOptions = {
    from: 'rustampavri1275@gmail.com',
    to: user.email,
    subject: "Welcome to We go - Registration Successful",
    html: htmlContent,
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

// Utility function to generate a random password of given length
function generateRandomPassword(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

/**
 * Controller to register a new user
 */
export async function registerUser(req, res, next) {
  const {
    name,
    username,
    email,
    gender,
    mobile,
    dob,
    pin_code,
    street,
    city,
    state,
    country,
    role,
    specialization,
    department,
    experience,
  } = req.body;

  console.log("Received:");
  console.log(req.body);

  // Define required fields for all users
  const basicRequiredFields = { 
    name,
    username,
    email,
    mobile, // contact number
    gender,
    dob,
    pin_code,
    street,
    city,
    state,
    country,
    role,
  };

  // Gather missing basic fields (empty string, undefined, or null)
  const missingBasicFields = Object.entries(basicRequiredFields)
    .filter(([key, value]) => value === undefined || value === null || value === "")
    .map(([key]) => key);

  // If the role is Doctor, then additional fields are required.
  const missingDoctorFields = [];
  if (role === "Doctor") {
    if (!department || department === "") {
      missingDoctorFields.push("department");
    }
    if (!specialization || specialization === "") {
      missingDoctorFields.push("specialization");
    }
    if (!experience || experience === "") {
      missingDoctorFields.push("experience");
    }
  }

  const missingFields = [...missingBasicFields, ...missingDoctorFields];
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`
    });
  }

  try {
    console.log("Processing registration...");

    // Set salary based on role
    let salary;
    switch (role) {
      case "Doctor":
        salary = 100000;
        break;
      case "Front Desk Operator":
        salary = 50000;
        break;
      case "Data Entry Operator":
        salary = 30000;
        break;
      default:
        salary = 20000;
        break;
    }

    const newUser = {
      name,
      username,
      email,
      gender: gender.toLowerCase(),
      mobile,
      dob: new Date(dob).toISOString(),
      pin_code,
      street,
      city,
      state,
      country,
      role,
      specialisation: specialization,
      yoe: Number(experience),
      department,
      salary,
      password: generateRandomPassword(6),
      profile_picture: "https://example.com/profile.png",
      is_admin: false,
    };

    console.log("Registering user with transformed data:", newUser);

    const { data, error } = await supabase
      .from("users")
      .insert(newUser)
      .select("*");

    if (error) {
      throw error;
    }

    sendWelcomeEmail(data, "<Your-role>123");
    console.log("Insertion result:", data);

    res.status(201).json({ user: data });
  } catch (err) {
    next(err);
  }
}


/**
 * GET: Fetch users
 * Optional query param: ?role=doctor|patient|admin...
 */
export async function fetchUsers(req, res, next) {
  const { role } = req.query;
  console.log("role");
  console.log(role)
  try {
    let query = supabase.from('users').select('*');

    // If role is provided, filter by it
    if (role) {
      query = query.eq('role', role);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json({ users: data });
  } catch (err) {
    next(err);
  }
}


/**
 * POST: Get user by username
 * Body: { username: string }
 */
export async function fetchUser(req, res, next) {
    const { username } = req.body;
    console.log(username);
    console.log("HI");
  
    if (!username) {
      return res.status(400).json({ error: 'Username is required in the request body.' });
    }
  
    try {
        console.log("HI");
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single(); // Expecting exactly one user
  
      if (error) throw error;
  
      res.status(200).json({ user: data });
    } catch (err) {
      next(err);
    }
  }
  
// controllers/userController.js
export async function deleteUser(req, res, next) {
  const { username } = req.body;
  console.log(username);

  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'User deleted successfully', data });
  } catch (err) {
    next(err);
  }
}



export async function seedDoctor(req, res, next) {
  // Unique departments (first 9 of 10)
  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "Gynecology",
    "Dermatology",
    "Gastroenterology",
    "Pulmonology"
  ];

  // Map department to specialization
  const specializationMap = {
    "Cardiology": "Interventional Cardiology",
    "Neurology": "Neurocritical Care",
    "Orthopedics": "Joint Replacement",
    "Pediatrics": "Neonatology",
    "Oncology": "Medical Oncology",
    "Gynecology": "Reproductive Endocrinology",
    "Dermatology": "Cosmetic Dermatology",
    "Gastroenterology": "Hepatology",
    "Pulmonology": "Critical Care Pulmonology"
  };

  // Doctor seed data mapping email, username, and name.
  const doctors = [
    { email: "rustampavri1275@gmail.com", username: "rutsam", name: "rutsam" },
    { email: "charlie62042@gmail.com", username: "charlie", name: "charlie" },
    { email: "22cs01047@iitbbs.ac.in", username: "Rustam", name: "Rustam" },
    { email: "22cs01048@iitbbs.ac.in", username: "Dangi", name: "Dangi" },
    { email: "22cs01073@iitbbs.ac.in", username: "Parth", name: "Parth" },
    { email: "22cs01075@iitbbs.ac.in", username: "Utkarsh", name: "Utkarsh" },
    { email: "22cs01071@iitbbs.ac.in", username: "Sangam", name: "Sangam" },
    { email: "sangamkr.mishra@gmail.com", username: "Ssangam", name: "Ssangam" },
    { email: "hexcodesih@gmail.com", username: "hexcode", name: "hexcode" }
  ];

  // Map each doctor with additional fields so nothing is null.
  const rowsToInsert = doctors.map((doctor, index) => {
    // Select department for the doctor (based on index)
    const department = departments[index];
    // Generate sample values
    const gender = "male";
    // Generate a sample mobile number (10 digits)
    const mobile = `90000000${(index + 10).toString().padStart(2, '0')}`;
    // Generate a date of birth based on index (e.g., starting from 1975)
    const year = 1975 + index;
    const dob = new Date(year, 0, 1).toISOString();
    // Generate a sample pin code (as a string)
    const pin_code = `5600${(index + 100).toString()}`;
    // Generate a sample street address and city information
    const street = `123 Main St Apt ${index + 1}`;
    const city = "Metropolis";
    const state = "StateName";
    const country = "USA";
    // Years of experience can vary by doctor
    const yoe = 5 + index;
    // Determine specialization based on department
    const specialisation = specializationMap[department] || department;

    return {
      name: doctor.name,
      username: doctor.username,
      email: doctor.email,
      gender,
      mobile,
      dob,
      pin_code,
      street,
      city,
      state,
      country,
      role: 'doctor',
      specialisation,
      yoe,
      department,
      password: 'doctor123'
      // The fields salary, profile_picture, is_admin, created_at, and updated_at will use their defaults.
    };
  });

  try {
    // Insert doctor records using Supabase and ignore duplicates
    const { data, error } = await supabase
      .from('users')
      .insert(rowsToInsert, { ignoreDuplicates: true });

    if (error) throw error;

    res.status(200).json({ message: "Doctors seeded successfully", data });
  } catch (err) {
    console.error('Error seeding doctors:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAllUser(req,res,next){
  try {
    // Delete all rows where id > 0 (which effectively deletes all rows)
    const { data, error } = await supabase
      .from('users')
      .delete()
      .gt('id', 0);

    if (error) throw error;

    res.status(200).json({ message: 'All users deleted successfully', data });
  } catch (err) {
    next(err);
  }
}

export async function getDashboardCardsSummary(req, res, next) {
  try {
    // ----- BEDS SUMMARY -----
    // Query the rooms table and calculate totals and breakdown by room_type.
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id, room_type, total_count, occupied_count');
    if (roomsError) throw roomsError;

    const totalBeds = rooms.reduce((acc, room) => acc + room.total_count, 0);
    const occupiedBeds = rooms.reduce((acc, room) => acc + room.occupied_count, 0);
    const availableBeds = totalBeds - occupiedBeds;

    // Breakdown by room type (e.g., Executive, Premium, Basic)
    const roomBreakdown = {};
    rooms.forEach(room => {
      if (!roomBreakdown[room.room_type]) {
        roomBreakdown[room.room_type] = { total: 0, occupied: 0, available: 0 };
      }
      roomBreakdown[room.room_type].total += room.total_count;
      roomBreakdown[room.room_type].occupied += room.occupied_count;
      roomBreakdown[room.room_type].available += room.total_count - room.occupied_count;
    });

    // ----- DOCTORS SUMMARY -----
    // Query the users table filtering by role "doctor"
    const { data: doctors, error: doctorsError } = await supabase
      .from('users')
      .select('id, name, role, live_status')
      .eq('role', 'doctor');
    if (doctorsError) throw doctorsError;

    let availableDoctors = 0;
    let onLeaveDoctors = 0;
    doctors.forEach(doc => {
      // Assume doctor is available if 'live_status' is true.
      if (doc.live_status === true) {
        availableDoctors++;
      } else {
        onLeaveDoctors++;
      }
    });

    // ----- PATIENTS SUMMARY -----
    // Define time period: From one year ago until today.
    const endDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    // Query the patients table filtering by the one-year period.
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('id, created_at, gender')
      .gte('created_at', oneYearAgo.toISOString());
    if (patientsError) throw patientsError;

    // Define "new" patients as those registered within the last 30 days.
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    let newPatients = 0;
    let oldPatients = 0;
    patients.forEach(patient => {
      const createdAt = new Date(patient.created_at);
      if (createdAt >= thirtyDaysAgo) {
        newPatients++;
      } else {
        oldPatients++;
      }
    });

    // ----- PATIENT GENDER SUMMARY -----
    let maleCount = 0;
    let femaleCount = 0;
    patients.forEach(patient => {
      if (patient.gender) {
        const genderVal = patient.gender.toLowerCase().trim();
        if (genderVal === 'male') {
          maleCount++;
        } else if (genderVal === 'female') {
          femaleCount++;
        }
      }
    });
    const totalGenderCount = maleCount + femaleCount;
    const malePercentage =
      totalGenderCount > 0 ? ((maleCount / totalGenderCount) * 100).toFixed(0) : "0";
    const femalePercentage =
      totalGenderCount > 0 ? ((femaleCount / totalGenderCount) * 100).toFixed(0) : "0";

    // ----- DAILY PATIENT FLOW -----
    // Query the admissions table to count today's admissions and discharges.
    const { data: admissions, error: admissionsError } = await supabase
      .from('admissions')
      .select('admission_date, discharge_date');
    if (admissionsError) throw admissionsError;

    const todayStr = new Date().toISOString().slice(0, 10); // format: YYYY-MM-DD
    let dailyAdmissions = 0;
    let dailyDischarges = 0;

    admissions.forEach(record => {
      if (record.admission_date) {
        const admissionDate = new Date(record.admission_date)
          .toISOString()
          .slice(0, 10);
        if (admissionDate === todayStr) {
          dailyAdmissions++;
        }
      }
      if (record.discharge_date) {
        const dischargeDate = new Date(record.discharge_date)
          .toISOString()
          .slice(0, 10);
        if (dischargeDate === todayStr) {
          dailyDischarges++;
        }
      }
    });

    // ----- COMPOSE THE FINAL RESPONSE -----
    // Include a dateRange object to return the one-year span.
    const dashboardSummary = {
      dateRange: {
        startDate: oneYearAgo.toISOString(),
        endDate: endDate.toISOString()
      },
      beds: {
        totalBeds,
        occupiedBeds,
        availableBeds,
        breakdown: roomBreakdown,
      },
      doctors: {
        available: availableDoctors,
        onLeave: onLeaveDoctors,
      },
      patients: {
        newPatients,
        oldPatients,
        gender: {
          maleCount,
          femaleCount,
          malePercentage,
          femalePercentage,
        },
      },
      dailyFlow: {
        admissions: dailyAdmissions,
        discharges: dailyDischarges,
      },
    };

    res.status(200).json(dashboardSummary);
  } catch (err) {
    next(err);
  }
}


export async function getPatientsOverviewData(req, res, next) {
  try {
    // Calculate the current month's boundaries
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

    // --- 1. Fetch Admissions in current month ---
    const { data: admissions, error: admError } = await supabase
      .from("admissions")
      .select("id, admission_date, discharge_date")
      .gte("admission_date", startOfMonth)
      .lte("admission_date", endOfMonth);
    if (admError) throw admError;

    // --- 2. Fetch Appointments in current month ---
    const { data: appointments, error: appError } = await supabase
      .from("appointments")
      .select("id, appointment_date")
      .gte("appointment_date", startOfMonth)
      .lte("appointment_date", endOfMonth);
    if (appError) throw appError;

    // --- 3. Fetch Rooms ---
    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("room_type, total_count");
    if (roomsError) throw roomsError;

    // --- A. Aggregate Room Stats ---
    // Map room types to the UI labels: Executive, Premium, Emergency (from "General")
    const roomStats = { Executive: 0, Premium: 0, Emergency: 0 };
    rooms.forEach((room) => {
      const type = room.room_type.toLowerCase();
      if (type === "executive") {
        roomStats.Executive += room.total_count;
      } else if (type === "premium") {
        roomStats.Premium += room.total_count;
      } else if (type === "general") {
        roomStats.Emergency += room.total_count;
      }
    });

    // --- B. Get Total Appointments Count ---
    const appointmentsTotal = appointments.length;

    // --- C. Prepare Chart Data ---
    // Define date intervals (here: 01-07, 08-12, 13-17, 18-21)
    const intervals = [
      { label: "01-07", start: 1, end: 7 },
      { label: "08-12", start: 8, end: 12 },
      { label: "13-17", start: 13, end: 17 },
      { label: "18-21", start: 18, end: 21 },
      { label: "22-25", start: 18, end: 21 },
      { label: "26-29", start: 18, end: 21 },
      { label: "29-30", start: 18, end: 21 }
      // You can add more intervals if needed.
    ];

    // Initialize an array for the chart data
    const chartData = intervals.map((interval) => ({
      date: interval.label,
      new: 0,         // count of admissions
      discharge: 0,   // count of discharges (where discharge_date exists)
      appointments: 0
    }));

    // Group Admissions into intervals:
    admissions.forEach((adm) => {
      // For new admissions, use the admission_date field:
      if (adm.admission_date) {
        const admDate = new Date(adm.admission_date);
        const day = admDate.getUTCDate();
        const foundInterval = intervals.find(
          (i) => day >= i.start && day <= i.end
        );
        if (foundInterval) {
          const idx = intervals.indexOf(foundInterval);
          chartData[idx].new += 1;
        }
      }
      // For discharges, check if discharge_date exists:
      if (adm.discharge_date) {
        const disDate = new Date(adm.discharge_date);
        const day = disDate.getUTCDate();
        const foundInterval = intervals.find(
          (i) => day >= i.start && day <= i.end
        );
        if (foundInterval) {
          const idx = intervals.indexOf(foundInterval);
          chartData[idx].discharge += 1;
        }
      }
    });

    // Group Appointments into intervals:
    appointments.forEach((app) => {
      if (app.appointment_date) {
        const appDate = new Date(app.appointment_date);
        const day = appDate.getUTCDate();
        const foundInterval = intervals.find(
          (i) => day >= i.start && day <= i.end
        );
        if (foundInterval) {
          const idx = intervals.indexOf(foundInterval);
          chartData[idx].appointments += 1;
        }
      }
    });

    // --- Compose the Response ---
    const response = {
      rooms: roomStats,
      appointmentsTotal,
      chartData
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}