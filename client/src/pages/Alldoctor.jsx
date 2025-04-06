/* eslint-disable react/no-unescaped-entities */
// src/pages/HospitalDashboard.jsx
import React, { useState, useMemo } from "react";
import { Card, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { Trash2 as TrashIcon, MessageCircle as MessageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RiMessage2Fill } from "react-icons/ri";

const MySwal = withReactContent(Swal);

// Dummy data for doctors
const dummyDoctors = [
  {
    id: 1,
    name: "Dr. Nabilla Sp. PD",
    department: "Cardiology",
    specialization: "Interventional Cardiology",
    experience: 12,
    status: "online",
    image: "https://t4.ftcdn.net/jpg/02/60/04/09/240_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg",
    contact: { mobile: "9876543210", email: "nabilla@hospital.com" },
    address: {
      pincode: "123456",
      street: "123 Heartbeat Road",
      city: "Healthville",
    },
    salary: "$120,000",
  },
  {
    id: 2,
    name: "Dr. Ibrahim M. Kes, Sp.B",
    department: "Neurology",
    specialization: "Neurophysiology",
    experience: 8,
    status: "online",
    image: "https://t4.ftcdn.net/jpg/03/20/52/31/240_F_320523164_tx7Rdd7I2XDTvvKfz2oRuRpKOPE5z0ni.jpg",
    contact: { mobile: "9123456780", email: "ibrahim@hospital.com" },
    address: {
      pincode: "654321",
      street: "456 Brainwave Ave",
      city: "Mindtown",
    },
    salary: "$110,000",
    highlighted: true,
  },
  {
    id: 3,
    name: "Dr. Merlina Ha S. Psi, M.Psi",
    department: "Psychiatry",
    specialization: "Clinical Psychology",
    experience: 10,
    status: "offline",
    image: "https://t3.ftcdn.net/jpg/03/13/77/82/240_F_313778250_Y0o5can6MA490Nt7G6p03Zfu5fKmWCIv.jpg",
    contact: { mobile: "9988776655", email: "merlina@hospital.com" },
    address: {
      pincode: "112233",
      street: "789 Calm St",
      city: "Serenity",
    },
    salary: "$105,000",
  },
  {
    id: 4,
    name: "Dr. Arto Edmunds Sp.P",
    department: "Pulmonology",
    specialization: "Lung Specialist",
    experience: 9,
    status: "offline",
    image: "https://t4.ftcdn.net/jpg/01/37/44/03/240_F_137440378_5mMBNu4Xyxaj25zD8Ag8NQWsOkYKDeq8.jpg",
    contact: { mobile: "9876501234", email: "arto@hospital.com" },
    address: {
      pincode: "445566",
      street: "321 Breath Ln",
      city: "Aircity",
    },
    salary: "$115,000",
  },
  {
    id: 5,
    name: "Dr. Alexander Sp.B",
    department: "Surgery",
    specialization: "General Surgery",
    experience: 14,
    status: "online",
    image: "https://t3.ftcdn.net/jpg/01/30/45/54/240_F_130455409_fTuinPO1LXECv5hlk9VBREnL6yowYUo3.jpg",
    contact: { mobile: "9123456000", email: "alexander@hospital.com" },
    address: {
      pincode: "778899",
      street: "654 Scalpel Dr",
      city: "Surgiville",
    },
    salary: "$130,000",
  },
  // ... add more dummy doctors as needed (total 8-10)
];

export default function Alldoctor() {
  const [doctors, setDoctors] = useState(dummyDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // States for Message Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const [filterDept, setFilterDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Filter doctors based on department and search query
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesDept = filterDept === "All" || doc.department === filterDept;
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [doctors, filterDept, searchQuery]);

  // Open doctor details modal
  const openDoctorModal = (doc) => {
    setSelectedDoctor(doc);
    setShowDoctorModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (doc) => {
    setSelectedDoctor(doc);
    setShowDeleteModal(true);
  };

  // Open message modal and reset fields
  const openMessageModal = (doc) => {
    setSelectedDoctor(doc);
    setMessageSubject("");
    setMessageContent("");
    setShowMessageModal(true);
  };

  // Delete doctor handler
  const handleDelete = (docId) => {
    setDoctors(doctors.filter((doc) => doc.id !== docId));
    setShowDeleteModal(false);
  };

  // Send message handler (simulate API call)
  const handleSendMessage = async () => {
    // Simulate endpoint call - replace with your actual API call.
    try {
      if(messageSubject==""||messageContent==""){
        MySwal.fire({
          icon: "error",
          title: "Please fill all the Fields",
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      // For demonstration, we use a timeout to simulate an API call.
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      // You can use fetch/axios here to call your endpoint with:
      // { username: selectedDoctor.name, subject: messageSubject, message: messageContent }
      
      MySwal.fire({
        icon: "success",
        title: "Message Sent Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowMessageModal(false);
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Message Sending Failed!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Department &gt; Doctor List
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Browse through all doctors or filter by department.
          </p>
        </div>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => navigate("/admin/add-user")}
        >
          Add New Doctor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <select
            className="px-4 py-2 border rounded dark:bg-gray-700 dark:text-gray-100"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            {/* Assuming distinct departments from our dummy data */}
            {[...new Set(doctors.map((doc) => doc.department))].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <TextInput
            type="text"
            placeholder="Search doctor name"
            className="w-64 dark:bg-gray-700 dark:text-gray-100"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <Card
            key={doc.id}
            className="relative bg-sky-50 dark:bg-gray-800 shadow-lg overflow-hidden transition-colors duration-700 ease-in-out group cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 p-2 hover:to-sky-300 h-full shadow-slate-500 dark:shadow-slate-700"
            onClick={() => openDoctorModal(doc)}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(doc);
              }}
              className="absolute top-2 right-2 z-10 bg-slate-500 text-white p-[2px] rounded-lg"
            >
              <TrashIcon />
            </button>
            {/* Message Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openMessageModal(doc);
              }}
              className="absolute top-2 left-2 z-10 text-white p-[2px] rounded-lg"
            >
              <RiMessage2Fill  className="text-slate-600 text-3xl"/>
            </button>
            {/* Card Content */}
            <div className="relative flex flex-col items-center z-10">
              {/* Doctor Image */}
              <img
                src={doc.image}
                alt={doc.name}
                className="w-52 h-60 rounded-lg object-cover mb-2"
              />
              {/* Status Dot and Experience */}
              <div className="flex items-center space-x-2 mb-1">
                <span
                  className={`w-3 h-3 rounded-full ${
                    doc.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></span>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {doc.experience} yrs exp
                </span>
              </div>
              {/* Name with Department */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors ">
                {doc.name} <span className="text-sm">({doc.department})</span>
              </h3>
              {/* Specialization */}
              <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
                {doc.specialization}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Doctor Details Modal */}
      <Modal
        show={showDoctorModal}
        onClose={() => setShowDoctorModal(false)}
        popup
        size="lg"
      >
        <Modal.Header />
        <Modal.Body>
          {selectedDoctor && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
                  {selectedDoctor.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedDoctor.specialization} - {selectedDoctor.department}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Contact Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Mobile: {selectedDoctor.contact.mobile}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Email: {selectedDoctor.contact.email}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Address
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedDoctor.address.street},{" "}
                  {selectedDoctor.address.city},{" "}
                  {selectedDoctor.address.pincode}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Salary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedDoctor.salary}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <TrashIcon className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete the {selectedDoctor?.name} doctor?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(selectedDoctor.id)}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Message Modal */}
      <Modal
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          {selectedDoctor && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Send Message to {selectedDoctor.name}
              </h2>
              <div>
                <TextInput
                  id="subject"
                  placeholder="Subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  className="mb-4"
                />
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button color="gray" onClick={() => setShowMessageModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
