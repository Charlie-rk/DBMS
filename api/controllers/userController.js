import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * GET: Fetch users
 * Optional query param: ?role=doctor|patient|admin...
 */
export async function fetchUsers(req, res, next) {
  const { role } = req.query;

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
  