/* eslint-disable no-unused-vars */
import React from 'react'
// import MultiStepForm from "./components/MultiStepForm";
import MultiStepForm from "../components/MutiStepForm";
import { steps, SuccessPage } from "./steps";

export default function Form() {
    const initialValue = {
        name: "",
        username: "",
        email: "",
        gender: "",
        dob: "",
        pincode: "",
        street: "",
        city: "",
        state: "",
        country: "",
        role: "",
        specialization: "",
      };
      const handleSubmit = (data) => {
        console.log("Form Submitted:", data);
      };
  return (
    <div className="container mx-auto p-4">
      <MultiStepForm
        steps={steps}
        handleSubmit={handleSubmit}
        initialValue={initialValue}
        SuccessPage={SuccessPage}
      />
    </div>
  )
}
