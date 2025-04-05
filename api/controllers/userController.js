import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchRecentActivitiesOfUser(req, res, next) {
  const { username, limit } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required in the request body (e.g., { "username": "example" })' });
  }

  // Check if limit is already a number, otherwise parse it. Default to 10 if not provided.
  const k = typeof limit === 'number' ? limit : limit ? parseInt(limit, 10) : 10;

  try {
    const { data, error } = await supabase
      .from('activity')
      .select('*')
      .eq('username', username)
      .order('created_at', { ascending: false })
      .limit(k);

    if (error) throw error;

    res.status(200).json({ activities: data });
  } catch (err) {
    next(err);
  }
}
