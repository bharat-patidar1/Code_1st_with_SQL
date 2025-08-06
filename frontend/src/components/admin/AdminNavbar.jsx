import React, { useState } from 'react';
// In your actual project, you would uncomment these lines
// import { Link, useNavigate } from 'react-router-dom';
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // Assuming from shadcn/ui
// import { Button } from "../ui/button"; // Assuming from shadcn/ui

// --- Mock Components for Standalone Preview ---
// In your project, remove these and use the actual imports from your libraries.

const MockLink = ({ to, children, className }) => (
  <a href={to} className={className} onClick={(e) => { e.preventDefault(); console.log(`Link to: ${to}`); }}>
    {children}
  </a>
);

const useMockNavigate = () => {
  return (path) => {
    console.log(`Navigating to: ${path}`);
  };
};

const Button = ({ variant, onClick, children, className = '' }) => {
  const baseClasses = 'py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </button>
  );
};

const MenuIcon = (props) => (
  <svg {...props} stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Mock Card components to replicate your UI library
const Card = ({ onClick, children, className }) => <div onClick={onClick} className={`bg-white rounded-xl shadow-md ${className}`}>{children}</div>;
const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;
const CardTitle = ({ children }) => <h3 className="font-semibold text-lg text-gray-800">{children}</h3>;
const CardContent = ({ children }) => <div className="p-6 pt-0 text-gray-600">{children}</div>;


// --- Reusable AdminLayout Component ---
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // In your project, replace useMockNavigate with the real hook
  const navigate = useMockNavigate();
  // const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  // Updated navLinks to match all dashboard cards
  const navLinks = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Employee Overview", href: "/admin/dashboard/overview" },
    { title: "Manage Employees", href: "/admin/dashboard/employees" },
    { title: "Attendance", href: "/admin/dashboard/attendanceSummary" },
    { title: "Leaves", href: "/admin/dashboard/employeeLeaves" },
    { title: "Work Hour Tracker", href: "/admin/dashboard/workhour" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 text-2xl font-bold border-b bg-white flex items-center shrink-0">
        <span className="text-blue-600 mr-2">👨‍⚕️</span> Code 1st
      </div>
      <nav className="mt-6 flex-1 flex flex-col space-y-1 px-3 overflow-y-auto">
        {navLinks.map((link) => (
          // In your project, replace MockLink with Link
          <MockLink
            key={link.title}
            to={link.href}
            className="px-4 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            {link.title}
          </MockLink>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto shrink-0">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <SidebarContent />
      </aside>

      <div className="lg:ml-64 transition-all duration-300">
        <header className="lg:hidden bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="text-xl font-semibold">👨‍⚕️ Code 1st Health</div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900">
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- AdminDashboard Component ---
// This contains your grid of cards.
const AdminDashboard = () => {
  // In your project, replace useMockNavigate with the real hook
  const navigate = useMockNavigate();
  // const navigate = useNavigate();

  const cardClassName = "cursor-pointer border-2 border-transparent hover:border-blue-400 hover:shadow-xl transition-all duration-300";

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card onClick={() => navigate('/admin/dashboard/overview')} className={cardClassName}>
          <CardHeader><CardTitle>Employee Overview</CardTitle></CardHeader>
          <CardContent><p>View all employees, active/inactive status, and more.</p></CardContent>
        </Card>

        <Card onClick={() => navigate('/admin/dashboard/attendanceSummary')} className={cardClassName}>
          <CardHeader><CardTitle>Attendance Summary</CardTitle></CardHeader>
          <CardContent><p>Track daily and weekly attendance trends.</p></CardContent>
        </Card>

        <Card onClick={() => navigate('/admin/dashboard/employeeLeaves')} className={cardClassName}>
          <CardHeader><CardTitle>Leave Management</CardTitle></CardHeader>
          <CardContent><p>View and manage all leave requests submitted by employees.</p></CardContent>
        </Card>

        <Card onClick={() => navigate('/admin/dashboard/workhour')} className={cardClassName}>
          <CardHeader><CardTitle>Work Hour Tracker</CardTitle></CardHeader>
          <CardContent><p>Monitor daily/weekly work hours and highlight low performers.</p></CardContent>
        </Card>

        <Card onClick={() => navigate('/admin/dashboard/employees')} className={cardClassName}>
          <CardHeader><CardTitle>Manage Employees</CardTitle></CardHeader>
          <CardContent><p>View, invite, or remove employees from the system.</p></CardContent>
        </Card>
      </div>
    </>
  );
};

// --- Main App Component (Example Usage) ---
// This shows how to put the AdminDashboard inside the AdminLayout.
export default function App() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
