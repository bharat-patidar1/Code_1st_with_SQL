import React from "react";
import { FaClock, FaCalendarAlt, FaUser, FaTasks, FaChartBar, FaBell, FaFileExport } from "react-icons/fa";

const Remember = () => {
  const features = [
    {
      title: "Work Time Tracker",
      icon: <FaClock size={30} />,
      description: "Track your 8-hour workday with clock-in/clock-out. Auto-pause detects inactivity and alerts for overtime/undertime.",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Leave Management",
      icon: <FaCalendarAlt size={30} />,
      description: "Request sick/casual leaves, upload documents, and track approval status. View remaining leave balance.",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Profile Management",
      icon: <FaUser size={30} />,
      description: "Update personal info, emergency contacts, and upload documents (ID, certifications).",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "Daily Targets (Chart-Based)",
      icon: <FaTasks size={30} />,
      description: "Complete admin-assigned chart tasks. Mark progress and add comments for delays.",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      title: "Performance Analytics",
      icon: <FaChartBar size={30} />,
      description: "Visualize weekly targets with charts. Check attendance % and task completion rates.",
      color: "bg-red-100 text-red-800",
    },
    {
      title: "Notifications",
      icon: <FaBell size={30} />,
      description: "Get alerts for leave approvals, new targets, and policy updates.",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      title: "Export Reports",
      icon: <FaFileExport size={30} />,
      description: "Download monthly logs (attendance, tasks) in PDF/Excel format.",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Employee Dashboard - 1st Health Care
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${feature.color}`}
          >
            <div className="flex items-center mb-4">
              <div className="mr-4">{feature.icon}</div>
              <h2 className="text-xl font-semibold">{feature.title}</h2>
            </div>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Remember;