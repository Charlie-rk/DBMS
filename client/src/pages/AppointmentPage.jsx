/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from 'react-redux';

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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
      {!appointmentData.emergency && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedSlot(null);
            setAppointmentNumber(null);
          }}
        >
          <Modal.Header>Available Slots</Modal.Header>
          <Modal.Body>
            {slotData ? (
              selectedSlot ? (
                <div>
                  <p className="mb-2 text-gray-800 dark:text-gray-200">
                    You selected slot:{" "}
                    <strong>{selectedSlot.slot.replace('slot', '')}</strong>
                  </p>
                  {selectedSlot.room_type && (
                    <p className="mb-2 text-gray-800 dark:text-gray-200">
                      Room Type: <strong>{selectedSlot.room_type}</strong>
                    </p>
                  )}
                  <p className="mb-2 text-gray-800 dark:text-gray-200">
                    Total appointments: {selectedSlot.total}
                  </p>
                  <p className="mb-2 text-gray-800 dark:text-gray-200">
                    Already booked (accepted + pending):{" "}
                    {selectedSlot.accepted + selectedSlot.pending}
                  </p>
                  <p className="mb-2 text-gray-800 dark:text-gray-200">
                    Your appointment number will be:{" "}
                    <strong>{appointmentNumber}</strong>
                  </p>
                </div>
              ) : (
                <div>
                  {slotData.map((slotItem) => (
                    <div
                      key={slotItem.slot}
                      className="mb-4 border p-2 rounded"
                    >
                      <p className="text-gray-800 dark:text-gray-200">
                        Slot: {slotItem.slot.replace('slot', '')}
                      </p>
                      {slotItem.room_type && (
                        <p className="text-gray-800 dark:text-gray-200">
                          Room Type: {slotItem.room_type}
                        </p>
                      )}
                      <p className="text-gray-800 dark:text-gray-200">
                        Total appointments: {slotItem.total}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        Already booked:{" "}
                        {slotItem.accepted + slotItem.pending}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        Available: {slotItem.available}
                      </p>
                      <div className="mt-2">
                        <Button
                          onClick={() => handleSlotSelect(slotItem)}
                          outline
                        >
                          Select this Slot
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div>Loading slots...</div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedSlot && (
              <Button
                onClick={confirmAppointment}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
              >
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
