import React, { useState } from 'react';

// --- Helper Components (for a self-contained example) ---

/**
 * A mock Button component to replicate the one from your UI library.
 * In your actual project, you would import this from your library (e.g., shadcn/ui).
 */
const Button = ({ variant, onClick, children, className = '' }) => {
  const baseClasses = 'py-2 px-4 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400',
    default: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </button>
  );
};

/**
 * SVG icon for the hamburger menu.
 */
const MenuIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

// --- Main Application Component ---

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // In a real app with react-router-dom, you would use:
  // const navigate = useNavigate();
  // const handleLogout = () => navigate("/");
  // For this standalone example, we'll use a simple function.
  const handleLogout = () => {
    console.log("Logging out and redirecting to homepage...");
    // In a real scenario, you'd also clear auth tokens.
    window.location.href = "/";
  };

  const navLinks = [
    { title: "Dashboard", href: "#" },
    { title: "Employees", href: "#" },
    { title: "Attendance", href: "#" },
    { title: "Leaves", href: "#" },
  ];

  // Component to render the sidebar content, used in two places.
  const SidebarContent = () => (
    <>
      <div className="p-5 text-2xl font-bold border-b bg-white">
        <span className="text-blue-600">👨‍⚕️</span> Code 1st
      </div>
      <nav className="mt-6 flex-1 flex flex-col space-y-1 px-3">
        {navLinks.map((link) => (
          <a
            key={link.title}
            href={link.href}
            className="px-4 py-2.5 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            {link.title}
          </a>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button variant="destructive" onClick={handleLogout} className="w-full">
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Mobile Sidebar Overlay --- */}
      {/* This darkens the main content when the sidebar is open on mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Sidebar --- */}
      {/* It's hidden off-screen on mobile and becomes visible on larger screens */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-30 transform transition-transform duration-300 ease-in-out flex flex-col
                   ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                   lg:translate-x-0 lg:flex`}
      >
        <SidebarContent />
      </aside>

      {/* --- Main Content --- */}
      {/* The left margin on this div is the width of the sidebar on large screens */}
      <div className="lg:ml-64 transition-all duration-300">
        {/* --- Top Navbar for Mobile --- */}
        {/* This bar is only visible on mobile and contains the hamburger menu button */}
        <header className="lg:hidden bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <div className="text-xl font-semibold">👨‍⚕️ Code 1st Health</div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
            <MenuIcon className="h-6 w-6" />
          </button>
        </header>

        {/* --- Page Content Goes Here --- */}
        <main className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to the admin panel. The navigation is now a permanent sidebar on desktop and a toggleable one on mobile.
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
        </main>
      </div>
    </div>
  );
}
