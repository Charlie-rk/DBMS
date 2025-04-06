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
    experience
  } = req.body;

  console.log("Received:");
  console.log(req.body);

  try {
    console.log("Processing registration...");

    // Set salary based on role
    let salary;
    switch (role) {
      case 'Doctor':
        salary = 100000;
        break;
      case 'Front Desk Operator':
        salary = 50000;
        break;
      case 'Data Entry Operator':
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
      is_admin: false
    };

    console.log("Registering user with transformed data:", newUser);
    sendWelcomeEmail(newUser, "Secret123");

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select('*');

    if (error) {
      throw error;
    }

    sendWelcomeEmail(data, "Secret123");
    console.log("Insertion result:", data);
    res.status(201).json({ user: data });
  } catch (err) {
    next(err);
  }
}

/**
 * Controller to register a new user
 */
export async function registerUserf(req, res, next) {
  // Destructure all required fields from the request body including role.
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
    experience
  } = req.body;
  
  console.log("Received:");
  console.log(req.body);
  // return;
  try {
    console.log("Processing registration...");

    const newUser = {
      name,
      username,
      email,
      // Standardize gender to lowercase
      gender: gender.toLowerCase(),
      mobile,
      // Convert to ISO format
      dob: new Date(dob).toISOString(),
      pin_code,
      street,
      city,
      state,
      country,
      role,
      // Rename 'specialization' to 'specialisation' per your schema
      specialisation: specialization,
      // Convert experience to number for yoe (years of experience)
      yoe: Number(experience),
      department,
      password: generateRandomPassword(6), // generate a random 6-character password
      profile_picture: "https://example.com/profile.png", // default profile picture
      is_admin: false
    };
    
    console.log("Registering user with transformed data:", newUser);
    sendWelcomeEmail(newUser,"Secret123");
    // Insert new user data into the 'users' table and select all fields to be returned
    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select('*'); // This returns the inserted row

    if (error) {
      throw error;
    }
    sendWelcomeEmail(data,"Secret123");
    console.log("Insertion result:", data);
    res.status(201).json({ user: data });
  } catch (err) {
    next(err);
  }
}


/**
 * Controller to register a new user
 */
export async function registerUserdfdx(req, res, next) {
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
    experience
  } = req.body;

  console.log("Received:");
  console.log(req.body);

  try {
    console.log("Processing registration...");

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
      password: generateRandomPassword(6),
      profile_picture: "https://example.com/profile.png",
      is_admin: role === 'Admin'
    };

    // Set salary based on role
    switch (role) {
      case 'Doctor':
        salary = 100000;
        break;
      case 'Front Desk Operator':
        salary = 50000;
        break;
      case 'Data Entry Operator':
        salary = 30000;
        break;
      default:
        salary = 20000;
        break;
    }

    console.log("Registering user with transformed data:", newUser);

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select('*');

    if (error) {
      throw error;
    }

    sendWelcomeEmail(data[0], "Secret123");

    console.log("Insertion result:", data);
    res.status(201).json({ user: data[0] });
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
