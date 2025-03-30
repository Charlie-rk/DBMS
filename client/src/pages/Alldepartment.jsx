/* eslint-disable react/no-unescaped-entities */
// src/pages/DepartmentsPage.jsx
import React, { useState, useMemo } from "react";
import { Card, Button, Modal, TextInput, Label } from "flowbite-react";
import { Trash2 as TrashIcon, HeartPulse, Zap, Briefcase } from "lucide-react";

const dummyDepartments = [
  {
    id: 1,
    name: "Cardiology",
    doctorCount: 10,
    patientCount: 100,
    rooms: { premium: 5, executive: 10, basic: 15 },
    icon: <HeartPulse className="w-8 h-8 text-red-500" />,
  },
  {
    id: 2,
    name: "Neurology",
    doctorCount: 7,
    patientCount: 80,
    rooms: { premium: 3, executive: 5, basic: 12 },
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
  },
  {
    id: 3,
    name: "Orthopedics",
    doctorCount: 15,
    patientCount: 150,
    rooms: { premium: 8, executive: 12, basic: 20 },
    icon: <Briefcase className="w-8 h-8 text-blue-500" />,
  },
  {
    id: 4,
    name: "Radiology",
    doctorCount: 9,
    patientCount: 95,
    rooms: { premium: 4, executive: 8, basic: 10 },
    icon: <Zap className="w-8 h-8 text-green-500" />,
  },
  {
    id: 5,
    name: "Oncology",
    doctorCount: 11,
    patientCount: 110,
    rooms: { premium: 6, executive: 9, basic: 14 },
    icon: <HeartPulse className="w-8 h-8 text-pink-500" />,
  },
  {
    id: 6,
    name: "Pediatrics",
    doctorCount: 8,
    patientCount: 90,
    rooms: { premium: 3, executive: 7, basic: 11 },
    icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
  },
  {
    id: 7,
    name: "Dermatology",
    doctorCount: 6,
    patientCount: 70,
    rooms: { premium: 2, executive: 4, basic: 8 },
    icon: <HeartPulse className="w-8 h-8 text-purple-500" />,
  },
  {
    id: 8,
    name: "Gastroenterology",
    doctorCount: 12,
    patientCount: 130,
    rooms: { premium: 7, executive: 10, basic: 16 },
    icon: <Zap className="w-8 h-8 text-orange-500" />,
  },
  {
    id: 9,
    name: "Urology",
    doctorCount: 5,
    patientCount: 60,
    rooms: { premium: 2, executive: 3, basic: 5 },
    icon: <Briefcase className="w-8 h-8 text-teal-500" />,
  },
  {
    id: 10,
    name: "ENT",
    doctorCount: 8,
    patientCount: 85,
    rooms: { premium: 3, executive: 6, basic: 9 },
    icon: <HeartPulse className="w-8 h-8 text-red-500" />,
  },
];

export default function Alldepartment() {
  const [departments, setDepartments] = useState(dummyDepartments);
  const [showModal, setShowModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDept, setNewDept] = useState({
    name: "",
    doctorCount: "",
    patientCount: "",
    rooms: { premium: "", executive: "", basic: "" },
  });

  // Compute metrics using useMemo
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

  const handleDelete = (deptId) => {
    setDepartments(departments.filter((dept) => dept.id !== deptId));
    setShowModal(false);
  };

  // Handlers for the Add Department modal form
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

  const handleAddDepartment = (e) => {
    e.preventDefault();
    // Assign a new id, e.g., using current timestamp
    const newId = Date.now();
    const deptToAdd = {
      id: newId,
      name: newDept.name,
      doctorCount: Number(newDept.doctorCount),
      patientCount: Number(newDept.patientCount),
      rooms: {
        premium: Number(newDept.rooms.premium),
        executive: Number(newDept.rooms.executive),
        basic: Number(newDept.rooms.basic),
      },
      // For simplicity, assign a default icon – you might later allow choosing an icon.
      icon: <Briefcase className="w-8 h-8 text-indigo-500" />,
    };
    setDepartments([...departments, deptToAdd]);
    setShowAddModal(false);
    // Reset form
    setNewDept({
      name: "",
      doctorCount: "",
      patientCount: "",
      rooms: { premium: "", executive: "", basic: "" },
    });
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
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Doctors
          </h2>
          <p className="mt-2 bg-green-300 dark:bg-green-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxDoc ? metrics.maxDoc.name : "N/A"} ({metrics.maxDoc?.doctorCount} doctors)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Minimum Doctors
          </h2>
          <p className="mt-2 bg-red-400 dark:bg-red-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.minDoc ? metrics.minDoc.name : "N/A"} ({metrics.minDoc?.doctorCount} doctors)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Rooms
          </h2>
          <p className="mt-2 bg-yellow-300 dark:bg-yellow-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxRooms ? metrics.maxRooms.name : "N/A"} ({metrics.maxRooms ? 
              metrics.maxRooms.rooms.premium + metrics.maxRooms.rooms.executive + metrics.maxRooms.rooms.basic 
              : 0} rooms)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Minimum Rooms
          </h2>
          <p className="mt-2 bg-green-300 dark:bg-green-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.minRooms ? metrics.minRooms.name : "N/A"} ({metrics.minRooms ? 
              metrics.minRooms.rooms.premium + metrics.minRooms.rooms.executive + metrics.minRooms.rooms.basic 
              : 0} rooms)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Department with Maximum Patients
          </h2>
          <p className="mt-2 bg-red-400 dark:bg-red-700 rounded-md w-2/3 px-1 text-black dark:text-gray-300">
            {metrics.maxPat ? metrics.maxPat.name : "N/A"} ({metrics.maxPat?.patientCount} patients)
          </p>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-4 shadow-2xl">
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
              <Button
                color="failure"
                onClick={() => openDeleteModal(dept)}
                className="absolute top-2 right-2 z-10"
              >
                <TrashIcon />
              </Button>
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
            <Button gradientDuoTone="purpleToBlue" onClick={handleAddDepartment}>
              Add Department
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
                Yes, I'm sure
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

// function TrashIcon() {
//   return (
//     <svg
//       className="w-5 h-5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6" />
//     </svg>
//   );
// }

// export default DepartmentsPage;
