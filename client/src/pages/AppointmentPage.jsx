/* eslint-disable no-unused-vars */
import { Button, Modal } from 'flowbite-react';
import React, { useState } from 'react';

function AppointmentPage() {
  const [appointmentData, setAppointmentData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    // Instead of entering a time, we will choose a slot from the modal.
    slot: '',
    appointmentNumber: null,
  });
  
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentNumber, setAppointmentNumber] = useState(null);

  // Dummy data for available slots.
  const slots = [
    { slot: '9-12', max: 10, current: 5 },
    { slot: '2-5', max: 8, current: 3 },
    { slot: '6-10', max: 12, current: 7 },
  ];

  const handleChange = (e) => {
    setAppointmentData({
      ...appointmentData,
      [e.target.name]: e.target.value,
    });
  };

  // Opens the modal if required fields are filled.
  const openModal = (e) => {
    e.preventDefault();
    if (appointmentData.patientId && appointmentData.doctorId && appointmentData.appointmentDate) {
      setShowModal(true);
    } else {
      alert('Please fill in Patient ID, Doctor, and Appointment Date first.');
    }
  };

  // Handles selection of a slot from the modal.
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    // Dummy appointment number: current booked + 1
    setAppointmentNumber(slot.current + 1);
  };

  // Confirms the selected slot and updates the appointment data.
  const confirmAppointment = () => {
    const updatedData = {
      ...appointmentData,
      slot: selectedSlot.slot,
      appointmentNumber: appointmentNumber,
    };
    setAppointmentData(updatedData);
    setShowModal(false);
    // Reset the temporary slot selection
    setSelectedSlot(null);
    setAppointmentNumber(null);
    console.log('Appointment scheduled:', updatedData);
  };

  // Final submission (if needed) after modal confirmation.
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Final Appointment Data:', appointmentData);
    // Here you could call an API to save the appointment.
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Schedule Appointment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <option value="D001">Dr. Sharma (General)</option>
            <option value="D002">Dr. Mehta (Cardiology)</option>
            <option value="D003">Dr. Verma (Neurology)</option>
          </select>
        </div>
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
        <div>
          {/* Button to check availability and trigger modal */}
          <Button onClick={openModal} outline className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
            Check Availability
          </Button>
        </div>
        {appointmentData.slot && (
          <div className="p-4 border rounded bg-gray-50 dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-200">
              Selected Slot: <strong>{appointmentData.slot}</strong>
            </p>
            <p className="text-gray-800 dark:text-gray-200">
              Your Appointment Number: <strong>{appointmentData.appointmentNumber}</strong>
            </p>
          </div>
        )}
        <div>
          <Button type="submit" className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
            Schedule Appointment
          </Button>
        </div>
      </form>

      {/* Modal for available slots */}
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
          {selectedSlot ? (
            <div>
              <p className="mb-2 text-gray-800 dark:text-gray-200">
                You selected slot: <strong>{selectedSlot.slot}</strong>
              </p>
              <p className="mb-2 text-gray-800 dark:text-gray-200">
                Max appointments: {selectedSlot.max}
              </p>
              <p className="mb-2 text-gray-800 dark:text-gray-200">
                Currently booked: {selectedSlot.current}
              </p>
              <p className="mb-2 text-gray-800 dark:text-gray-200">
                Your appointment number will be: <strong>{appointmentNumber}</strong>
              </p>
            </div>
          ) : (
            <div>
              {slots.map((slotItem) => (
                <div key={slotItem.slot} className="mb-4 border p-2 rounded">
                  <p className="text-gray-800 dark:text-gray-200">Slot: {slotItem.slot}</p>
                  <p className="text-gray-800 dark:text-gray-200">
                    Max appointments: {slotItem.max}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    Currently booked: {slotItem.current}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    Available: {slotItem.max - slotItem.current}
                  </p>
                  <div className="mt-2">
                    <Button onClick={() => handleSlotSelect(slotItem)} outline>
                      Select this Slot
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedSlot && (
            <Button onClick={confirmAppointment} className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800">
              Confirm Appointment
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AppointmentPage;
