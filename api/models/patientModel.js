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
        visit_no INT DEFAULT 1,
        name VARCHAR(30) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        address VARCHAR(255) NOT NULL,
        gender VARCHAR(10),
        age INT,
        dob TIMESTAMP,
        status VARCHAR(20),
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
