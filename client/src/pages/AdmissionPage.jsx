/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Filter } from 'lucide-react';
import { Backdrop } from '@mui/material';
import CustomSpinner from '../components/CustomSpinner';
import { useSelector } from 'react-redux';

const MySwal = withReactContent(Swal);

function AdmissionPage() {
  const [roomSummary, setRoomSummary] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [admissionData, setAdmissionData] = useState({
    patientId: '',
    admissionDate: '',
    notes: '',
  });
  const [admitting, setAdmitting] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  // Fetch room summary on mount
  useEffect(() => {
    async function fetchRoomSummary() {
      setLoadingRooms(true);
      try {
        const response = await fetch('/api/fdo/rooms-summary');
        const data = await response.json();
        setRoomSummary(data.summary || []);
      } catch (error) {
        MySwal.fire({
          icon: "error",
          title: "Failed to fetch room summary",
          timer: 1500,
          showConfirmButton: false,
        });
      } finally {
        setLoadingRooms(false);
      }
    }
    fetchRoomSummary();
  }, []);

  // Handle changes in admission form fields
  const handleAdmissionChange = (e) => {
    setAdmissionData({
      ...admissionData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle department filter changes
  const handleDepartmentFilterChange = (e) => {
    setDepartmentFilter(e.target.value);
  };

  // Set the selected room and notify the user
  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
    MySwal.fire({
      icon: "success",
      title: `Room ${room.room_type} from ${room.department_name} selected`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Submit the admission data along with the selected room's ID
  const handleSubmitAdmission = async (e) => {
    e.preventDefault();
    if (!admissionData.patientId || !selectedRoom || !admissionData.admissionDate) {
      MySwal.fire({
        icon: "error",
        title: "Patient ID, selected room, and admission date are required",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    setAdmitting(true);
    try {
      const response = await fetch('/api/fdo/admit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fdo: currentUser.username,
          patientId: admissionData.patientId,
          roomId: selectedRoom.room_id,
          admissionDate: admissionData.admissionDate,
          notes: admissionData.notes,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        MySwal.fire({
          icon: "error",
          title: data.error || "Admission failed",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: data.message || "Patient admitted successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        // Clear the form and selected room
        setAdmissionData({
          patientId: '',
          admissionDate: '',
          notes: '',
        });
        setSelectedRoom(null);
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Network error. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setAdmitting(false);
    }
  };

  // Filter rooms based on selected department
  const filteredRooms =
    departmentFilter === "All"
      ? roomSummary
      : roomSummary.filter(room => room.department_name === departmentFilter);

  // Get unique department names for the dropdown filter
  const departments = Array.from(new Set(roomSummary.map(room => room.department_name)));

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Patient Admission</h2>
      {admitting && (
                <Backdrop
                  sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                  open={true}
                >
                  {/* <CircularProgress color="inherit" /> */}
                  <CustomSpinner />
                </Backdrop>
              )}
      {/* Room Summary Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Room Summary</h3>
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 mr-2 text-blue-500" />
          <select
            value={departmentFilter}
            onChange={handleDepartmentFilterChange}
            className="border border-gray-300 dark:border-gray-700 p-2 rounded"
          >
            <option value="All">All Departments</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        {loadingRooms ? (
          <p>Loading room summary...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div key={room.room_id} className="p-4 border border-gray-300 dark:border-gray-700 rounded shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{room.department_name}</span>
                  <span className="text-sm text-gray-600">{room.room_type}</span>
                </div>
                <div className="text-sm">
                  <p>Total Rooms: {room.total_count}</p>
                  <p>Occupied: {room.occupied_count}</p>
                  <p>Available: {room.available_rooms}</p>
                </div>
                <Button onClick={() => handleSelectRoom(room)} className="mt-2" outline>
                  Select Room
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admission Form Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Admit Patient</h3>
        {selectedRoom && (
          <div className="mb-4 p-4 border border-green-400 rounded bg-green-50 text-green-800">
            Selected Room: <strong>{selectedRoom.department_name} - {selectedRoom.room_type}</strong> (Room ID: {selectedRoom.room_id})
          </div>
        )}
        <form onSubmit={handleSubmitAdmission} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Patient ID:
            </label>
            <input
              type="text"
              name="patientId"
              value={admissionData.patientId}
              onChange={handleAdmissionChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Admission Date:
            </label>
            <input
              type="date"
              name="admissionDate"
              value={admissionData.admissionDate}
              onChange={handleAdmissionChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">
              Notes/Updates:
            </label>
            <textarea
              name="notes"
              value={admissionData.notes}
              onChange={handleAdmissionChange}
              className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
              rows="3"
            ></textarea>
          </div>
          <Button
            type="submit"
            outline
            disabled={admitting}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
          >
            {admitting ? 'Admitting...' : 'Admit Patient'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AdmissionPage;
