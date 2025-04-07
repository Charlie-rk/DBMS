import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "appointments" table if it doesn't exist.
 * Call this ONCE on server start.
 */
export async function createAppointmentTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();

    // 1. Create enum type if it doesn't exist
    const createEnumTypeQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
          CREATE TYPE appointment_status AS ENUM ('accepted', 'declined', 'pending');
        END IF;
      END$$;
    `;

    // 2. Create the appointments table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER NOT NULL,
        patient_id INTEGER NOT NULL,
        appointment_date TIMESTAMPTZ NOT NULL,
        reason TEXT,
        slot INT,
        status appointment_status DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createEnumTypeQuery);
    const result = await client.query(createTableQuery);
    console.log('✅ Appointments table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating appointments table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
