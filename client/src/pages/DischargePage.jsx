/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

function DischargePage() {
  const { currentUser } = useSelector((state) => state.user);
  const [dischargeData, setDischargeData] = useState({
    patientId: '',
    dischargeDate: '',
    remarks: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDischargeData({ ...dischargeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields.
    if (!dischargeData.patientId || !dischargeData.dischargeDate) {
      MySwal.fire({
        icon: "error",
        title: "Patient ID and Discharge Date are required.",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);

    try {
      // Convert patientId to number to avoid type issues.
      const numericPatientId = Number(dischargeData.patientId);

      const response = await fetch('/api/fdo/discharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fdo: currentUser.username,
          patientId: numericPatientId,
          dischargeDate: dischargeData.dischargeDate,
          remarks: dischargeData.remarks,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        MySwal.fire({
          icon: "error",
          title: data.error || "Discharge failed",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        MySwal.fire({
          icon: "success",
          title: data.message || "Patient discharged successfully",
          timer: 1500,
          showConfirmButton: false,
        });
        // Reset the form
        setDischargeData({
          patientId: '',
          dischargeDate: '',
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-slate-600 ">
      
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Patient Discharge
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            name="patientId"
            value={dischargeData.patientId}
            onChange={handleChange}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Discharge Date:
          </label>
          <input
            type="date"
            name="dischargeDate"
            value={dischargeData.dischargeDate}
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
            value={dischargeData.remarks}
            onChange={handleChange}
            rows="3"
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          ></textarea>
        </div>
        <Button
          type="submit"
          outline
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          {loading ? 'Discharging...' : 'Discharge Patient'}
        </Button>
      </form>
    </div>
  );
}

export default DischargePage;
