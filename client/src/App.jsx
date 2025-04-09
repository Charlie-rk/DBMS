/* eslint-disable no-unused-vars */
import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import About from './pages/About';
// import Home from './pages/Home';
import SignIn from './pages/SignIn';
// import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
// import Projects from './pages/Projects';
import Header from './components/Header';
import Footer from './components/Footer';
// import SeatSelectionForm from './components/SeatSelectionForm';
// import SwapResults from './pages/Swapresults';
import BackToTop from './components/BackToTop';
import PrivateRoute from './components/PrivateRoute';
import ScrollToTop from './components/SrollToTop';

// import NotificationPage from './pages/NotificationPage';
import Help from './pages/Help';
import Form from './pages/Form';
import RegistrationPage from './pages/RegistrationPage';
import AppointmentPage from './pages/AppointmentPage';
import AdmissionPage from './pages/AdmissionPage';
import DischargePage from './pages/DischargePage';
// import DoctorAppDashboard from './pages/DoctorAppDashboard';
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
export default function App() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser)
  const getDashboardComponent = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'Front Desk Operator':
        return <FDODashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Data Entry Operator':
        return <EDODashboard />;
      case 'Admin':
        return <Dashboard />;
      default:
        return <SignIn />; // Fallback to a default dashboard if role is not recognized
    }
  };
 
  return (
    // <div>
    //   App
    // </div>
    <BrowserRouter>
    <ScrollToTop/>
    <Header/>
    <BackToTop/>
    <Routes>  
         {/* <Route path='/' element={<Home/>} /> */}

         <Route path='/form' element={<Form/>} />
         <Route path='/patient' element={<AllPatient/>} />
         <Route path='/doctor/*' element={<DoctorDashboard/>} />
         <Route path='/fdo/*' element={<FDODashboard/>} />
         <Route path="/deo/*" element={<EDODashboard />} />
         <Route path="/admin/*" element={<Dashboard />} />
         <Route path="/medication" element={<Medication />} />
         <Route path="/mess" element={<Message />} />
         {/* <Route path="/profile" element={<Profile />} /> */}


        
        <Route path="/" element={ currentUser ? getDashboardComponent() : <SignIn /> } />
         <Route path='/about' element={<About/>} />
         <Route path='/help' element={<Help/>} />
         <Route path='/sign-in' element={<SignIn/>} />
         
         <Route element={<PrivateRoute />}>
          {/* Admin Route */}
          <Route path="/profile" element={<Profile />} />
          <Route path='/admin/*' element={<AdminRoute />} />
          <Route path='/fdo/*' element={<FDORoute />} />
          <Route path='/doctor_dashboard' element={<DoctorRoute />} />
          {/* <Route path='/deo/*' element={<DEORoute />} /> */}
        </Route>

    </Routes>
    <Footer/>
    </BrowserRouter>
    
  )
}
