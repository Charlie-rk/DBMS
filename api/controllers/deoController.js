// import { createClient } from '@supabase/supabase-js';
// import dotenv from 'dotenv';

// dotenv.config();

// const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
// const SUPABASE_KEY = process.env.SUPABASE_KEY;
// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// /**
//  * Test Data Entry
//  * Route: /deo/test-entry
//  * Input (from req.body): 
//  *   - patientId
//  *   - testType
//  *   - testResult
//  *   - testDate
//  *   - doctorUsername
//  */
// export async function testEntry(req, res, next) {
//   const { patientId, testType, testResult, testDate, doctorUsername } = req.body;
  
//   if (!patientId || !testType || !testResult || !testDate || !doctorUsername) {
//     return res.status(400).json({ error: 'All fields are required.' });
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('Tests')
//       .insert([
//         {
//           patient_id: patientId,
//           test_type: testType,
//           test_result: testResult,
//           test_date: testDate,
//           doctor_username: doctorUsername
//         }
//       ]);
    
//     if (error) throw error;
    
//     res.status(200).json({ message: 'Test data entered successfully.', data });
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * Treatment Entry
//  * Route: /deo/treatment-entry
//  * Input (from req.body): 
//  *   - patientId
//  *   - dosage
//  *   - treatmentDate
//  *   - prescribedBy
//  *   - remarks
//  */
// export async function treatmentEntry(req, res, next) {
//   const { patientId, dosage, treatmentDate, prescribedBy, remarks } = req.body;
  
//   if (!patientId || !dosage || !treatmentDate || !prescribedBy) {
//     return res.status(400).json({ error: 'patientId, dosage, treatmentDate, and prescribedBy are required.' });
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('Treatments')
//       .insert([
//         {
//           patient_id: patientId,
//           dosage,
//           treatment_date: treatmentDate,
//           prescribed_by: prescribedBy,
//           remarks
//         }
//       ]);
    
//     if (error) throw error;
    
//     res.status(200).json({ message: 'Treatment data entered successfully.', data });
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * Upload Report
//  * Route: /deo/upload-report
//  * Input (from req.body):
//  *   - patientId
//  *   - reportLink (URL to PDF)
//  */
// export async function uploadReport(req, res, next) {
//   const { patientId, reportLink } = req.body;
  
//   if (!patientId || !reportLink) {
//     return res.status(400).json({ error: 'patientId and reportLink are required.' });
//   }
  
//   try {
//     const { data, error } = await supabase
//       .from('Reports')
//       .insert([
//         {
//           patient_id: patientId,
//           report_link: reportLink
//         }
//       ]);
    
//     if (error) throw error;
    
//     res.status(200).json({ message: 'Report uploaded successfully.', data });
//   } catch (err) {
//     next(err);
//   }
// }

// /**
//  * View Reports
//  * Route: /deo/reports
//  * Retrieves all report records.
//  */
// export async function viewReports(req, res, next) {
//   try {
//     const { data, error } = await supabase
//       .from('Reports')
//       .select('*');
    
//     if (error) throw error;
    
//     res.status(200).json({ reports: data });
//   } catch (err) {
//     next(err);
//   }
// }

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Test Data Entry
 * Route: /deo/test-entry
 * Input (from req.body): 
 *   - patientId
 *   - testType
 *   - testResult
 *   - testDate
 *   - doctorUsername
 */
export async function testEntry(req, res, next) {
  const { patientId, testType, testResult, testDate, doctorUsername } = req.body;
  console.log("test-entry");
  console.log(patientId);
  console.log(testType);
  console.log(testResult);
  console.log(testDate);
  console.log(doctorUsername);

  if (!patientId || !testType || !testResult || !testDate || !doctorUsername) {
    return res.status(400).json({ error: 'patientId, testType, testResult, testDate, and doctorUsername are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('tests')
      .insert([{
        patient_id: patientId,
        test_type: testType,
        test_result: testResult,
        test_date: testDate,
        doctor_username: doctorUsername
      }])
      .select('*'); // Returns the inserted record(s)

      console.log("data",data)
      console.log("error",error);

    if (error) throw error;

    res.status(200).json({ message: 'Test data entered successfully.', data });
  } catch (err) {
    next(err);
  }
}

/**
 * Treatment Entry
 * Route: /deo/treatment-entry
 * Input (from req.body):
 *   - patientId
 *   - dosage
 *   - treatmentDate
 *   - prescribedBy
 *   - remarks
 */
export async function treatmentEntry(req, res, next) {
  const { patientId, dosage, treatmentDate, prescribedBy, remarks } = req.body;

  if (!patientId || !dosage || !treatmentDate || !prescribedBy) {
    return res.status(400).json({ error: 'patientId, dosage, treatmentDate, and prescribedBy are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('treatments')
      .insert([{
        patient_id: patientId,
        dosage,
        treatment_date: treatmentDate,
        prescribed_by: prescribedBy,
        remarks
      }])
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Treatment data entered successfully.', data });
  } catch (err) {
    next(err);
  }
}

/**
 * Upload Report
 * Route: /deo/upload-report
 * Input (from req.body):
 *   - patientId
 *   - reportLink (URL to PDF)
 */
export async function uploadReport(req, res, next) {
  const { patientId, reportLink } = req.body;

  if (!patientId || !reportLink) {
    return res.status(400).json({ error: 'patientId and reportLink are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        patient_id: patientId,
        report_link: reportLink
      }])
      .select();

    if (error) throw error;

    res.status(200).json({ message: 'Report uploaded successfully.', data });
  } catch (err) {
    next(err);
  }
}

/**
 * View Reports
 * Route: /deo/reports
 * Retrieves all report records.
 */
export async function viewReports(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*');

    if (error) throw error;

    res.status(200).json({ reports: data });
  } catch (err) {
    next(err);
  }
}
