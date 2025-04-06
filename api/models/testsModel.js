import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "Tests" table if it doesn't exist.
 * Table includes columns for patient_id, test_type, test_result, test_date, and doctor_username.
 */
export async function createTestsTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Tests (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        test_type TEXT NOT NULL,
        test_result TEXT NOT NULL,
        test_date TIMESTAMPTZ NOT NULL,
        doctor_username TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Tests table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating Tests table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
