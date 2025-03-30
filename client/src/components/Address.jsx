/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Label, TextInput, HelperText } from "flowbite-react";

const Address = ({ data, setData, errors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  return (
    <form className="space-y-6">
      <h2 className="text-3xl font-semibold text-blue-900 dark:text-blue-300">
        Address Details
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Please provide your address information.
      </p>

      <div>
        <Label htmlFor="pincode" value="Pincode" />
        <TextInput
          id="pincode"
          name="pincode"
          placeholder="123456"
          value={data.pincode || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        {errors.pincode && (
          <HelperText color="failure">{errors.pincode}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="street" value="Street" />
        <TextInput
          id="street"
          name="street"
          placeholder="Street name"
          value={data.street || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        {errors.street && (
          <HelperText color="failure">{errors.street}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="city" value="City" />
        <TextInput
          id="city"
          name="city"
          placeholder="City"
          value={data.city || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        {errors.city && (
          <HelperText color="failure">{errors.city}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="state" value="State" />
        <TextInput
          id="state"
          name="state"
          placeholder="State"
          value={data.state || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        {errors.state && (
          <HelperText color="failure">{errors.state}</HelperText>
        )}
      </div>

      <div>
        <Label htmlFor="country" value="Country" />
        <TextInput
          id="country"
          name="country"
          placeholder="Country"
          value={data.country || ""}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        {errors.country && (
          <HelperText color="failure">{errors.country}</HelperText>
        )}
      </div>
    </form>
  );
};

export default Address;
