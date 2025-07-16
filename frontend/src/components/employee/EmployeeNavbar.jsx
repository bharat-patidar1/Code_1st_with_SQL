import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react"; 
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import {
  ClockIcon,
  CalendarIcon,
  UserIcon,
  SettingsIcon,
  UploadIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import code1stLogo from "../images/code1st.png"

const EmployeeNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profileImage, setProfileImage] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get active page from URL
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/leaves')) return 'leave';
    if (path.includes('/history')) return 'attendance';
    if (path === '/employee/dashboard') return 'dashboard';
    return '';
  };

  const activePage = getActivePage();

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        toast.success("Profile image updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Successfully logged out!");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left - Company Brand and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <div className="mr-2 flex md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <XIcon className="h-5 w-5" />
                ) : (
                  <MenuIcon className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-20 h-12 rounded-lg bg-indigo-50 text-indigo-600 mr-3">
                <img src={code1stLogo} alt="icon"/>
              </div>
              <span className="text-xl font-medium text-gray-800">
                <span className="text-indigo-600">Code 1st</span> Health
              </span>
            </div>
          </div>

          {/* Center - Navigation Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard")}
              className={`px-4 py-2 ${activePage === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard/history")}
              className={`px-4 py-2 ${activePage === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Attendance
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard/leaves")}
              className={`px-4 py-2 ${activePage === 'leave' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>

          {/* Right - Profile Dropdown */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9 border-2 border-white hover:border-indigo-100 transition-colors">
                  <AvatarImage src={profileImage || '/default-avatar.png'} />
                  <AvatarFallback>BH</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={profileImage || '/default-avatar.png'} />
                      <AvatarFallback>BH</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Bharat Patidar</p>
                      <p className="text-xs text-gray-500">Software Engineer</p>
                    </div>
                  </div>
                </div>
                <div className="p-1">
                  <div className="px-3 py-1.5 text-sm font-medium">
                    <label className="flex items-center cursor-pointer">
                      <UploadIcon className="mr-2 h-4 w-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/employee/dashboard/profile')}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleNavigation('/employee/dashboard/settings')}
                  >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </div>
                <div className="p-1 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white pb-3 space-y-1">
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard")}
              className={`w-full justify-start px-4 py-2 ${activePage === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard/history")}
              className={`w-full justify-start px-4 py-2 ${activePage === 'attendance' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Attendance
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigation("/employee/dashboard/leaves")}
              className={`w-full justify-start px-4 py-2 ${activePage === 'leave' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <ClockIcon className="h-4 w-4 mr-2" />
              Leave
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EmployeeNavbar;