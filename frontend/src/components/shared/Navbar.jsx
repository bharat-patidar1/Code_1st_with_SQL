import React, { useState } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import code1st from "../images/code1st.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="w-full bg-white border-b shadow-sm px-4 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3">
          <img className="h-10 w-10 object-contain" src={code1st} alt="CN" />
          <span className="text-lg sm:text-xl font-bold text-primary">
            Code1st HealthCare
          </span>
        </div>

        {/* Desktop Buttons (if you need center nav later) */}
        <div className="hidden md:flex gap-6 ml-auto mr-12">
          {/* <Button variant="ghost">Home</Button>
          <Button variant="ghost">About</Button>
          <Button variant="ghost">Contact</Button> */}
        </div>

        {/* Desktop Auth Button */}
        <div className="hidden sm:flex gap-2">
          <Button variant="outline">
            <Link to="/login">Login Page</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="sm:hidden">
          <button onClick={toggleMenu} className="text-primary focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 px-4 space-y-2">
          <Button variant="outline" className="w-full">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login Page
            </Link>
          </Button>
          {/* Uncomment and add more links if needed */}
          {/* <Button variant="ghost" className="w-full">Home</Button> */}
        </div>
      )}
    </nav>
  );
}
