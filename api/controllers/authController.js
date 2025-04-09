
// import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import crypto from 'crypto';
import nodemailer from "nodemailer";

import { errorHandler } from "./../utilis/error.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';



dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://tvgasdupkqffhvqzurwy.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_KEY) {
  throw new Error('SUPABASE_KEY is not defined in your environment variables.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let otpStore = {};
let otpStore1 = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'rustampavri1275@gmail.com',
    pass: 'djyh phga iwhf nkyr', // Note: Move to environment variables
  },
});

export const sendOtp=async(req,res,next)=>{
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  otpStore[email] = otp;

  const mailOptions = {
    from: 'rustampavri1275@gmail.com',
    to: email,
    subject: 'OTP for Sign-In - We ~ Go',
    text: "We ~ Go - Where compassion meets innovation.",
    html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Light background for the email body */
            padding: 20px;
        }
        .otp-box {
            background-color: #adeaf0; /* Box background */
            color: darkgreen; /* Text color */
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 0 auto;
            max-width: 400px; /* Max width for the box */
        }
        .otp-input {
            font-size: 24px;
            padding: 10px;
            border: 2px solid darkgreen; /* Input border color */
            border-radius: 5px;
            margin: 10px 0;
            width: 80%; /* Adjust width as needed */
        }
        .thank-you {
            margin-top: 20px;
            text-align: center;
        }
        .thank-you p {
            margin: 5px 0;
        }
    </style>
</head>
<body>

    <div class="otp-box">
        <h2>Your OTP is <strong>${otp}</strong></h2>
        <p>Please use this OTP to sign-In to We ~ Go.</p>
    </div>

    <div class="thank-you">
        <p>Where compassion meets innovation.</p>
        <p>Healthcare is the art of compassion, where every touch, every smile, and every heartbeat creates a legacy of hope and healing.</p>
        <p>Team We ~ Go </p>
    </div>

</body>
</html>
`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }

}
export const sendOtp1=async(req,res,next)=>{
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  otpStore1[email] = otp;

  const mailOptions = {
    from: 'rustampavri1275@gmail.com',
    to: email,
    subject: "Password Reset",
    text: "Swap-simple",
    html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4; /* Light background for the email body */
            padding: 20px;
        }
        .otp-box {
            background-color: black; /* Box background */
            color: darkgreen; /* Text color */
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 0 auto;
            max-width: 400px; /* Max width for the box */
        }
        .otp-input {
            font-size: 24px;
            padding: 10px;
            border: 2px solid darkgreen; /* Input border color */
            border-radius: 5px;
            margin: 10px 0;
            width: 80%; /* Adjust width as needed */
        }
        .thank-you {
            margin-top: 20px;
            text-align: center;
        }
        .thank-you p {
            margin: 5px 0;
        }
    </style>
</head>
<body>

    <div class="otp-box">
        <h2>Your OTP is <strong>${otp}</strong></h2>
        <p>Please use this to reset your password.</p>
    </div>

    <div class="thank-you">
        <p>❤️ Thank you for using our service! ❤️</p>
        <p>Rustam & Sangam</p>
    </div>

</body>
</html>
`
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error });
  }

}

export const verifyOtp=async(req,res,next)=>{
  console.log("Debuging verify otp");
  console.log(req.body);
  // console.log(otpStore[email])
  const { email, otp } = req.body;
  console.log(otpStore[email])
  if (otpStore[email] && otpStore[email] === parseInt(otp, 10)) {
    delete otpStore[email]; // Clear OTP after successful verification
    return res.status(200).json({ message: 'OTP verified' });
  }
  res.status(400).json({ message: 'Invalid OTP' });
}
export const verifyOtp1 = async (req, res) => {
  const { email, otp, password } = req.body;
  // console.log("HII");
  // console.log("HII");
  // console.log(email);
  // console.log(otp);
  // console.log(password);
  if (!email || !otp || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Check if OTP is correct
    if (otpStore1[email] && otpStore1[email] === parseInt(otp, 10)) {
      // Hash the new password
      const hashedPassword = bcryptjs.hashSync(password, 10);

      // Update the user's password
      const updatedUser = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Clear OTP after successful verification
      delete otpStore[email];

      // Proceed with logging in the user (like in signin)
      const token = jwt.sign(
        { id: updatedUser._id, isAdmin: updatedUser.isAdmin },
        process.env.JWT_SECRET
      );

      const { password: pass, ...rest } = updatedUser._doc;

      // Send response with JWT token and user details
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);

    } else {
      // Invalid OTP
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
};


export const signup = async (req, res, next) => {
  // console.log("Rustam Signup");
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup Successfull");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  console.log(req.body);
  const { username,role,email, password } = req.body;

  console.log(email);
  console.log(password);
  if (!email || !password || email.trim() === "" || password.trim() === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single(); // Expecting exactly one user

    console.log(data);
    
    if (error || !data) {
      return next(errorHandler(404, "User not found"));
    }
    console.log(data);

    // If passwords are hashed, use bcryptjs.compareSync(password, data.password)
    if (data.password !== password||data.role!==role||data.username!==username) {
      return next(errorHandler(404, "User not found"));
    }

    const token = jwt.sign(
      { id: data.id, isAdmin: data.is_admin },
      process.env.JWT_SECRET
    );

    // Remove password from user data before sending response
    const { password: removed, ...rest } = data;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};


export const google = async (req, res, next) => {
  const { email, name, googlPhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET
      );

      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatedPassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPassword=bcryptjs.hashSync(generatedPassword,10);
      const newUser=new User({
        username:name.toLowerCase().split(' ').join('')+Math.random().toString(9).slice(-4),
        email,
        password:hashedPassword,
        profilePicture:googlPhotoUrl,
      });
      await newUser.save();
      const token=jwt.sign({id:newUser._id,isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
      const {password,...rest}=newUser._doc;
      res.status(200).cookie('access_token',token,{
        httpOnly:true,
      }).json(rest);
    }
  } catch (error) {
    next(error);
  }
};