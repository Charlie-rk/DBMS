import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import pkg from 'pg';
import authRoute from './routes/authRoute.js';
const { Client } = pkg;

dotenv.config();

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '/client/dist')));
app.use(cookieParser());

// Supabase configuration
const supabaseUrl = 'https://tvgasdupkqffhvqzurwy.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Use the provided connection string (password URL-encoded)
const SUPABASE_DB_URL = "postgresql://postgres:Charlie%401275@db.sbpfqvpwpwmbzucacozv.supabase.co:5432/postgres";
console.log("Hey !");
console.log(SUPABASE_DB_URL)

const client = new Client({
  connectionString: SUPABASE_DB_URL,
});
console.log("debguging 2");
// console.log(client)


app.use("/api/auth", authRoute);







// Function to create the users table using pg






async function createUserTable() {
  const client = new Client({
    connectionString: SUPABASE_DB_URL,
  });
  console.log("debguging 2");
  console.log(client)

  try {
    await client.connect();
    // console.l
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        profile_picture VARCHAR(255) DEFAULT 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const result = await client.query(createTableQuery);
    console.log('Table created or already exists:', result);
    return result;
  } catch (err) {
    console.error('Error creating table:', err);
    throw err;
  } finally {
    await client.end();
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Route "/" triggers the table creation process
app.get('/', async (req, res) => {
  try {
    console.log("Received GET request to /");
    const tableResult = await createUserTable();
    res.json({ message: 'User table created or already exists', tableResult });
  } catch (error) {
    console.error("Error in / route:", error);
    res.status(500).json({ error: error.message });
  }
});

// Fallback route for SPA (Single Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
