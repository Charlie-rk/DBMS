/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function TreatmentDataEntryPage() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    deo: currentUser.username,
    patientId: '',
    doctor: '',
    drugName: '',
    dosage: '',
    treatmentDate: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (
      !formData.patientId ||
      !formData.doctor ||
      !formData.dosage ||
      !formData.treatmentDate
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
      const response = await fetch('/api/deo/treatment-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deo: formData.deo,
          patientId: numericPatientId,
          dosage: formData.dosage,
          drug:formData.drugName,
          treatmentDate: formData.treatmentDate,
          prescribedBy: formData.doctor,
          remarks: formData.remarks
        })
      });

      const data = await response.json();

      if (!response.ok) {
        MySwal.fire({
          icon: "error",
          title: data.error || "Failed to submit treatment data.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: data.message || "Treatment data entered successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
        // Reset the form after successful submission
        setFormData({
          deo: currentUser.username,
          patientId: '',
          doctor: '',
          drugName: '',
          dosage: '',
          treatmentDate: '',
          remarks: '',
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
        Treatment Data Entry
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
            Drug Name:
          </label>
          <input
            type="text"
            name="drugName"
            value={formData.drugName}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Dosage:
          </label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Treatment Date:
          </label>
          <input
            type="date"
            name="treatmentDate"
            value={formData.treatmentDate}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Remarks:
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
        <Button
          type="submit"
          outline
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          {loading ? 'Submitting...' : 'Submit Treatment Data'}
        </Button>
      </form>
    </div>
  );
}
