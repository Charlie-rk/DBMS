/* eslint-disable no-unused-vars */
import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage1 } from "../firebase"; // adjust the import path to your firebase config
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useSelector } from 'react-redux';

export default function UploadReportsPage() {
  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const MySwal = withReactContent(Swal);
  const { currentUser } = useSelector((state) => state.user);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if a file is selected
    if (!file) {
      MySwal.fire({
        icon: "error",
        title: "No File Selected",
        text: "Please select a PDF report to upload.",
      });
      return;
    }

    setLoading(true);

    // Create a reference for the file in Firebase Storage
    const fileRef = ref(storage1, `reports/${file.name}`);

    try {
      // Upload the file to Firebase Storage
      const snapshot = await uploadBytes(fileRef, file);

      // Retrieve the download URL of the uploaded file
      const downloadUrl = await getDownloadURL(snapshot.ref);
      console.log("Download URL:", downloadUrl);

      // Prepare the payload for the backend API
      const numericPatientId = Number(patientId);
      const payload = {
        deo: currentUser.username,
        patientId: numericPatientId,
        title,
        reportLink: downloadUrl,
      };

      // Send the download URL along with the patient ID to your backend
      const response = await fetch("/api/deo/upload-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        MySwal.fire({
          icon: "success",
          title: "Upload Successful",
          text: "Report uploaded successfully.",
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "Upload Failed",
          text: "Error uploading report to backend.",
        });
      }
    } catch (error) {
      MySwal.fire({
        icon: "error",
        title: "Upload Error",
        text: error.message,
      });
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-slate-600">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Upload Report
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Patient ID:
          </label>
          <input
            type="text"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
            required
          />
        </div>
       
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Title (X-rays,MRI):
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-700 p-2 rounded text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Select Report (PDF):
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <Button
          type="submit"
          outline
          disabled={loading}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800"
        >
          {loading ? "Uploading..." : "Upload Report"}
        </Button>
      </form>
    </div>
  );
}
