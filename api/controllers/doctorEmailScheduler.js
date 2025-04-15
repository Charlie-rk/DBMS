import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cron from 'node-cron';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in your environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false,
  auth: {
    user: 'rustampavri1275@gmail.com',
    pass: 'djyh phga iwhf nkyr', // Use environment variables for security.
  },
});

/**
 * This function sends update emails to doctors.
 * It first finds all accepted appointments for a doctor.
 * Then from those appointments, it fetches patients whose status in the patients table is considered active (for example, "admitted").
 * Finally, it builds a detailed summary including structured treatment and test details, and sends an email.
 */
async function sendDoctorWeeklyUpdates() {
  try {
    // 1. Fetch all doctors.
    const { data: doctors, error: doctorError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'doctor');
    if (doctorError) throw doctorError;

    if (!doctors || doctors.length === 0) {
      console.log('No doctor found to send updates.');
      return;
    }

    // Loop through each doctor.
    for (const doctor of doctors) {
      // 2. Fetch only the accepted appointments for this doctor.
      const { data: appointments, error: appointmentError } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctor.id)
        .eq('status', 'accepted');
      if (appointmentError) {
        console.error(`Error fetching appointments for Dr. ${doctor.name}:`, appointmentError);
        continue;
      }

      if (!appointments || appointments.length === 0) {
        console.log(`No accepted appointments for Dr. ${doctor.name}.`);
        continue;
      }

      // 3. Get unique patient IDs from these appointments.
      const patientIds = [...new Set(appointments.map(app => app.patient_id))];

       // 4. Fetch basic patient details (id, name, status) but only for those admitted.
       const { data: patients, error: patientError } = await supabase
       .from('patients')
       .select('id, name, status')
       .in('id', patientIds);
       // .eq('status', 'admitted'); // Only consider patients that are currently admitted.
     if (patientError) {
       console.error("Error fetching patients for Dr. ${doctor.name}:", patientError);
       continue;
     }

      // Build a lookup map for admitted patients.
      const patientMap = {};
      patients.forEach(patient => {
        patientMap[patient.id] = patient;
      });

      // 5. Filter appointments to only those with an admitted patient.
      const validAppointments = appointments.filter(app => patientMap[app.patient_id]);
      if (validAppointments.length === 0) {
        console.log(`No appointments for admitted patients for Dr. ${doctor.name}.`);
        continue;
      }

      // 6. Fetch treatments for all these patients.
      const { data: treatments, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .in('patient_id', patientIds);
      if (treatmentsError) {
        console.error(`Error fetching treatments for Dr. ${doctor.name}:`, treatmentsError);
        continue;
      }
      const treatmentsMap = {};
      treatments?.forEach(t => {
        if (!treatmentsMap[t.patient_id]) {
          treatmentsMap[t.patient_id] = [];
        }
        treatmentsMap[t.patient_id].push(t);
      });

      // 7. Fetch tests for all these patients.
      const { data: tests, error: testsError } = await supabase
        .from('tests')
        .select('*')
        .in('patient_id', patientIds);
      if (testsError) {
        console.error(`Error fetching tests for Dr. ${doctor.name}:`, testsError);
        continue;
      }
      const testsMap = {};
      tests?.forEach(t => {
        if (!testsMap[t.patient_id]) {
          testsMap[t.patient_id] = [];
        }
        testsMap[t.patient_id].push(t);
      });

      // 8. Build the email content with HTML formatting
      let emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            background-color: #4A90E2;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
          }
          .container {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
          }
          .patient-card {
            background-color: #f9f9f9;
            border-left: 4px solid #4A90E2;
            padding: 15px;
            margin-bottom: 20px;
          }
          .section-title {
            background-color: #eef5ff;
            padding: 8px 15px;
            margin-top: 15px;
            margin-bottom: 10px;
            border-left: 3px solid #4A90E2;
            font-weight: bold;
          }
          .treatment-item, .test-item {
            border-bottom: 1px solid #eee;
            padding: 8px 0;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #777;
            text-align: center;
          }
          .icon {
            margin-right: 5px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>WE ~ GO Hospital</h2>
          <p>"Where Compassion Meets Innovation"</p>
        </div>
        <div class="container">
          <h3>Weekly Patient Updates</h3>
          <p>Hello Dr. ${doctor.name},</p>
          <p>Here is your weekly summary of admitted patients with accepted appointments:</p>
      `;

      validAppointments.forEach(app => {
        const patient = patientMap[app.patient_id] || { id: 'N/A', name: 'Unknown' };
        const reason = app.reason || 'N/A';

        // Build a structured treatment summary.
        const patientTreatments = treatmentsMap[app.patient_id] || [];
        let treatmentContent = '<p>No treatment records available.</p>';
        if (patientTreatments.length) {
          treatmentContent = patientTreatments.map(t => {
            // Format the treatment date.
            const treatmentDate = new Date(t.treatment_date).toLocaleDateString();
            return `
              <div class="treatment-item">
                <span class="icon">💊</span> <strong>Drug:</strong> ${t.drug}<br>
                <strong>Dosage:</strong> ${t.dosage}<br>
                <strong>Date:</strong> ${treatmentDate}<br>
                <strong>Prescribed by:</strong> ${t.prescribed_by}<br>
                <strong>Remarks:</strong> ${t.remarks || 'N/A'}
              </div>
            `;
          }).join('');
        }

        // Build a structured test summary.
        const patientTests = testsMap[app.patient_id] || [];
        let testContent = '<p>No test records available.</p>';
        if (patientTests.length) {
          testContent = patientTests.map(t => {
            const testDate = new Date(t.test_date).toLocaleDateString();
            return `
              <div class="test-item">
                <span class="icon">🔬</span> <strong>Test Type:</strong> ${t.test_type}<br>
                <strong>Result:</strong> ${t.test_result}<br>
                <strong>Date:</strong> ${testDate}<br>
                <strong>Doctor:</strong> ${t.doctor_username}
              </div>
            `;
          }).join('');
        }

        emailBody += `
          <div class="patient-card">
            <h4><span class="icon">👤</span> Patient: ${patient.name} (ID: ${patient.id})</h4>
            <p><strong>Reason for Visit:</strong> ${reason}</p>
            
            <div class="section-title"><span class="icon">📋</span> Treatment Summary</div>
            ${treatmentContent}
            
            <div class="section-title"><span class="icon">📊</span> Test Results</div>
            ${testContent}
          </div>
        `;
      });

      emailBody += `
          <p>Please review these updates and contact us if you have any questions.</p>
          <p>Best regards,<br>WE ~ GO Hospital Management Team</p>
          
          <div class="footer">
            <p>WE ~ GO Hospital Management System<br>
            "Where Compassion Meets Innovation"<br>
            © ${new Date().getFullYear()} WE ~ GO. All rights reserved.</p>
            <p>This email is automatically generated and contains confidential patient information. 
            If you received this in error, please delete immediately and notify our IT department.</p>
          </div>
        </div>
      </body>
      </html>
      `;

      // 9. Send the email.
      const mailOptions = {
        from: 'rustampavri1275@gmail.com', // Update accordingly.
        to: doctor.email, // Assumes the doctor record includes an 'email' field.
        subject: 'WE ~ GO Hospital: Weekly Patient Updates',
        html: emailBody
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email to Dr. ${doctor.name}:`, error);
        } else {
          console.log(`Email sent to Dr. ${doctor.name}:`, info.response);
        }
      });
    }
  } catch (err) {
    console.error('Error in sendDoctorWeeklyUpdates:', err);
  }
}

// // Schedule the debug task to run every minute (for testing).
// cron.schedule('*/1 * * * *', () => {
//   console.log('Cron job triggered: sending doctor update emails (debug mode)...');
//   sendDoctorWeeklyUpdates();
// });
// Schedule the weekly task.
// The cron expression below schedules the task to run every Monday at 09:00 AM.
// Adjust the cron expression if you need a different schedule.

// Export the function for manual triggering if needed.
export { sendDoctorWeeklyUpdates };
