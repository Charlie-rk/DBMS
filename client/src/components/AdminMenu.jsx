/* eslint-disable no-unused-vars */
import React from "react";
import { Card, Badge, Dropdown, Table } from "flowbite-react";
import {
  Bed,
  Users,
  UserPlus,
  UserCheck,
} from "lucide-react";
import ReportCard from "../components/ReportCard";
import PatientsOverview from "../components/PatientsOverview";

const AdminMenu = () => {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {/* Card 1: Total Beds */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700 ">
          <div className="flex items-center justify-between mb-8">
            <h3 className="bg-sky-200 dark:bg-sky-600 rounded-lg px-[4px] text-md font-semibold text-gray-800 dark:text-gray-200">
              Total Beds
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">Current</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 ">
              <Bed size={28} className="text-blue-500" />
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  60
                </span>
                <p className="text-sm text-gray-500 dark:text-white">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-green-600">44</span>
              <p className="text-sm text-gray-500 dark:text-white">Occupied</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            12 Executive, 30 Premium, 18 Basic.
          </p>
        </Card>

        {/* Card 2: Doctors */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700  ">
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
                  46
                </span>
                <p className="text-sm text-gray-500 dark:text-white">Available</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-red-600">4</span>
              <p className="text-sm text-gray-500 dark:text-white">On Leave</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            Shows the current number of available doctors.
          </p>
        </Card>

        {/* Card 3: Patients */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700 ">
          <div className="flex items-center justify-between">
            <h3 className="bg-sky-200 dark:bg-sky-600 rounded-lg px-[4px] text-md font-semibold text-gray-800 dark:text-gray-200">Patient</h3>
            <span className="text-sm text-gray-400 dark:text-white">2019-2020</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <UserPlus size={28} className="text-blue-500" />
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">164</span>
                  <Badge color="success">+4%</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-white">New Patients</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck size={28} className="text-orange-500" />
              <div>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">253</span>
                <p className="text-sm text-gray-500 dark:text-white">Old Patients</p>
              </div>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Gender</h4>
              <span className="text-sm text-gray-400 dark:text-white">2019-2020</span>
            </div>
            <div className="w-14 h-14 rounded-full border-4 border-blue-400 border-t-orange-400 relative flex items-center justify-center">
              <span className="text-xs text-gray-600 dark:text-gray-300">Chart</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-white">
                Man: <strong>63%</strong> (1125)
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                Woman: <strong>37%</strong> (321)
              </p>
            </div>
          </div>
        </Card>

        {/* Card 4: Daily Patient Flow */}
        <Card className="bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="bg-green-200 rounded-lg dark:bg-green-600 px-[4px] text-md font-semibold text-gray-800 dark:text-white">
              Daily Patient Flow
            </h3>
            <span className="text-sm text-gray-400 dark:text-white">Today</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold text-green-600">35</span>
              <p className="text-sm text-gray-500 dark:text-white">Admissions</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xl font-bold text-red-600">29</span>
              <p className="text-sm text-gray-500 dark:text-white ">Discharges</p>
            </div>
          </div>
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          <p className="text-sm text-gray-500 dark:text-white">
            Overall daily trend in admissions vs. discharges. Track occupancy changes and manage bed availability more effectively.
          </p>
        </Card>
      </div>

      {/* REPORT & PATIENTS OVERVIEW */}
      <div className="rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 ">
        <ReportCard />
        <PatientsOverview />
      </div>

      {/* PATIENT DETAILS TABLE */}
      <Card className="bg-white dark:bg-gray-800 shadow-xl shadow-slate-400 dark:shadow-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Patients Detail Information
          </h3>
          <div className="relative">
            <Dropdown label="Actions" color="light">
              <Dropdown.Item>View All</Dropdown.Item>
              <Dropdown.Item>Export CSV</Dropdown.Item>
              <Dropdown.Item>Import Data</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>ID Number</Table.HeadCell>
            <Table.HeadCell>Admission Date</Table.HeadCell>
            <Table.HeadCell>Diagnose</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            <Table.Row>
              <Table.Cell>Sabrina Carpenter</Table.Cell>
              <Table.Cell>BR285365</Table.Cell>
              <Table.Cell>06 Jan 2024</Table.Cell>
              <Table.Cell>Bruised Rib</Table.Cell>
              <Table.Cell>
                <Badge color="failure">Urgent</Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Ravi Kumar</Table.Cell>
              <Table.Cell>RK202302</Table.Cell>
              <Table.Cell>02 Feb 2024</Table.Cell>
              <Table.Cell>Fever &amp; Cough</Table.Cell>
              <Table.Cell>
                <Badge color="warning">Moderate</Badge>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Anita Singh</Table.Cell>
              <Table.Cell>AS109234</Table.Cell>
              <Table.Cell>15 Feb 2024</Table.Cell>
              <Table.Cell>General Checkup</Table.Cell>
              <Table.Cell>
                <Badge color="success">Low</Badge>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Card>
    </div>
  );
};

export default AdminMenu;
