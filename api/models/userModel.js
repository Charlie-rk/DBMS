

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
        live_status BOOLEAN DEFAULT TRUE,
        yoe INT,
        department VARCHAR(50),
        salary INT DEFAULT 100000,
        password VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255) DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        is_admin BOOLEAN DEFAULT false,
        live_status bool DEFAULT true,
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
