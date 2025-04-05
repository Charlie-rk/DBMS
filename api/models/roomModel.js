import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
   process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "rooms" table if it doesn't exist.
 * Now each room belongs to a department.
 */
export async function createRoomTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });
  
  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        department_id INT NOT NULL,
        room_type VARCHAR(20) NOT NULL,
        total_count INT NOT NULL,
        occupied_count INT DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_department
          FOREIGN KEY(department_id)
            REFERENCES departments(id)
            ON DELETE CASCADE
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Rooms table (with department) created or already exists.');
  } catch (error) {
    console.error('❌ Error creating rooms table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
