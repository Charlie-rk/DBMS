/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from 'react-redux';

import { 
  Clock, 
  Users, 
  CheckCircle, 
  PauseCircle, 
  Calendar, 
  Home, 
  AlertCircle,
  CheckSquare,
  ArrowRight
} from 'lucide-react';
const MySwal = withReactContent(Swal);

function AppointmentPage() {
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    slot: '',              // Will be used only for non-emergency appointments.
    appointmentNumber: null,
    condition: '',
    emergency: false,      // Mark appointment as emergency.
  });
  const [doctors, setDoctors] = useState([]);
  const [slotData, setSlotData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentNumber, setAppointmentNumber] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  // inside AppointmentPage, before your return:
const slotTimes = {
  slot1: '9 AM – 12 PM',
  slot2: '2 PM – 5 PM',
  slot3: '6 PM – 10 PM',
};


  // Fetch doctor info from backend.
  useEffect(() => {
    fetch('/api/admin/get-all-users?role=doctor')
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data.users);
      })
      .catch((error) => console.error('Error fetching doctors:', error));
  }, []);

  // Fetch slot distribution only when doctor and date are selected.
  // This is used only for non-emergency appointments.
  useEffect(() => {
    if (!appointmentData.emergency && appointmentData.doctorId && appointmentData.appointmentDate) {
      fetch('/api/fdo/get-slot-distribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: appointmentData.doctorId,
          date: appointmentData.appointmentDate,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          const slotsArray = Object.keys(data).map((key) => ({
            slot: key,
            ...data[key],
          }));
          setSlotData(slotsArray);
        })
        .catch((error) =>
          console.error('Error fetching slot distribution:', error)
        );
    }
  }, [appointmentData.doctorId, appointmentData.appointmentDate, appointmentData.emergency]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    // If emergency is toggled on, reset any selected slot.
    if(e.target.name === 'emergency' && value){
      setSelectedSlot(null);
      setAppointmentNumber(null);
      setAppointmentData(prev => ({ ...prev, slot: '' }));
    }
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: value,
    });
  };

  // Opens the slot selection modal only if appointment is not emergency.
  const openModal = (e) => {
    e.preventDefault();
    if (
      appointmentData.patientId &&
      appointmentData.doctorId &&
      appointmentData.appointmentDate
    ) {
      if (!slotData) {
        MySwal.fire({
          icon: "info",
          title: "Fetching slot availability, please wait...",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      setShowModal(true);
    } else {
      MySwal.fire({
        icon: "error",
        title: "Please fill in Patient ID, Doctor, and Appointment Date first.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Handles selection of a slot from the modal.
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setAppointmentNumber(slot.accepted + slot.pending + 1);
  };

  // Confirms the selected slot and updates the appointment data.
  const confirmAppointment = () => {
    const slotNumber = Number(selectedSlot.slot.replace('slot', ''));
    const updatedData = {
      ...appointmentData,
      slot: slotNumber,
      appointmentNumber: appointmentNumber,
    };
    setAppointmentData(updatedData);
    setShowModal(false);
    setSelectedSlot(null);
    setAppointmentNumber(null);
  };

  // Final submission for scheduling appointment.
  const handleSubmit = (e) => {
    e.preventDefault();
    // For emergency appointments, slot is not required.
    if (
      !appointmentData.patientId ||
      !appointmentData.doctorId ||
      !appointmentData.appointmentDate ||
      (!appointmentData.emergency && !appointmentData.slot) ||
      !appointmentData.condition
    ) {
      MySwal.fire({
        icon: "error",
        title: "Please fill in all required appointment details.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    const numericPatientId = Number(appointmentData.patientId);
    const numericDoctorId = Number(appointmentData.doctorId);

    setSchedulingLoading(true);
    fetch('/api/fdo/schedule-appointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fdo: currentUser.username,
        patientId: numericPatientId,
        doctorId: numericDoctorId,
        appointmentDate: appointmentData.appointmentDate,
        // For non-emergency appointments, slot will be a valid number.
        // For emergency appointments, slot may be omitted or set to null.
        slot: appointmentData.emergency ? null : appointmentData.slot,
        condition: appointmentData.condition,
        emergency: appointmentData.emergency,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.error || 'Error scheduling appointment');
          });
        }
        return res.json();
      })
      .then((data) => {
        setSchedulingLoading(false);
        MySwal.fire({
          icon: "success",
          title: appointmentData.emergency
            ? "Emergency appointment scheduled successfully! Please proceed directly to the emergency room."
            : "Appointment scheduled successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
        // Reset the form.
        setAppointmentData({
          patientId: '',
          doctorId: '',
          appointmentDate: '',
          slot: '',
          appointmentNumber: null,
          condition: '',
          emergency: false,
        });
        setSlotData(null);
      })
      .catch((error) => {
        setSchedulingLoading(false);
        MySwal.fire({
          icon: "error",
          title: error.message,
          timer: 1500,
          showConfirmButton: false,
        });
      });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-slate-600 dark:shadow-slate-900">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Schedule Appointment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient ID */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={appointmentData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        {/* Doctor Select */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Select Doctor:
          </label>
          <select
            name="doctorId"
            value={appointmentData.doctorId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          >
            <option value="">--Select Doctor--</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} ({doc.specialisation})
              </option>
            ))}
          </select>
        </div>
        {/* Appointment Date */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Appointment Date:
          </label>
          <input
            type="date"
            name="appointmentDate"
            value={appointmentData.appointmentDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        {/* Condition/Reason */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Condition/Reason:
          </label>
          <textarea
            name="condition"
            value={appointmentData.condition}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        {/* Emergency Checkbox */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="emergency"
            checked={appointmentData.emergency}
            onChange={handleChange}
            id="emergency"
            className="mr-2"
          />
          <label htmlFor="emergency" className="text-gray-700 dark:text-gray-300">
            Mark as Emergency Appointment
          </label>
        </div>
        {/* For non-emergency appointments, allow slot availability check */}
        {!appointmentData.emergency && (
          <div>
            <Button
              onClick={openModal}
              outline
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
            >
              Check Availability
            </Button>
          </div>
        )}
        {/* Display selected slot & appointment number if available (non-emergency) */}
        {!appointmentData.emergency && appointmentData.slot && (
          <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-200">
              Selected Slot: <strong>{appointmentData.slot}</strong>
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              Your Appointment Number:{" "}
              <strong>{appointmentData.appointmentNumber}</strong>
            </p>
          </div>
        )}
        {/* Final submission button */}
        <div>
          <Button
            type="submit"
            disabled={schedulingLoading}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
          >
            {schedulingLoading
              ? "Scheduling..."
              : appointmentData.emergency
              ? "Schedule Emergency Appointment"
              : "Schedule Appointment"}
          </Button>
        </div>
      </form>

      {/* Modal for available slots (only for non-emergency appointments) */}
      {/* Modal for available slots (only for non-emergency appointments) */}
      {!appointmentData.emergency && (
  <Modal
    show={showModal}
    onClose={() => {
      setShowModal(false);
      setSelectedSlot(null);
      setAppointmentNumber(null);
    }}
    className="dark:bg-gray-800"
  >
    {/* Header */}
    <Modal.Header className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white flex items-center">
      <Calendar className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
      Available Slots
    </Modal.Header>

    {/* Body */}
    <Modal.Body className="bg-white dark:bg-gray-800">
      {slotData ? (
        selectedSlot ? (
          <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600 rounded-lg shadow-sm">
            <div className="mb-4 text-xl font-semibold text-blue-600 dark:text-blue-300 flex items-center">
              <CheckSquare className="mr-2" size={24} />
              Slot Selection Summary
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <Clock className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
                <span className="font-medium">Selected Slot:</span>
                <span className="ml-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-800 dark:text-blue-100 font-semibold">
                  {selectedSlot.slot.replace('slot', '')}
                </span>
              </div>
              
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <Clock className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
                <span className="font-medium">Time:</span>
                <span className="ml-2 font-semibold">{slotTimes[selectedSlot.slot]}</span>
              </div>
              
              {selectedSlot.room_type && (
                <div className="flex items-center text-gray-800 dark:text-gray-200">
                  <Home className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
                  <span className="font-medium">Room Type:</span>
                  <span className="ml-2 font-semibold">{selectedSlot.room_type}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <Users className="mr-2 text-blue-500 dark:text-blue-400" size={20} />
                <span className="font-medium">Total Capacity:</span>
                <span className="ml-2 font-semibold">{selectedSlot.total}</span>
              </div>
              
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <CheckCircle className="mr-2 text-green-500 dark:text-green-400" size={20} />
                <span className="font-medium">Accepted:</span>
                <span className="ml-2 font-semibold">{selectedSlot.accepted}</span>
              </div>
              
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <PauseCircle className="mr-2 text-yellow-500 dark:text-yellow-300" size={20} />
                <span className="font-medium">Pending:</span>
                <span className="ml-2 font-semibold">{selectedSlot.pending}</span>
              </div>
              
              <div className="flex items-center text-gray-800 dark:text-gray-200">
                <Users className="mr-2 text-purple-500 dark:text-purple-300" size={20} />
                <span className="font-medium">Already Booked:</span>
                <span className="ml-2 font-semibold">{selectedSlot.accepted + selectedSlot.pending}</span>
              </div>
              
              <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center text-blue-800 dark:text-blue-100">
                <AlertCircle className="mr-2 text-blue-600 dark:text-blue-300" size={20} />
                <span className="font-medium">Your appointment number will be:</span>
                <span className="ml-2 px-3 py-1 bg-white dark:bg-gray-800 rounded-full text-blue-800 dark:text-blue-100 font-bold">
                  {appointmentNumber}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {slotData.map((slotItem) => (
              <div
                key={slotItem.slot}
                className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 py-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white font-bold">
                      <Clock className="mr-2" size={18} />
                      Slot {slotItem.slot.replace('slot', '')}
                    </div>
                    <div className="text-white text-sm font-medium px-2 py-1 bg-black bg-opacity-20 rounded-full">
                      {slotTimes[slotItem.slot]}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white dark:bg-gray-700">
                  <div className="space-y-2">
                    {slotItem.room_type && (
                      <div className="flex items-center text-gray-700 dark:text-gray-200">
                        <Home className="mr-2 text-gray-500 dark:text-gray-300" size={16} />
                        <span>Room: {slotItem.room_type}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-200">
                      <Users className="mr-2 text-gray-500 dark:text-gray-300" size={16} />
                      <span>Capacity: {slotItem.total}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-200">
                      <CheckCircle className="mr-2 text-green-500 dark:text-green-400" size={16} />
                      <span>Accepted: {slotItem.accepted}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-200">
                      <PauseCircle className="mr-2 text-yellow-500 dark:text-yellow-300" size={16} />
                      <span>Pending: {slotItem.pending}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700 dark:text-gray-200">
                      <Users className="mr-2 text-gray-500 dark:text-gray-300" size={16} />
                      <span>Booked: {slotItem.accepted + slotItem.pending}</span>
                    </div>
                    
                    <div className="flex items-center font-medium text-green-600 dark:text-green-400">
                      <CheckCircle className="mr-2" size={16} />
                      <span>Available: {slotItem.available}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      onClick={() => handleSlotSelect(slotItem)}
                      outline
                      className="w-full bg-gradient-to-r from-green-400 to-green-500 dark:from-green-500 dark:to-green-600 text-white hover:bg-gradient-to-bl focus:ring-green-300 dark:focus:ring-green-800 flex items-center justify-center"
                    >
                      <span>Select this Slot</span>
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex items-center justify-center p-8 text-gray-800 dark:text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 dark:border-blue-400 mr-3"></div>
          Loading slots...
        </div>
      )}
    </Modal.Body>

    {/* Footer */}
    <Modal.Footer className="bg-white dark:bg-gray-900">
      {selectedSlot && (
        <Button
          onClick={confirmAppointment}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 flex items-center"
        >
          <CheckSquare className="mr-2" size={18} />
          Confirm Appointment
        </Button>
      )}
    </Modal.Footer>
  </Modal>
)}
    </div>
  );
}

export default AppointmentPage;
