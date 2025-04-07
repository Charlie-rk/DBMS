/* eslint-disable no-unused-vars */
// src/pages/TestDataEntryPage.jsx
import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);
export default function TestDataEntryPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    deo:currentUser.username,
    patientId: '',
    doctor:'',
    testType: '',
    testResult: '',
    testDate: '',
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    // const numericPatientId = Number(formData.patientId);
    e.preventDefault();
    // Basic validation: ensure all fields are filled.
    if (
      !formData.patientId ||
      !formData.doctor ||
      !formData.testType ||
      !formData.testResult ||
      !formData.testDate
    ) {
      MySwal.fire({
        icon: "error",
        title: "Please fill all required fields.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }
    setLoading(true);
    try {
      const numericPatientId = Number(formData.patientId);
      const response = await fetch('/api/deo/test-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deo: formData.deo,
          patientId: numericPatientId,
          testType: formData.testType,
          testResult: formData.testResult,
          testDate: formData.testDate,
          doctorUsername: formData.doctor,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        MySwal.fire({
          icon: "error",
          title: data.error || "Failed to submit test data.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: data.message || "Test data entered successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        // Reset the form fields after a successful submission.
        setFormData({
          deo: currentUser.username,
          patientId: '',
          doctor: '',
          testType: '',
          testResult: '',
          testDate: '',
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Network error. Please try again later.",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Test Data Entry
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Doctor (username):
          </label>
          <input
            type="text"
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Type (e.g., X-ray, MRI):
          </label>
          <input
            type="text"
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Result/Report:
          </label>
          <textarea
            name="testResult"
            value={formData.testResult}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Test Date:
          </label>
          <input
            type="date"
            name="testDate"
            value={formData.testDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <Button
          type="submit"
          outline
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          {loading ? 'Submitting...' : 'Submit Test Data'}
        </Button>
      </form>
    </div>
  );
}