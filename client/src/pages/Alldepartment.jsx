/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
// src/pages/DepartmentsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Card, Button, Modal, TextInput, Label } from "flowbite-react";
import { Trash2 as TrashIcon, HeartPulse, Zap, Briefcase } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Mapping for assigning icons based on department names.
const departmentIcons = {
  Cardiology: <HeartPulse className="w-8 h-8 text-red-500" />,
  Neurology: <Zap className="w-8 h-8 text-yellow-500" />,
  Orthopedics: <Briefcase className="w-8 h-8 text-blue-500" />,
  Pediatrics: <Briefcase className="w-8 h-8 text-indigo-500" />,
  Oncology: <HeartPulse className="w-8 h-8 text-pink-500" />,
  Gynecology: <Briefcase className="w-8 h-8 text-indigo-500" />,
  Dermatology: <HeartPulse className="w-8 h-8 text-purple-500" />,
  Gastroenterology: <Zap className="w-8 h-8 text-orange-500" />,
  Pulmonology: <Briefcase className="w-8 h-8 text-teal-500" />,
  Urology: <HeartPulse className="w-8 h-8 text-red-500" />,
};

export default function Alldepartment() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    doctorCount: "",
    patientCount: "",
    rooms: { premium: "", executive: "", basic: "" },
  });

  // Helper function to fetch the room summary data and update departments state.
  const fetchRoomsSummary = async () => {
    try {
      const response = await fetch("/api/fdo/rooms-summary");
      const data = await response.json();
      const deptsMap = {};

      data.summary.forEach((item) => {
        const deptId = item.department_id;
        if (!deptsMap[deptId]) {
          deptsMap[deptId] = {
            id: deptId,
            name: item.department_name,
            // Use default doctor and patient counts (adjust if additional data is provided later).
            doctorCount: 0,
            patientCount: 0,
            rooms: { premium: 0, executive: 0, basic: 0 },
            icon: departmentIcons[item.department_name] || <Briefcase className="w-8 h-8 text-indigo-500" />,
          };
        }
        // Map room types from the API: "Premium" and "Executive" are mapped directly; "General" is treated as basic.
        const type = item.room_type.toLowerCase();
        if (type === "premium") {
          deptsMap[deptId].rooms.premium = item.total_count;
        } else if (type === "executive") {
          deptsMap[deptId].rooms.executive = item.total_count;
        } else {
          deptsMap[deptId].rooms.basic = item.total_count;
        }
      });
      setDepartments(Object.values(deptsMap));
    } catch (error) {
      console.error("Error fetching room summary:", error);
    }
  };

  // Fetch the room summary when the component mounts.
  useEffect(() => {
    fetchRoomsSummary();
  }, []);

  // Compute metrics using useMemo.
  const metrics = useMemo(() => {
    if (departments.length === 0) return {};
    const addTotalRooms = (dept) =>
      Number(dept.rooms.premium) + Number(dept.rooms.executive) + Number(dept.rooms.basic);
    let maxDoc = departments[0],
      minDoc = departments[0],
      maxPat = departments[0],
      minPat = departments[0],
      maxRooms = departments[0],
      minRooms = departments[0];
    departments.forEach((dept) => {
      if (dept.doctorCount > maxDoc.doctorCount) maxDoc = dept;
      if (dept.doctorCount < minDoc.doctorCount) minDoc = dept;
      if (dept.patientCount > maxPat.patientCount) maxPat = dept;
      if (dept.patientCount < minPat.patientCount) minPat = dept;
      if (addTotalRooms(dept) > addTotalRooms(maxRooms)) maxRooms = dept;
      if (addTotalRooms(dept) < addTotalRooms(minRooms)) minRooms = dept;
    });
    return { maxDoc, minDoc, maxPat, minPat, maxRooms, minRooms };
  }, [departments]);

  const openDeleteModal = (dept) => {
    setSelectedDept(dept);
    setShowModal(true);
  };

  // const handleDelete = (deptId) => {
  //   setDepartments(departments.filter((dept) => dept.id !== deptId));
  //   setShowModal(false);
  //   MySwal.fire({
  //     icon: "success",
  //     title: "Department deleted successfully!",
  //     timer: 1500,
  //     showConfirmButton: false,
  //   });
  // };

  // Handler for input change in the Add Department modal.
  const handleNewDeptChange = (e) => {
    const { name, value } = e.target;
    if (name in newDept.rooms) {
      setNewDept({
        ...newDept,
        rooms: { ...newDept.rooms, [name]: value },
      });
    } else {
      setNewDept({ ...newDept, [name]: value });
    }
  };

  const handleDelete = async (departmentId) => {
    // const confirmResult = await Swal.fire({
    //   title: 'Are you sure?',
    //   text: 'This will permanently delete the department.',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes, delete it!',
    //   cancelButtonText: 'Cancel',
    // });

    // if (confirmResult.isConfirmed) {
      setShowModal(false);
      try {
        setLoading(true);
        const res = await fetch(`/api/fdo/delete-department/${departmentId}`, {
          method: 'DELETE',
        });

        const data = await res.json();

        if (res.ok) {
          Swal.fire('Deleted!', data.message, 'success');
          // refreshDepartments(); // <-- call a prop function to refresh list
        } else {
          Swal.fire('Error!', data.error || 'Something went wrong.', 'error');
        }
      } catch (error) {
        Swal.fire('Error!', 'Network error or server issue.', 'error');
      } finally {
        fetchRoomsSummary();
        setLoading(false);
      }
    // }
  };


  // Handler to add/upsert a department via the API endpoint.
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        departmentName: newDept.name,
        doctorCount: Number(newDept.doctorCount),
        patientCount: Number(newDept.patientCount),
        premiumRoomCount: Number(newDept.rooms.premium),
        executiveRoomCount: Number(newDept.rooms.executive),
        basicRoomCount: Number(newDept.rooms.basic),
      };

      const response = await fetch("/api/fdo/upsert-department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        MySwal.fire({
          icon: "error",
          title: "Error upserting department",
          text: errorData.error,
        });
        return;
      }

      await response.json();
      MySwal.fire({
        icon: "success",
        title: "Department upserted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      await fetchRoomsSummary();
      setShowAddModal(false);
      // Reset the Add Department form.
      setNewDept({
        name: "",
        doctorCount: "",
        patientCount: "",
        rooms: { premium: "", executive: "", basic: "" },
      });
    } catch (error) {
      console.error("Error while upserting department:", error);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
          Departments
        </h1>
        <Button gradientDuoTone="purpleToBlue" onClick={() => setShowAddModal(true)}>
          Add Department
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Doctors
          </h2>
          <p className="mt-2 bg-green-300 dark:bg-green-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxDoc ? metrics.maxDoc.name : "N/A"} ({metrics.maxDoc?.doctorCount} doctors)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Minimum Doctors
          </h2>
          <p className="mt-2 bg-red-400 dark:bg-red-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.minDoc ? metrics.minDoc.name : "N/A"} ({metrics.minDoc?.doctorCount} doctors)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Rooms
          </h2>
          <p className="mt-2 bg-yellow-300 dark:bg-yellow-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxRooms ? metrics.maxRooms.name : "N/A"} ({metrics.maxRooms ? 
              metrics.maxRooms.rooms.premium + metrics.maxRooms.rooms.executive + metrics.maxRooms.rooms.basic 
              : 0} rooms)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Minimum Rooms
          </h2>
          <p className="mt-2 bg-green-300 dark:bg-green-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.minRooms ? metrics.minRooms.name : "N/A"} ({metrics.minRooms ? 
              metrics.minRooms.rooms.premium + metrics.minRooms.rooms.executive + metrics.minRooms.rooms.basic 
              : 0} rooms)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Patients
          </h2>
          <p className="mt-2 bg-red-400 dark:bg-red-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxPat ? metrics.maxPat.name : "N/A"} ({metrics.maxPat?.patientCount} patients)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl hover:shadow-slate-500">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Minimum Patients
          </h2>
          <p className="mt-2 bg-green-300 dark:bg-green-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.minPat ? metrics.minPat.name : "N/A"} ({metrics.minPat?.patientCount} patients)
          </p>
        </Card>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {departments.map((dept) => {
          const totalRooms =
            Number(dept.rooms.premium) + Number(dept.rooms.executive) + Number(dept.rooms.basic);
          return (
            <Card
              key={dept.id}
              className="relative bg-sky-50 dark:bg-gray-800 shadow-lg shadow-slate-500 dark:shadow-slate-700 overflow-hidden transition-all duration-700 ease-in-out group p-4"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>
              {/* Delete Button */}
              <button
                color="failure"
                onClick={() => openDeleteModal(dept)}
                className="absolute top-2 right-2 z-10 bg-slate-500 text-white rounded-md p-[1px]"
              >
                <TrashIcon />
              </button>
              {/* Card Content */}
              <div className="relative flex flex-col items-center z-10">
                {/* Icon in Center */}
                <div className="mb-2 group-hover:text-white transition-colors duration-700 bg-sky-200 p-1 rounded-md">
                  {dept.icon}
                </div>
                {/* Department Name */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors duration-700">
                  {dept.name}
                </h3>
                {/* Total Room Count */}
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-700">
                  Total Rooms: <span className="font-semibold">{totalRooms}</span>
                </p>
                {/* Room Breakdown */}
                <div className="mt-1 text-center text-xs">
                  <p className="text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-700">
                    Premium: <span className="font-semibold">{dept.rooms.premium}</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-700">
                    Executive: <span className="font-semibold">{dept.rooms.executive}</span>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-700">
                    Basic: <span className="font-semibold">{dept.rooms.basic}</span>
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Department Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Add Department</h2>
            <div>
              <Label htmlFor="deptName" value="Department Name" />
              <TextInput
                id="deptName"
                name="name"
                placeholder="Department Name"
                value={newDept.name}
                onChange={handleNewDeptChange}
              />
            </div>
            <div>
              <Label htmlFor="doctorCount" value="Doctor Count" />
              <TextInput
                id="doctorCount"
                name="doctorCount"
                type="number"
                placeholder="Number of Doctors"
                value={newDept.doctorCount}
                onChange={handleNewDeptChange}
              />
            </div>
            <div>
              <Label htmlFor="patientCount" value="Patient Count" />
              <TextInput
                id="patientCount"
                name="patientCount"
                type="number"
                placeholder="Number of Patients"
                value={newDept.patientCount}
                onChange={handleNewDeptChange}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="premium" value="Premium Rooms" />
                <TextInput
                  id="premium"
                  name="premium"
                  type="number"
                  placeholder="0"
                  value={newDept.rooms.premium}
                  onChange={handleNewDeptChange}
                />
              </div>
              <div>
                <Label htmlFor="executive" value="Executive Rooms" />
                <TextInput
                  id="executive"
                  name="executive"
                  type="number"
                  placeholder="0"
                  value={newDept.rooms.executive}
                  onChange={handleNewDeptChange}
                />
              </div>
              <div>
                <Label htmlFor="basic" value="Basic Rooms" />
                <TextInput
                  id="basic"
                  name="basic"
                  type="number"
                  placeholder="0"
                  value={newDept.rooms.basic}
                  onChange={handleNewDeptChange}
                />
              </div>
            </div>
            <Button 
              gradientDuoTone="purpleToBlue" 
              onClick={handleAddDepartment}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Department"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <TrashIcon className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the {selectedDept?.name} department?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(selectedDept.id)}>
               {loading ? "Deleting..." : "Yes I' am Sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
