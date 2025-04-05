import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in your environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Controller to register a new user
 */
export async function registerUser(req, res, next) {
    const userData = req.body; // Assumes user data is sent in the request body
  try {
    console.log('hi');
    console.log(req.body);
    // Insert new user data into the 'users' table
    const { data, error } = await supabase
      .from('users')
      .insert(userData);
    console.log("hii2");
    console.log(data);

    const new_data = await supabase.from('users').select('*').eq('username', userData.username);
    console.log(new_data);
    if (error) {
      throw error;
    }
    console.log(data);
    res.status(201).json({ user: new_data });
  } catch (err) {
    next(err);
  }
}
