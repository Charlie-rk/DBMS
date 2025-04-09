/* eslint-disable react/no-unescaped-entities */
// src/pages/DataEntryOperators.jsx
import React, { useState, useMemo, useEffect } from "react";
import { Card, Button, Modal, TextInput, Textarea } from "flowbite-react";
import { Trash2 as TrashIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { RiMessage2Fill } from "react-icons/ri";

const MySwal = withReactContent(Swal);

export default function AllEDO() {
  const [operators, setOperators] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [showOperatorModal, setShowOperatorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // States for Message Modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Get current user from Redux store
  const { currentUser } = useSelector((state) => state.user);

  // Fetch Data Entry Operator data on component mount
  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await fetch("/api/admin/get-all-users?role=Data Entry Operator", {
          method: "GET",
        });
        const data = await response.json();
        // Map API response data to our expected structure
        const mappedOperators = data.users.map((op) => ({
          id: op.id,
          username: op.username,
          name: op.name,
          email: op.email,
          gender: op.gender,
          mobile: op.mobile,
          dob: op.dob,
          profile_picture: op.profile_picture,
          address: {
            street: op.street,
            city: op.city,
            pincode: op.pin_code,
          },
          salary: `$${parseInt(op.salary).toLocaleString()}`,
        }));
        setOperators(mappedOperators);
      } catch (error) {
        console.error("Error fetching data entry operators:", error);
      }
    };

    fetchOperators();
  }, []);

  // Filter operators based solely on the search query (by name)
  const filteredOperators = useMemo(() => {
    return operators.filter((op) =>
      op.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [operators, searchQuery]);

  // Open operator details modal
  const openOperatorModal = (op) => {
    setSelectedOperator(op);
    setShowOperatorModal(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (op) => {
    setSelectedOperator(op);
    setShowDeleteModal(true);
  };

  // Open message modal and reset fields
  const openMessageModal = (op) => {
    setSelectedOperator(op);
    setMessageSubject("");
    setMessageContent("");
    setShowMessageModal(true);
  };

  // Delete operator handler using the API endpoint
  const handleDelete = async (opUsername) => {
    try {
      const response = await fetch("/api/deo/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: opUsername }),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete user");
      }
      MySwal.fire({
        icon: "success",
        title: "Operator deleted successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      // Remove the operator from state upon successful deletion
      setOperators(operators.filter((op) => op.username !== opUsername));
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting operator:", error);
      MySwal.fire({
        icon: "error",
        title: "Error deleting operator!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  // Send message handler using the API endpoint
  const handleSendMessage = async () => {
    if (messageSubject === "" || messageContent === "") {
      MySwal.fire({
        icon: "error",
        title: "Please fill all the fields",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    try {
      const payload = {
        username: selectedOperator.username, // recipient operator username
        sender: currentUser.username, // current logged in user's username
        subject: messageSubject,
        message: messageContent,
      };

      const response = await fetch("/api/user/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to send message");
      }

      MySwal.fire({
        icon: "success",
        title: "Message Sent Successfully!",
        timer: 1500,
        showConfirmButton: false,
      });
      setShowMessageModal(false);
    } catch (error) {
      console.error("Error sending message:", error);
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
            Data Entry Operators List
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            Browse through all Data Entry Operators.
          </p>
        </div>
        <Button
          gradientDuoTone="purpleToBlue"
          onClick={() => navigate("/admin/add-user")}
        >
          Add New Operator
        </Button>
      </div>

      {/* Search Filter by Name */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <TextInput
          type="text"
          placeholder="Search operator name"
          className="w-64 dark:bg-gray-700 dark:text-gray-100"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Operator Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOperators.map((op) => (
          <Card
            key={op.id}
            className="relative bg-sky-50 dark:bg-gray-800 shadow-lg overflow-hidden transition-colors duration-700 ease-in-out group cursor-pointer hover:bg-gradient-to-r hover:from-blue-400 p-2 hover:to-sky-300 h-full shadow-slate-500 dark:shadow-slate-700"
            onClick={() => openOperatorModal(op)}
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openDeleteModal(op);
              }}
              className="absolute top-2 right-2 z-10 bg-slate-500 text-white p-[2px] rounded-lg"
            >
              <TrashIcon />
            </button>
            {/* Message Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                openMessageModal(op);
              }}
              className="absolute top-2 left-2 z-10 text-white p-[2px] rounded-lg"
            >
              <RiMessage2Fill className="text-slate-600 text-3xl"/>
            </button>
            {/* Card Content */}
            <div className="relative flex flex-col items-center z-10">
              {/* Operator Image */}
              <img
                src={op.profile_picture}
                alt={op.name}
                className="w-52 h-60 rounded-lg object-cover mb-2"
              />
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {op.mobile}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 group-hover:text-white transition-colors">
                {op.name}
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
                {op.email}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
                {op.salary}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Operator Details Modal */}
      <Modal
        show={showOperatorModal}
        onClose={() => setShowOperatorModal(false)}
        popup
        size="lg"
      >
        <Modal.Header />
        <Modal.Body>
          {selectedOperator && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <img
                  src={selectedOperator.profile_picture}
                  alt={selectedOperator.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-2">
                  {selectedOperator.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedOperator.email}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Contact Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Mobile: {selectedOperator.mobile}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Address
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedOperator.address.street}, {selectedOperator.address.city},{" "}
                  {selectedOperator.address.pincode}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Salary
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedOperator.salary}
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
              Are you sure you want to delete {selectedOperator?.name}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => handleDelete(selectedOperator.username)}
              >
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
          {selectedOperator && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Send Message to {selectedOperator.name}
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
