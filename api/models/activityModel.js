import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "activity" table if it doesn't exist.
 * Call this ONCE on server start.
 */
export async function createActivityTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        username VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('✅ Activity table created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating activity table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
