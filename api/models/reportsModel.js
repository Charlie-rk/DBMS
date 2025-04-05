import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "Reports" table if it doesn't exist.
 * Table includes columns for patient_id and report_link.
 */
export async function createReportsTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Reports (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        report_link TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Reports table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating Reports table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
