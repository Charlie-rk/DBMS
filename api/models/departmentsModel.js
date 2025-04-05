import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:your_password@your_supabase_host:5432/postgres";

/**
 * Creates the "departments" table if it doesn't exist.
 * This table stores doctor departments for filtering and scheduling.
 */
export async function createDepartmentTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });
  
  try {
    await client.connect();
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS departments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(createTableQuery);
    console.log('✅ Departments table created or already exists.');
  } catch (error) {
    console.error('❌ Error creating departments table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
