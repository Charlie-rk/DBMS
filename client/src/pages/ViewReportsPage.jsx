/* eslint-disable no-unused-vars */
// src/pages/ViewReportsPage.jsx
import React, { useState, useEffect } from 'react';

export default function ViewReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch reports from the backend API
  useEffect(() => {
    fetch('/api/deo/reports')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setReports(data.reports);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching reports:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Open PDF in a new browser tab
  const openPdf = (pdfLink) => {
    window.open(pdfLink, '_blank');
  };

  if (loading) {
    return <div>Loading reports...</div>;
  }

  if (error) {
    return <div>Error loading reports: {error.message}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        View Reports
      </h2>
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">
              Report ID
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">
              Patient ID
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">
              Title
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">
              Created At
            </th>
            <th className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-left text-gray-800 dark:text-gray-200">
              PDF
            </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {report.id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {report.patient_id}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {report.title}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {new Date(report.created_at).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openPdf(report.report_link)}
                  className="text-blue-500 hover:underline"
                >
                  View PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
