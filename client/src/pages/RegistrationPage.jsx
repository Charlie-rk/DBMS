/* eslint-disable no-unused-vars */
import { Button, Modal } from 'flowbite-react';
import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { User, Phone, MapPin, Calendar } from 'lucide-react';
import { Backdrop } from '@mui/material';
import CustomSpinner from '../components/CustomSpinner';
// import ReactToPrint from 'react-to-print'; // New import for printing
import { ReactToPrint } from 'react-to-print';

const MySwal = withReactContent(Swal);

function RegistrationPage() {
  const { currentUser } = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [patientData, setPatientData] = useState(null);
  
  const [formData, setFormData] = useState({
    fdo: currentUser.username,
    name: '',
    mobile: '',
    dob: '',
    address: '',
    gender: '',
    isExisting: false,
  });

  // Ref for printing the patient details
  const printRef = useRef();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (!formData.name || !formData.mobile || !formData.gender) {
      MySwal.fire({
        icon: "error",
        title: "Please fill all the required fields",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);
    try {
      // API call to register the patient
      const response = await fetch('/api/fdo/register-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      // console.log(data);

      if (!response.ok) {
        // If the response status is not ok, show error alert with message from backend or a default error.
        MySwal.fire({
          icon: "error",
          title: data.error || "Something went wrong!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Set the received patient data and open the modal to display the details.
        setPatientData(data.patient);
        setShowModal(true);
        // Optionally, you can clear the form here
        setFormData({
          fdo: currentUser.username,
          name: '',
          mobile: '',
          dob: '',
          address: '',
          gender: '',
          isExisting: false,
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Network error. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md shadow-slate-600 dark:shadow-slate-700">
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CustomSpinner />
          </Backdrop>
        )}
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Patient Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Name:
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Mobile Number:
            </label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Date of Birth:
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Address:
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Gender:
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              required
            >
              <option value="">--Select Gender--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Existing Patient?
            </label>
            <select
              name="isExisting"
              value={formData.isExisting}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isExisting: e.target.value === 'true',
                })
              }
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <Button
            type="submit"
            outline
            disabled={loading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </div>

      {/* Flowbite Modal to display patient details */}
      {patientData && (
        <Modal show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>
            Patient Details
          </Modal.Header>
          <Modal.Body>
            <div ref={printRef} className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-500" />
                <span><strong>ID:</strong> {patientData.id}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-500" />
                <span><strong>Name:</strong> {patientData.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-blue-500" />
                <span><strong>Mobile:</strong> {patientData.mobile}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span><strong>Address:</strong> {patientData.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>
                  <strong>DOB:</strong>{" "}
                  {new Date(patientData.dob).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5" />
                <span><strong>Gender:</strong> {patientData.gender}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5" />
                <span><strong>Age:</strong> {patientData.age}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5" />
                <span><strong>Visit No:</strong> {patientData.visit_no}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5" />
                <span><strong>Status:</strong> {patientData.status}</span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="flex justify-between">
            <Button onClick={() => setShowModal(false)}>
              Close
            </Button>
            <ReactToPrint
              trigger={() => (
                <Button className="bg-green-500 hover:bg-green-600 text-white">
                  Print Details
                </Button>
              )}
              content={() => printRef.current}
              pageStyle="@media print { body { -webkit-print-color-adjust: exact; } }"
            />
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default RegistrationPage;
