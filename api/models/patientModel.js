import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "patients" table if it doesn't exist.
 * Call this ONCE on server start.
 */
export async function createPatientTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS patients (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        gender VARCHAR(10),
        dob TIMESTAMP,
        pin_code VARCHAR(8),
        street VARCHAR(50),
        city VARCHAR(50),
        state_country VARCHAR(50),
        role VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Patient table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating patient table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
