import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { errorHandler } from '../utilis/error.js'; 
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


export async function createActivity(username, description) {
    if (!username) {
      throw new Error('Username is required');
    }
    if (!description) {
      throw new Error('Description is required');
    }
   console.log("creating activity");
   console.log(username);
   console.log(description);
    try {
      const { data, error } = await supabase
        .from('activity')
        .insert([{ username, description }]);
  
      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }
  export async function updateUser(req, res, next) {
    // Ensure that the authenticated user is updating their own account
    console.log("updating");
    console.log(req.user.id);
    console.log(req.params.userId);
    console.log(typeof req.user.id);
    console.log(typeof req.params.userId);
    console.log(req.body);
  
    if (!req.user) {
      return next(errorHandler(403, 'Unauthorized'));
    }
    if (String(req.user.id) !== String(req.params.userId)) {
      return next(errorHandler(403, 'You are not allowed to update this user'));
    }
  
    // Prepare the update object
    const updateData = {};
  
    // Validate and update the password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
      }
      updateData.password = req.body.password;
    }
  
    // Update email if provided
    if (req.body.email) {
      updateData.email = req.body.email;
    }
  
    // Update profile picture URL if provided
    if (req.body.profilePicture) {
      updateData.profile_picture = req.body.profilePicture;
    }
    console.log(updateData);
  
    try {
      // Use Supabase's update syntax and chain .select() to return the updated row
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', req.params.userId)
        .select();
  
      console.log("data", data);
      console.log("error", error);
      if (error) {
        return next(errorHandler(500, error.message));
      }
  
      // Remove the password field before sending the response
      const updatedUser = data[0];
      delete updatedUser.password;
      console.log("done");
  
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }
  

  export const signout = (req, res, next) => {
    try {
      res
        .clearCookie('access_token')
        .status(200)
        .json('User has been signed out');
    } catch (error) {
      next(error);
    }
  };

  export const getUserProfile = async (req, res, next) => {
    const { username } = req.params;
  
    try {
      // Use Supabase to select all fields and filter by the username parameter
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username);
  
      // Log data and error for debugging purposes
      console.log("data", data);
      console.log("error", error);
  
      if (error) {
        return next(errorHandler(500, error.message));
      }
  
      if (!data || data.length === 0) {
        return next(errorHandler(404, 'User not found'));
      }
  
      // Remove the password field before sending the response
      const userProfile = { ...data[0] };
      delete userProfile.password;
  
      console.log("done");
  
      res.status(200).json(userProfile);
    } catch (err) {
      next(err);
    }
  };
  