/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Label, TextInput, HelperText } from "flowbite-react";
import { Briefcase, User, Stethoscope, ClipboardList } from "lucide-react";

const Role = ({ data, setData, errors }) => {
  const handleChange = (e) => {
    const { id } = e.currentTarget;
    setData((prev) => ({ ...prev, role: id, specialization: "" }));
  };

  const roleIcons = {
    Admin: <Briefcase className="w-10 h-10 text-blue-500" />,
    "Front Desk Operator": <User className="w-10 h-10 text-green-500" />,
    Doctor: <Stethoscope className="w-10 h-10 text-red-500" />,
    "Data Entry Operator": <ClipboardList className="w-10 h-10 text-purple-500" />,
  };

  const roles = ["Admin", "Front Desk Operator", "Doctor", "Data Entry Operator"].map(
    (role) => (
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
            <TextInput
              name="specialization"
              placeholder="Enter Specialization"
              value={data.specialization || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, specialization: e.target.value }))
              }
              className="mt-2 w-full dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
          ) : (
            data.role === role && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                No additional details required
              </p>
            )
          )}
        </label>
      </div>
    )
  );

  return (
    <form className="space-y-6">
      <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-300">
        Select your role
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Please select your role. If you are a doctor, kindly provide your specialization.
      </p>
      <div className="grid grid-cols-2 gap-4">{roles}</div>
      {errors.role && <HelperText color="failure">{errors.role}</HelperText>}
    </form>
  );
};

export default Role;
