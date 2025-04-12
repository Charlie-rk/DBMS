/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/SrollToTop';
import Help from './pages/Help';
import Form from './pages/Form';
import RegistrationPage from './pages/RegistrationPage';
import AppointmentPage from './pages/AppointmentPage';
import AdmissionPage from './pages/AdmissionPage';
import DischargePage from './pages/DischargePage';
import FDODashboard from './pages/FDODashboard';
import EDODashboard from './pages/EDODashboard';
import AllDepartment from './pages/Alldepartment';
import Alldoctor from './pages/Alldoctor';
import Spinner from './components/CustomSpinner';
import { useSelector } from 'react-redux';
import AdminRoute from './components/AdminRoute';
import FDORoute from './components/FDORoute';
import DoctorRoute from './components/DcotorRoute';
import DEORoute from './components/DEORoute';
import Profile from './pages/Profile';
import Medication from './pages/Medication';
import Message from './pages/Message';
import DoctorDashboard from './pages/DoctorDashboard';
import AllPatient from './pages/AllPatient';
// Import socket.io client
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  // Determine which dashboard to render based on user role
  const getDashboardComponent = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'Front Desk Operator':
        return <FDODashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'Data Entry Operator':
        return <EDODashboard />;
      case 'Admin':
        return <Dashboard />;
      default:
        return <SignIn />; // Fallback if role isn't recognized
    }
  };

  // Initialize Socket.IO connection when currentUser is available
  useEffect(() => {
    if (currentUser && currentUser.username) {
      const socket = io('http://localhost:3000', {
        // You can add options here if needed (e.g., withCredentials, transports)
      });

      socket.on('connect', () => {
        console.log('Connected to socket server with ID:', socket.id);
        // Emit the register event with the current user's username.
        socket.emit('register', currentUser.username);
        console.log(`Sent register event for user: ${currentUser.username}`);
      });

      // Optionally, listen for any socket events (e.g., notifications)
      socket.on('notification', (data) => {
        console.log('Received notification:', data);
        // Handle the notification as needed, for example updating your redux state.
      });

   // Socket listener for emergency appointment alert
socket.on("emergencyAppointment", (appointment) => {
  console.log("Received emergency appointment alert", appointment);
  MySwal.fire({
    icon: "warning",
    title: "Emergency Appointment Alert",
    text: `Emergency Appointment scheduled for Patient ID: ${appointment.patient_id}. Please check immediately!`,
    showCloseButton: true,
    confirmButtonText: "Close"
  });
});
  

      // Cleanup the socket connection when the component unmounts or the user changes.
      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [currentUser]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <BackToTop />
      <ToastContainer />
      <Routes>
        <Route path="/" element={ currentUser ? getDashboardComponent() : <SignIn /> } />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          {/* Protected Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminRoute />} />
          <Route path="/fdo/*" element={<FDORoute />} />
          <Route path="/doctor/*" element={<DoctorRoute />} />
          <Route path="/deo/*" element={<DEORoute />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
