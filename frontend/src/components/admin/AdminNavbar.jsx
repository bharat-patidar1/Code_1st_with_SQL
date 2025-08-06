import React, { useState } from 'react';
// In your actual project, you would import these from react-router-dom
// import { Link, useNavigate } from 'react-router-dom';

// --- Mock Components for Standalone Preview ---
// In your project, remove these and use the actual imports from your libraries.

const MockLink = ({ to, children, className }) => (
  <a href={to} className={className} onClick={(e) => e.preventDefault()}>
    {children}
  </a>
);

const useMockNavigate = () => {
  return (path) => {
    console.log(`Navigating to: ${path}`);
    // In a real app, this would change the URL.
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

// --- Reusable AdminLayout Component ---
// This is the main component you will use to wrap your admin pages.

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Replace useMockNavigate with useNavigate in your actual app
  const navigate = useMockNavigate(); 
  // const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  const navLinks = [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Employees", href: "/admin/dashboard/employees" },
    { title: "Attendance", href: "/admin/dashboard/attendanceSummary" },
    { title: "Leaves", href: "/admin/dashboard/employeeLeaves" },
  ];

  // Component for the sidebar's content
  const SidebarContent = () => (
    <>
      <div className="p-5 text-2xl font-bold border-b bg-white flex items-center">
        <span className="text-blue-600 mr-2">👨‍⚕️</span> Code 1st
      </div>
      <nav className="mt-6 flex-1 flex flex-col space-y-1 px-3">
        {navLinks.map((link) => (
          // Replace MockLink with Link in your actual app
          <MockLink
            key={link.title}
            to={link.href}
            className="px-4 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            {link.title}
          </MockLink>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out flex flex-col
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   lg:translate-x-0`}
      >
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* Mobile Top Bar */}
        <header className="lg:hidden bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="text-xl font-semibold">👨‍⚕️ Code 1st Health</div>
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-gray-900">
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>

        {/* This is where your page-specific content will be rendered */}
        <main className="p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};


// --- Example Usage ---
// This demonstrates how to use the AdminLayout component.
// In your app's routing setup, you would render your pages like this.

export default function App() {
  // This would be your page component, e.g., DashboardPage
  const DashboardPageContent = (
    <>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">
        Welcome to the admin panel. This content is rendered inside the AdminLayout.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-lg">Employees</h3>
          <p className="text-gray-500 mt-2">Manage employee records.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-lg">Attendance</h3>
          <p className="text-gray-500 mt-2">View attendance summaries.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="font-semibold text-lg">Leave Requests</h3>
          <p className="text-gray-500 mt-2">Approve or deny requests.</p>
        </div>
      </div>
    </>
  );

  return (
    <AdminLayout>
      {DashboardPageContent}
    </AdminLayout>
  );
}
