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
