import { useEffect, useState } from "react";
import axios from "axios";
import { Attendance_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import EmployeeNavbar from "./EmployeeNavbar";
import { ChevronDown, ChevronUp, Clock, Check, AlertCircle } from "lucide-react";
// import { setTotalHours } from "@/redux/employeeSlice";  
export default function AttendanceHistory() {
  const [history, setHistory] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${Attendance_API_END_POINT}/history`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setHistory(res.data.attendance);
          // dispatch(setTotalHours(res.data.attendance));
        }
      } catch (err) {
        toast.error("Failed to fetch attendance history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const calculateTotalHours = (sessions) => {
    const totalMinutes = sessions.reduce((sum, session) => sum + ((session.duration)/60 || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = parseInt(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
      <EmployeeNavbar />
      
      <div className="p-4 md:p-6 max-w-6xl mx-auto py-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1.5">Attendance History</h2>
          <p className="text-slate-600/90 text-sm md:text-base">Your complete attendance records</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xs hover:shadow-sm transition-all border border-slate-200/80 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200/60">
                <thead>
                  <tr className="bg-slate-800">
                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-50 uppercase tracking-wider rounded-tl-xl">Date</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-50 uppercase tracking-wider">Sessions</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-50 uppercase tracking-wider">Total Hours</th>
                    <th className="px-5 py-3 text-center text-xs font-medium text-slate-50 uppercase tracking-wider rounded-tr-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  <AnimatePresence>
                    {history.map((record, i) => {
                      const showAll = expandedRows[i];
                      const displaySessions = showAll
                        ? record.sessions
                        : record.sessions.slice(0, 3);
                      return (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { 
                              type: "spring",
                              stiffness: 300,
                              damping: 15
                            }
                          }}
                          className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                        >
                          <td className="px-5 py-4 text-center text-sm text-slate-800">
                            {new Date(record.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              weekday: 'short'
                            })}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="flex flex-col items-center space-y-2">
                              <AnimatePresence>
                                {displaySessions.map((s, j) => (
                                  <motion.div
                                    key={j}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-2"
                                  >
                                    <div className={`w-2.5 h-2.5 rounded-full ${s.clockOut ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                    <span className="text-slate-700">
                                      {formatTime(s.clockIn)} - {formatTime(s.clockOut)}
                                    </span>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                              {record.sessions.length > 3 && (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-indigo-600 hover:text-indigo-800 p-0 h-6 text-xs"
                                    onClick={() => toggleRow(i)}
                                  >
                                    {showAll ? (
                                      <span className="flex items-center gap-1">
                                        Show Less <ChevronUp className="h-3.5 w-3.5" />
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        Show More ({record.sessions.length - 3}) <ChevronDown className="h-3.5 w-3.5" />
                                      </span>
                                    )}
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-100/80 text-indigo-800 text-xs">
                              <Clock className="h-3.5 w-3.5 mr-1.5" />
                              {calculateTotalHours(record.sessions)}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            {record.isCompleteDay ? (
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs">
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                Complete
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs">
                                <AlertCircle className="h-3.5 w-3.5 mr-1.5" />
                                Pending
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}