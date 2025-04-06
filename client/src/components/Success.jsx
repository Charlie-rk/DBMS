/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// src/components/Success.jsx
import React from "react";
import successImg from "/images/icon-thank-you.svg";
import { Button } from "flowbite-react";

const Success = ({ resetForm }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-6 bg-white dark:bg-gray-800">
      <img src={successImg} alt="Success" className="mb-6 w-20 h-auto" />
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Thank you!</h2>
      <p className="mb-6 text-gray-700 dark:text-gray-300 max-w-md">
        Thanks for confirming your submission! Your information has been submitted successfully.
        We hope you enjoy using our platform.
      </p>
      
      <Button
        outline
        onClick={resetForm}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
      >
        Start Over
      </Button>
    </div>
  );
};

export default Success;
