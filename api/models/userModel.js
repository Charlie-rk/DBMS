// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     // required:true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   profilePicture: {
//     type: String,
//     default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
//   },
//   isAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   notifications: [
//     {
//       message: {
//         type: String,
//         required: true,
//       },
//       subject: {
//         type: String,
//         default: "Notification"
//         // required: true,
//       },
//       takeResponse: {
//         type: Boolean,
//         default: false
//       },
//       active: {
//         type: Boolean,
//         default: true
//       },
//       createdAt: {
//         type: Date,
//         default: Date.now,
//       },
//       seen: {
//         type: Boolean,
//         default: false,
//       },
//       ownTravelId: {
//         type: String
//       },
//       otherTravelId: {
//         type: String
//       }
//     },
//   ],
// }, { timestamps: true }
// );

// const User = mongoose.model('User', userSchema);
// export default User;

import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "users" table if it doesn't exist.
 * Call this ONCE on server start.
 */
export async function createUserTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30),
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        gender VARCHAR(10),
        mobile VARCHAR(10),
        dob TIMESTAMP,
        pin_code VARCHAR(8),
        street VARCHAR(50),
        city VARCHAR(50),
        state VARCHAR(50),
        country VARCHAR(50),
        role VARCHAR(50),
        specialisation VARCHAR(50),
        yoe INT,
        department VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255) DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating user table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
