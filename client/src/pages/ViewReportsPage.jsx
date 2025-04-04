// src/pages/ViewReportsPage.jsx
import React from 'react';

export default function ViewReportsPage() {
  // Dummy data – in a real app, fetch this from your backend
  const reports = [
    {
      id: 'RPT001',
      patientId: 'P123',
      title: 'X-Ray Report',
      date: '2025-04-10',
      pdfLink:
        'https://firebasestorage.googleapis.com/v0/b/pdfupload-4e62e.appspot.com/o/reports%2FBank_deatils.pdf?alt=media&token=aef7eda4-0c94-4522-a789-ffccf0736e24',
    },
    {
      id: 'RPT002',
      patientId: 'P124',
      title: 'MRI Report',
      date: '2025-04-11',
      pdfLink:
        'https://firebasestorage.googleapis.com/v0/b/pdfupload-4e62e.appspot.com/o/reports%2FBank_deatils.pdf?alt=media&token=aef7eda4-0c94-4522-a789-ffccf0736e24',
    },
    {
      id: 'RPT003',
      patientId: 'P125',
      title: 'Blood Test Report',
      date: '2025-04-12',
      pdfLink:
        'https://firebasestorage.googleapis.com/v0/b/pdfupload-4e62e.appspot.com/o/reports%2FBank_deatils.pdf?alt=media&token=aef7eda4-0c94-4522-a789-ffccf0736e24',
    },
  ];

  // Open PDF in a new browser tab
  const openPdf = (pdfLink) => {
    window.open(pdfLink, '_blank');
  };

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
              Date
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
                {report.patientId}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {report.title}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {report.date}
              </td>
              <td className="py-2 px-4 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => openPdf(report.pdfLink)}
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
