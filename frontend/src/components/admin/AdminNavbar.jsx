import React, { useState } from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Optional: for better icons (uses Lucide, works with shadcn/ui)

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full bg-white shadow-sm py-4 relative z-50">
      <div className="px-6 flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="text-2xl font-semibold">👨‍⚕️ Code 1st Health</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
          <a href="/admin/dashboard/employees" className="hover:text-blue-600">Employees</a>
          <a href="/admin/dashboard/attendanceSummary" className="hover:text-blue-600">Attendance</a>
          <a href="/admin/dashboard/employeeLeaves" className="hover:text-blue-600">Leaves</a>
          <Button variant="destructive" onClick={() => navigate("/")}>Logout</Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 px-6 flex flex-col space-y-4 transition-all duration-300">
          <a href="/admin/dashboard" className="hover:text-blue-600" onClick={() => setSidebarOpen(false)}>Dashboard</a>
          <a href="/admin/dashboard/employees" className="hover:text-blue-600" onClick={() => setSidebarOpen(false)}>Employees</a>
          <a href="/admin/dashboard/attendanceSummary" className="hover:text-blue-600" onClick={() => setSidebarOpen(false)}>Attendance</a>
          <a href="/admin/dashboard/employeeLeaves" className="hover:text-blue-600" onClick={() => setSidebarOpen(false)}>Leaves</a>
          <Button variant="destructive" onClick={() => {
            setSidebarOpen(false);
            navigate("/");
          }}>Logout</Button>
        </div>
      )}
    </div>
  );
}
