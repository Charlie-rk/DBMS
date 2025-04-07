import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "Treatments" table if it doesn't exist.
 * Table includes columns for patient_id, dosage, treatment_date, prescribed_by, and remarks.
 */
export async function createTreatmentsTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Treatments (
        id SERIAL PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        dosage TEXT NOT NULL,
        drug TEXT NOT NULL,
        treatment_date TIMESTAMPTZ NOT NULL,
        prescribed_by TEXT NOT NULL,
        remarks TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Treatments table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating Treatments table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
