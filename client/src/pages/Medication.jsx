// src/pages/MedicationPage.jsx
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";

export default function Medication() {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this URL with your desired free API endpoint
    fetch("https://api.sampleapis.com/health/medications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: "medications" }), // Adjust payload as required by the API
      })
        .then((response) => response.json())
        .then((data) => {
          setMedications(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching medication data:", error);
          setLoading(false);
        });
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Medication Updates
      </h1>
      {loading ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          Loading medication updates...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medications.map((med, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                {med.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                {med.description || "No description available."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Source: {med.source || "Unknown"}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
