/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { Card } from "flowbite-react";
import { User, AtSign, Calendar, MapPin, Briefcase, Tag } from "lucide-react";

const Summary = ({ data }) => {
  const summaryItems = [
    { label: "Name", value: data.name, icon: <User className="w-5 h-5 text-blue-500" /> },
    { label: "Username", value: data.username, icon: <Tag className="w-5 h-5 text-indigo-500" /> },
    { label: "Email", value: data.email, icon: <AtSign className="w-5 h-5 text-green-500" /> },
    { label: "Gender", value: data.gender, icon: <User className="w-5 h-5 text-purple-500" /> },
    { label: "Date of Birth", value: data.dob, icon: <Calendar className="w-5 h-5 text-red-500" /> },
    { label: "Pincode", value: data.pincode, icon: <MapPin className="w-5 h-5 text-orange-500" /> },
    { label: "Street", value: data.street, icon: <MapPin className="w-5 h-5 text-gray-500" /> },
    { label: "City", value: data.city, icon: <MapPin className="w-5 h-5 text-yellow-500" /> },
    { label: "State", value: data.state, icon: <MapPin className="w-5 h-5 text-indigo-500" /> },
    { label: "Country", value: data.country, icon: <MapPin className="w-5 h-5 text-teal-500" /> },
    { label: "Role", value: data.role, icon: <Briefcase className="w-5 h-5 text-pink-500" /> },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Summary</h2>
        <ul className="space-y-3">
          {summaryItems.map(
            (item, index) =>
              item.value && (
                <li key={index} className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}:</span>
                  <span className="text-gray-700">{item.value}</span>
                </li>
              )
          )}
          {data.role === "Doctor" && data.specialization && (
            <li className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Specialization:</span>
              <span className="text-gray-700">{data.specialization}</span>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default Summary;
