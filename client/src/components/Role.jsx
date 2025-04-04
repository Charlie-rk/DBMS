/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Label, TextInput, HelperText, Modal, Button } from "flowbite-react";
import { Briefcase, User, Stethoscope, ClipboardList } from "lucide-react";

const Role = ({ data, setData, errors }) => {
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { id } = e.currentTarget;
    // Reset doctor specific fields when role changes
    setData((prev) => ({
      ...prev,
      role: id,
      department: "",
      specialization: "",
      experience: "",
    }));
    if (id === "Doctor") {
      setShowModal(true);
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = () => {
    // You can perform validation here if needed before closing the modal
    setShowModal(false);
  };

  const roleIcons = {
    Admin: <Briefcase className="w-10 h-10 text-blue-500" />,
    "Front Desk Operator": <User className="w-10 h-10 text-green-500" />,
    Doctor: <Stethoscope className="w-10 h-10 text-red-500" />,
    "Data Entry Operator": (
      <ClipboardList className="w-10 h-10 text-purple-500" />
    ),
  };

  const roles = [
    "Admin",
    "Front Desk Operator",
    "Doctor",
    "Data Entry Operator",
  ].map((role) => (
    <div key={role} className="relative">
      <input
        type="radio"
        id={role}
        name="role"
        className="peer hidden"
        onChange={handleChange}
        checked={data.role === role}
      />
      <label
        htmlFor={role}
        tabIndex={0}
        className="flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200
          peer-checked:bg-blue-100 dark:peer-checked:bg-blue-800 
          peer-checked:border-blue-500 dark:peer-checked:border-blue-400
          shadow-md hover:shadow-lg
          text-gray-900 dark:text-gray-100"
      >
        {roleIcons[role]}
        <h4 className="text-lg font-medium capitalize mt-2">{role}</h4>
        {role === "Doctor" && data.role === "Doctor" ? (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Click to add details
          </p>
        ) : (
          data.role === role && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              No additional details required
            </p>
          )
        )}
      </label>
    </div>
  ));

  return (
    <>
      <form className="space-y-6">
        <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-300">
          Select your role
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Please select your role. If you are a doctor, kindly provide additional
          details.
        </p>
        <div className="grid grid-cols-2 gap-4">{roles}</div>
        {errors.role && <HelperText color="failure">{errors.role}</HelperText>}
      </form>

      {/* Modal for Doctor Details */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Doctor Details</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="department" value="Department" />
              <TextInput
                id="department"
                name="department"
                placeholder="Enter Department"
                value={data.department || ""}
                onChange={handleModalChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="specialization" value="Specialization" />
              <TextInput
                id="specialization"
                name="specialization"
                placeholder="Enter Specialization"
                value={data.specialization || ""}
                onChange={handleModalChange}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="experience" value="Years of Experience" />
              <TextInput
                id="experience"
                name="experience"
                placeholder="Enter Years of Experience"
                value={data.experience || ""}
                onChange={handleModalChange}
                className="mt-1"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowModal(false)} color="gray">
            Cancel
          </Button>
          <Button onClick={handleModalSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Role;
