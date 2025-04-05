import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
   process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "admissions" table if it doesn't exist.
 * This table links a patient with a room along with admission and discharge details.
*/
export async function createAdmissionTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });
  
  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admissions (
        id SERIAL PRIMARY KEY,
        patient_id INT NOT NULL,
        room_id INT NOT NULL,
        admission_date TIMESTAMPTZ NOT NULL,
        discharge_date TIMESTAMPTZ,
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_patient
          FOREIGN KEY(patient_id)
            REFERENCES patients(id)
            ON DELETE CASCADE,
        CONSTRAINT fk_room
          FOREIGN KEY(room_id)
            REFERENCES rooms(id)
            ON DELETE CASCADE
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Admissions table created or already exists.');
  } catch (error) {
    console.error('❌ Error creating admissions table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
