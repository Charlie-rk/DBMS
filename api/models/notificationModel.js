import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config();

const SUPABASE_DB_URL =
  process.env.SUPABASE_DB_URL ||
  "postgresql://postgres:Lieu10ants%21@db.tvgasdupkqffhvqzurwy.supabase.co:5432/postgres";

/**
 * Creates the "notification" table and ENUM type if they don't exist.
 * Call this ONCE on server start.
 */
export async function createNotificationTable() {
  const client = new Client({ connectionString: SUPABASE_DB_URL });

  try {
    await client.connect();

    // Create ENUM type for notification status
    const createEnumQuery = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_status') THEN
          CREATE TYPE notification_status AS ENUM ('read', 'unread');
        END IF;
      END$$;
    `;

    // Create the notification table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS notification (
        id SERIAL PRIMARY KEY,
        username VARCHAR(30),
        sender VARCHAR(30),
        subject VARCHAR(100),
        message TEXT,
        status notification_status DEFAULT 'unread',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createEnumQuery);
    const result = await client.query(createTableQuery);

    console.log('✅ Notification table with ENUM created or already exists.');
    return result;
  } catch (error) {
    console.error('❌ Error creating notification table:', error);
    throw error;
  } finally {
    await client.end();
  }
}
