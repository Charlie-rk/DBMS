/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// src/components/MultiStepForm/index.jsx
import { Backdrop } from "@mui/material";
import { Button } from "flowbite-react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CustomSpinner from "../CustomSpinner";

const MySwal = withReactContent(Swal);

const MultiStepForm = ({ steps, initialValue, SuccessPage }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [multiStepFormData, setMultiStepFormData] = useState(initialValue || {});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Dummy function to send form data to a backend endpoint
  const sendFormData = async (data) => {
    // console.log(data);
    const response = await fetch("/api/admin/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    // console.log("Success:", result);
    return result;
  };

  // Inline validation function for each step
  const validateStep = () => {
    let errs = {};
    if (currentStep === 0) {
      // Info step validation
      if (!multiStepFormData.name || multiStepFormData.name.length < 3) {
        errs.name = "Name must be at least 3 characters";
      }
      if (!multiStepFormData.username || multiStepFormData.username.length < 3) {
        errs.username = "Username must be at least 3 characters";
      }
      if (!multiStepFormData.email) {
        errs.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(multiStepFormData.email)) {
        errs.email = "Email is invalid";
      }
      if (!multiStepFormData.mobile) {
        errs.mobile = "Please provide contact no.";
      }
      if (!multiStepFormData.gender) {
        errs.gender = "Select a gender";
      }
      if (!multiStepFormData.dob) {
        errs.dob = "Date of birth is required";
      }
    } else if (currentStep === 1) {
      // Address step validation
      if (!multiStepFormData.pin_code) {
        errs.pin_code = "Pincode is required";
      }
      if (!multiStepFormData.street) {
        errs.street = "Street is required";
      }
      if (!multiStepFormData.city) {
        errs.city = "City is required";
      }
      if (!multiStepFormData.state) {
        errs.state = "State is required";
      }
      if (!multiStepFormData.country) {
        errs.country = "Country is required";
      }
    } else if (currentStep === 2) {
      // Role step validation
      if (!multiStepFormData.role) {
        errs.role = "Select a role";
      }
      // Additional check for doctor-specific inputs if role is Doctor
      if (multiStepFormData.role === "Doctor") {
        if (!multiStepFormData.department) {
          errs.department = "Department is required";
        }
        if (!multiStepFormData.specialization || multiStepFormData.specialization.length < 3) {
          errs.specialization = "Specialization must be at least 3 characters";
        }
        if (!multiStepFormData.experience) {
          errs.experience = "Years of Experience is required";
        }
      }
    }
    return errs;
  };

  // Overall validation before calling backend (checks all important fields)
  const validateAllFields = () => {
    const missingFields = [];
    // Basic required fields
    if (!multiStepFormData.name) missingFields.push("name");
    if (!multiStepFormData.username) missingFields.push("username");
    if (!multiStepFormData.email) missingFields.push("email");
    if (!multiStepFormData.mobile) missingFields.push("mobile");
    if (!multiStepFormData.gender) missingFields.push("gender");
    if (!multiStepFormData.dob) missingFields.push("dob");
    if (!multiStepFormData.pin_code) missingFields.push("pin_code");
    if (!multiStepFormData.street) missingFields.push("street");
    if (!multiStepFormData.city) missingFields.push("city");
    if (!multiStepFormData.state) missingFields.push("state");
    if (!multiStepFormData.country) missingFields.push("country");
    if (!multiStepFormData.role) missingFields.push("role");
    // Doctor-specific fields
    if (multiStepFormData.role === "Doctor") {
      if (!multiStepFormData.department) missingFields.push("department");
      if (!multiStepFormData.specialization) missingFields.push("specialization");
      if (!multiStepFormData.experience) missingFields.push("experience");
    }
    return missingFields;
  };

  const onFinalSubmit = async () => {
    // Check for missing fields before calling the backend
    const missing = validateAllFields();
    if (missing.length > 0) {
      MySwal.fire({
        icon: "error",
        title: "Incomplete Form",
        text: `Please fill in all required details: ${missing.join(", ")}`,
      });
      return;
    }
    
    setLoading(true);
    try {
      // Send all collected data to the backend endpoint
      await sendFormData(multiStepFormData);
      // If successful, update the submission state
      setHasSubmitted(true);
    } catch (error) {
      // console.error("Error submitting form data:", error);
      // Server error alert if backend responds with error
      MySwal.fire({
        icon: "error",
        title: "Server Error",
        text: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle moving to the next step (or submission at the final step)
  const handleNext = () => {
    const errs = validateStep();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Fire an alert for the current step if details are missing.
      MySwal.fire({
        icon: "error",
        title: "Incomplete Details",
        text: "Please fill in all required fields before proceeding.",
      });
      return;
    }
    setErrors({});
    if (currentStep === steps.length - 1) {
      onFinalSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle going back a step
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
    setErrors({});
  };

  // Reset function for "Start Over"
  const resetForm = () => {
    setMultiStepFormData(initialValue || {});
    setCurrentStep(0);
    setHasSubmitted(false);
    setErrors({});
  };

  const Component = steps[currentStep].Component;

  const stepsElement = steps.map((step, i) => {
    const isActive = currentStep === i;
    return (
      <div
        key={i}
        onClick={() => setCurrentStep(i)}
        className={`flex items-start gap-4 cursor-pointer p-2 rounded transition-colors duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-700 via-blue-00 to-blue-00 text-white shadow-blue-900 shadow-2xl drop-shadow-lg"
            : "bg-transparent text-white hover:bg-blue-500 hover:bg-opacity-20"
        }`}
      >
        <div
          className={`w-10 shadow-2xl drop-shadow-lg h-10 rounded-full border border-white flex items-center justify-center ${
            isActive ? "text-black font-semibold bg-blue-200" : ""
          }`}
        >
          {i + 1}
        </div>
        <div>
          <p className="text-xs">STEP {i + 1}</p>
          <h3 className="text-sm font-medium">{step.title}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-4 rounded-lg shadow-2xl shadow-blue-500 grid grid-cols-1 md:grid-cols-3 h-[700px] overflow-hidden">
      {/* Sidebar with background image and gradient overlay */}
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CustomSpinner />
        </Backdrop>
      )}
      <aside
        className="md:col-span-1 relative p-4 bg-cover bg-center rounded-lg shadow-2xl shadow-slate-700 h-full overflow-hidden"
        style={{
          backgroundImage:
            'url(https://images.pexels.com/photos/7659878/pexels-photo-7659878.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70 rounded-lg"></div>
        <div className="relative space-y-4 overflow-auto h-full">
          {stepsElement}
        </div>
      </aside>
      <div className="md:col-span-2 p-4 h-full flex flex-col overflow-hidden">
        {hasSubmitted ? (
          <div className="overflow-auto flex-grow">
            <SuccessPage resetForm={resetForm} />
          </div>
        ) : (
          <>
            <div className="overflow-auto flex-grow">
              <Component
                setData={setMultiStepFormData}
                data={multiStepFormData}
                errors={errors}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              {currentStep > 0 && (
                <Button
                  onClick={handlePrev}
                  outline
                  className="bg-gradient-to-r dark:from-slate-200 dark:to-slate-600 from-slate-900 to-slate-700 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
                >
                  Go Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                outline
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
                disabled={loading}
              >
                {currentStep === steps.length - 1 ? "Confirm" : "Next Step"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
