/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Badge, Dropdown, Table } from "flowbite-react";
import {
  Bed,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import ReportCard from "../components/ReportCard";
import PatientsOverview from "../components/PatientsOverview";
import CustomSpinner from "../components/CustomSpinner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const AdminMenu = () => {
  // State for dashboard summary (top cards)
  const [dashSummary, setDashSummary] = useState(null);
  const [globalLoading, setGlobalLoading] = useState(true);

  // State for recent patients (table)
  const [recentPatients, setRecentPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  // Fetch dashboard summary data
  useEffect(() => {
    setGlobalLoading(true);
    fetch("/api/admin/dash-summary", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network error while fetching dashboard summary");
        }
        return response.json();
      })
      .then((data) => {
        setDashSummary(data);
        setGlobalLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching patients:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch patients. Please try again.",
        });
        setGlobalLoading(false);
      });
  }, []);

  // Fetch recent patients data
  useEffect(() => {
    setPatientsLoading(true);
    fetch("/api/fdo/recent-patients", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching recent patients");
        }
        return response.json();
      })
      .then((data) => {
        setRecentPatients(data.patients);
        setPatientsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching recent patients:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch recent patients. Please try again.",
        });
        setPatientsLoading(false);
      });
  }, []);

  // Export recent patients data as CSV
  const handleExportCSV = () => {
    if (recentPatients && recentPatients.length > 0) {
      const header = ["Name", "Visit No", "Mobile", "Admission Date", "Status"];
      const rows = recentPatients.map((patient) => [
        patient.name,
        patient.visit_no,
        patient.mobile,
        new Date(patient.created_at).toLocaleDateString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        patient.status,
      ]);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [header.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "recent_patients.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const navigate = useNavigate();

  // Optionally, you can implement handleViewAll and handleImportData or remove them.
  const handleViewAll = () => {
    // Implementation can be added to navigate to all patient details.
  navigate("/admin/all-patient")
    console.log("View All clicked");
  };

  const handleImportData = () => {
    // Implementation for data import can be added here.
    console.log("Import Data clicked");
  };

  if (globalLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CustomSpinner />
      </Backdrop>
    );
  }

  if (!dashSummary) {
    return null;
  }

  const { dateRange, beds, doctors, patients, dailyFlow } = dashSummary;
  const breakdown = beds.breakdown;
  const breakdownText = `Executive: ${breakdown.Executive.total}, Premium: ${breakdown.Premium.total}, General: ${breakdown.General.total}, Basic: ${breakdown.Basic.total}.`;

  // Compute date range (e.g., "2024-2025")
  const startYear = new Date(dateRange.startDate).getFullYear();
  const endYear = new Date(dateRange.endDate).getFullYear();

  // Compute patient trend percentage increase.
  const trendIncrease =
    patients.oldPatients > 0
      ? Math.round(((patients.newPatients - patients.oldPatients) / patients.oldPatients) * 100)
      : (patients.newPatients > 0 ? 100 : 0);

  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Card 1: Total Beds */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="bg-sky-200 dark:bg-sky-600 rounded-lg px-[4px] text-md font-semibold text-gray-800 dark:text-gray-200">
              Total Beds
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">Current</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Bed size={28} className="text-blue-500" />
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {beds.availableBeds}
                </span>
                <p className="text-sm text-gray-500 dark:text-white">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">
                {beds.occupiedBeds}
              </span>
              <p className="text-sm text-gray-500 dark:text-white">Occupied</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            {breakdownText}
          </p>
        </Card>

        {/* Card 2: Doctors */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700">
          <div className="flex items-center justify-between mb-8">
            <h3 className="bg-sky-200 dark:bg-sky-600 rounded-lg px-[4px] text-md font-semibold text-gray-800 dark:text-gray-200">
              Doctors
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">Current</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Users size={28} className="text-blue-500" />
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {doctors.available}
                </span>
                <p className="text-sm text-gray-500 dark:text-white">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-600">
                {doctors.onLeave}
              </span>
              <p className="text-sm text-gray-500 dark:text-white">On Leave</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            Shows the current number of available doctors.
          </p>
        </Card>

        {/* Card 3: Patients */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="bg-sky-200 dark:bg-sky-600 rounded-lg px-[4px] text-md font-semibold text-gray-800 dark:text-gray-200">
              Patients
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">
              {startYear}-{endYear}
            </span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <UserPlus size={28} className="text-blue-500" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {patients.newPatients}
                  </span>
                  <Badge color="success">+{trendIncrease}%</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-white">New Patients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={28} className="text-orange-500" />
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {patients.oldPatients}
                </span>
                <p className="text-sm text-gray-500 dark:text-white">Old Patients</p>
              </div>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Gender</h4>
              <span className="text-sm text-gray-400 dark:text-white">
                {startYear}-{endYear}
              </span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-blue-400 border-t-orange-400 relative flex items-center justify-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">Chart</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">
                Man: <strong>{patients.gender.malePercentage}%</strong> ({patients.gender.maleCount})
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                Woman: <strong>{patients.gender.femalePercentage}%</strong> ({patients.gender.femaleCount})
              </p>
            </div>
          </div>
        </Card>

        {/* Card 4: Daily Patient Flow */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="bg-green-200 rounded-lg dark:bg-green-600 px-[4px] text-md font-semibold text-gray-800 dark:text-white">
              Daily Patient Flow
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">Today</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-green-600">
                {dailyFlow.admissions}
              </span>
              <p className="text-sm text-gray-500 dark:text-white">Admissions</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-red-600">
                {dailyFlow.discharges}
              </span>
              <p className="text-sm text-gray-500 dark:text-white">Discharges</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            Overall daily trend in admissions vs. discharges. Track occupancy changes
            and manage bed availability more effectively.
          </p>
        </Card>
      </div>

      {/* REPORT & PATIENTS OVERVIEW */}
      <div className="rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ReportCard />
        <PatientsOverview />
      </div>

      {/* RECENT PATIENTS TABLE */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl hover:shadow-slate-500 dark:shadow-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Recent Patients
          </h3>
          <div className="relative">
            <Dropdown label="Actions" color="light">
              <Dropdown.Item onClick={handleViewAll}>View All</Dropdown.Item>
              <Dropdown.Item onClick={handleExportCSV}>Export CSV</Dropdown.Item>
              {/* <Dropdown.Item onClick={handleImportData}>Import Data</Dropdown.Item> */}
            </Dropdown>
          </div>
        </div>
        {patientsLoading ? (
          <div className="p-4 flex justify-center">
            <CustomSpinner />
          </div>
        ) : (
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Visit No</Table.HeadCell>
              <Table.HeadCell>Mobile</Table.HeadCell>
              <Table.HeadCell>Admission Date</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {recentPatients.map((patient) => (
                <Table.Row key={patient.id}>
                  <Table.Cell>{patient.name}</Table.Cell>
                  <Table.Cell>{patient.visit_no}</Table.Cell>
                  <Table.Cell>{patient.mobile}</Table.Cell>
                  <Table.Cell>
                    {new Date(patient.created_at).toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={patient.status === "discharged" ? "success" : "warning"}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </Badge>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AdminMenu;
