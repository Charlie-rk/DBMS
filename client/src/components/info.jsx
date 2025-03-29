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
      <h2 className="text-3xl font-semibold text-blue-900">Basic Info</h2>
      <p className="text-gray-600">Please provide your basic information.</p>
      
      <div>
        <Label htmlFor="name" value="Name" />
        <TextInput
          id="name"
          name="name"
          placeholder="John Doe"
          value={data.name || ""}
          onChange={handleChange}
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
        />
        {errors.email && (
          <HelperText color="failure">{errors.email}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="gender" value="Gender" />
        <Select
          id="gender"
          name="gender"
          value={data.gender || ""}
          onChange={handleChange}
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
        />
        {errors.dob && (
          <HelperText color="failure">{errors.dob}</HelperText>
        )}
      </div>
    </form>
  );
};

export default Info;
