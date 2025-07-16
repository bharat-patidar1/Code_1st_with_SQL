import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Attendance_API_END_POINT, Employee_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsClockedin } from "@/redux/attendanceSlice";
import { setTotalHours } from "@/redux/employeeSlice";
import { CalendarIcon, ClockIcon, BellIcon, UserIcon, ArchiveIcon } from "lucide-react";
import EmployeeNavbar from "./EmployeeNavbar";
import Remember from "./Remember";

axios.defaults.withCredentials = true;

export default function EmployeeDashboard() {
  const { totalHours } = useSelector((store) => store.employee);
  const { isClockedIn } = useSelector((store) => store.attendance);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const totalSecondsRef = useRef(0);
  const intervalRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false)

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${Attendance_API_END_POINT}/clockIn`, { withCredentials: true });
      if (response.data.success) {
        dispatch(setIsClockedin(true));
        // dispatch(setTotalHours(response.data.attendance.totalHoursToday));
        console.log("totalHours At ClockIn", totalHours)
        toast.success("Successfully clocked in!");
      }
    } catch {
      toast.error("Failed to clock in.");
      setIsInitialized(true);
    } finally {
      setLoading(false);
    }
  };

  // Convert between HH:MM:SS ↔ seconds

  const timeToSeconds = (timeStr) => {
    const [hh, mm, ss] = timeStr.split(':').map(Number);
    console.log(timeStr)
    return hh * 3600 + mm * 60 + ss;
  };

  // Convert seconds back to 'HH:MM:SS' (for Redux/store)
  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  }

  useEffect(() => {
    // Initialize timer data whenever totalHours changes
    if (totalHours && isClockedIn) {
      totalSecondsRef.current = timeToSeconds(totalHours);
      console.log("Initialized with:", totalHours, "=", totalSecondsRef.current, "seconds");

      // Only mark as initialized if we're NOT clocked in, 
      // or if clocked in, let the clock-in effect handle it
      if (!isClockedIn) {
        setIsInitialized(true);
      }
    }
  }, [totalHours]);
  // Start/stop counting when isClockedIn changes
  useEffect(() => {
    if (!isInitialized) return;

    if (isClockedIn) {
      intervalRef.current = setInterval(() => {
        totalSecondsRef.current += 1;
        const newTime = secondsToTime(totalSecondsRef.current);
        dispatch(setTotalHours(newTime)); // Update Redux (format: 'HH:MM:SS')
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isClockedIn, isInitialized, dispatch]);

  const handleClockOut = async () => {
    try {
      setLoading(true);
      // dispatch(setIsClockedin(false));
      const response = await axios.post(`${Attendance_API_END_POINT}/clockOut`, { withCredentials: true });
      if (response.data.success) {
        dispatch(setIsClockedin(false));
        dispatch(setTotalHours(response.data.attendance.totalHoursToday));
        console.log("totalHours At ClockOut", totalHours)
        toast.success("Successfully clocked out!");
      }
    } catch {
      toast.error("Failed to clock out.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${Employee_API_END_POINT}/logout`, { withCredentials: true });
      if (response.data.success) {
        toast.success("Logged out!");
        navigate("/login");
      }
    } catch {
      toast.error("Logout failed.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <EmployeeNavbar />
      <Remember />
      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-8">
        {/* Attendance Hours & History */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <Badge variant="outline" className="text-base px-4 py-2 rounded-md">
            Today's Hours: {totalHours} hrs
          </Badge>

          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate("/employee/dashboard/history")} variant="outline">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Attendance History
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              <UserIcon className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </section>

        {/* Clock In/Out */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold text-gray-800">Attendance Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <p className="text-2xl font-semibold">
                {isClockedIn ? "🟢 Clocked In" : "🔴 Clocked Out"}
              </p>
              <Button
                onClick={isClockedIn ? handleClockOut : handleClockIn}
                disabled={loading}
                className={`w-3/4 md:w-1/2 text-white font-semibold rounded-xl py-3 text-lg shadow-md transition-transform duration-200 transform
          ${isClockedIn
                    ? "bg-red-600 hover:bg-red-700 active:scale-95"
                    : "bg-green-600 hover:bg-green-700 active:scale-95"}`}
              >
                {isClockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </CardContent>
          </Card>
        </section>


        {/* Quick Actions */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                onClick={() => navigate("/employee/dashboard/applyLeave")}
                variant="outline"
                className="w-full"
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                Apply Leave
              </Button>
              <Button
                onClick={() => navigate("/employee/dashboard/profile")}
                variant="outline"
                className="w-full"
              >
                <UserIcon className="mr-2 h-4 w-4" />
                Update Profile
              </Button>
              <Button
                onClick={() => navigate("/employee/dashboard/payroll")}
                variant="outline"
                className="w-full"
              >
                <ArchiveIcon className="mr-2 h-4 w-4" />
                View Payroll
              </Button>
              <Button
                onClick={() => navigate("/employee/dashboard/notifications")}
                variant="outline"
                className="w-full"
              >
                <BellIcon className="mr-2 h-4 w-4" />
                Notifications
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Upcoming Shifts */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              {["Monday", "Tuesday", "Wednesday"].map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between p-3 border-b last:border-none"
                >
                  <span>{day}</span>
                  <span>9:00 AM – 5:00 PM</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
