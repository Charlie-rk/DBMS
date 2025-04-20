

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createActivity } from './userController.js';

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
  const { deo,patientId, testType, testResult, testDate, doctorUsername } = req.body;
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
    await createActivity(deo, `Test data entered successfully for Patient ID: ${patientId}, prescribed by ${doctorUsername}.`);
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
  const {deo, patientId, dosage,drug,treatmentDate, prescribedBy, remarks } = req.body;

  if (!patientId || !dosage || !treatmentDate || !prescribedBy) {
    return res.status(400).json({ error: 'patientId, dosage, treatmentDate, and prescribedBy are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('treatments')
      .insert([{
        patient_id: patientId,
        dosage,
        drug,
        treatment_date: treatmentDate,
        prescribed_by: prescribedBy,
        remarks
      }])
      .select();

    if (error) throw error;
    await createActivity(deo, `Treatment data entered for Patient ID: ${patientId}. prescribed by ${prescribedBy}  }`);

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
  const {deo, patientId,title,reportLink } = req.body;
  // console.log(reportLink);
  console.log(req.body);


  if (!patientId || !reportLink) {
    return res.status(400).json({ error: 'patientId and reportLink are required.' });
  }

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{
        title,
        patient_id: patientId,
        report_link: reportLink
      }])
      .select();

    if (error) throw error;
   await createActivity(deo, `Report uploaded for Patient ID: ${patientId}.}`);
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

/**
 * Get entry counts
 * Route: GET /deo/entry-counts
 */
export async function getEntryCounts(req, res, next) {
  try {
    // fire all three count‐queries in parallel
    const [testsRes, treatmentsRes, reportsRes] = await Promise.all([
      supabase
        .from('tests')
        .select('*', { head: true, count: 'exact' }),
      supabase
        .from('treatments')
        .select('*', { head: true, count: 'exact' }),
      supabase
        .from('reports')
        .select('*', { head: true, count: 'exact' }),
    ]);

    // check for errors on each
    if (testsRes.error) throw testsRes.error;
    if (treatmentsRes.error) throw treatmentsRes.error;
    if (reportsRes.error) throw reportsRes.error;

    // return the three counts
    res.status(200).json({
      testsCount: testsRes.count,
      treatmentsCount: treatmentsRes.count,
      reportsCount: reportsRes.count,
    });
  } catch (err) {
    next(err);
  }
}
