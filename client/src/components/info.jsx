/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Label, TextInput, Select, HelperText } from "flowbite-react";

const Info = ({ data, setData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <form className="space-y-6">
      <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-300">
        Basic Info
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Please provide your basic information.
      </p>
      
      <div>
        <Label htmlFor="name" value="Name" />
        <TextInput
          id="name"
          name="name"
          placeholder="John Doe"
          value={data.name || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        {errors.name && (
          <HelperText color="failure">{errors.name}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="username" value="Username" />
        <TextInput
          id="username"
          name="username"
          placeholder="johndoe"
          value={data.username || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        {errors.username && (
          <HelperText color="failure">{errors.username}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="email" value="Email" />
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={data.email || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        {errors.email && (
          <HelperText color="failure">{errors.email}</HelperText>
        )}
      </div>
      <div>
        <Label htmlFor="mobile" value="Contact no" />
        <TextInput
          id="mobile"
          name="mobile"
          // type="email"
          placeholder="9897.."
          value={data.mobile || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        {errors.mobile && (
          <HelperText color="failure">{errors.mobile}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="gender" value="Gender" />
        <Select
          id="gender"
          name="gender"
          value={data.gender || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </Select>
        {errors.gender && (
          <HelperText color="failure">{errors.gender}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="dob" value="Date of Birth" />
        <TextInput
          id="dob"
          name="dob"
          type="date"
          value={data.dob || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        />
        {errors.dob && (
          <HelperText color="failure">{errors.dob}</HelperText>
        )}
      </div>
    </form>
  );
};

export default Info;
