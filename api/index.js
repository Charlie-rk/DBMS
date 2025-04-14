
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { createUserTable } from './models/userModel.js';
import { createPatientTable } from './models/patientModel.js';
import { createAppointmentTable } from './models/appointmentModel.js'; // ✅ fixed typo
import { createTestsTable } from './models/testsModel.js';
import { createTreatmentsTable } from './models/treatmentsModel.js';
import { createReportsTable } from './models/reportsModel.js';

import { createAdmissionTable } from './models/admissionModel.js';
import { createRoomTable } from './models/roomModel.js';
import { createDepartmentTable } from './models/departmentsModel.js';
import { createActivityTable } from './models/activityModel.js';
// import userRoute from './routes/userRoute.js';
import doctorRoute from './routes/doctorRoute.js';
import adminRoute  from './routes/adminRoute.js'
import fdoRoute from './routes/fdoRoute.js';
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import deoRoute from './routes/deoRoute.js';
import { createNotificationTable } from './models/notificationModel.js';
// import { verifyToken } from './utilis/verifyUser';


import http from 'http';
import { Server } from 'socket.io';


dotenv.config();

const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/dist')));

// ✅ Create tables once at startup
Promise.all([
  createUserTable(),
  createPatientTable(),
  createAppointmentTable(),

  //new
  createTestsTable(),
  createTreatmentsTable(),
  createReportsTable(),
  createAdmissionTable(),
  createRoomTable(),
  createDepartmentTable(),
  createActivityTable(),
  createNotificationTable(),
])
  .then(() => console.log('🚀 User, Patient & Appointment tables ready.'))
  .catch((err) => console.error('🔥 Table creation failed:', err));

// ✅ Mount routes
// app.use('/api/user', userRoute);
app.use('/api/doctor', doctorRoute);
app.use('/api/admin',adminRoute);
app.use('/api/fdo', fdoRoute);
app.use('/api/auth',authRoute);
app.use('/api/user',userRoute);
app.use('/api/deo', deoRoute);

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});


// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust the allowed origin(s) in production for security
    methods: ["GET", "POST"],
  },
});

// Global mapping: username -> array of socket IDs
const userSocketMap = {};

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Register event – client emits this after connecting
  socket.on('register', (username) => {
    console.log("username - > ",username);
    if (username) {
      userSocketMap[username] = userSocketMap[username] || [];
      userSocketMap[username].push(socket.id);
      socket.username = username;
      console.log(`User ${username} connected with socket ${socket.id}`);
    }
  });

  // Clean up when a socket disconnects
  socket.on('disconnect', () => {
    if (socket.username && userSocketMap[socket.username]) {
      userSocketMap[socket.username] = userSocketMap[socket.username].filter(
        (id) => id !== socket.id
      );
      console.log(`User ${socket.username} disconnected from socket ${socket.id}`);
    }
  });
});


const port = process.env.PORT || 3000;
// const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
});


// Exporting io and userSocketMap can be useful in other modules.
export { io, userSocketMap };