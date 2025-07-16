import React, { useState, useEffect } from "react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { leave_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format, isBefore, isAfter } from "date-fns";
import EmployeeNavbar from "../employee/EmployeeNavbar";
import { motion } from "framer-motion";

const ApplyLeave = ({ onClose }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [dateError, setDateError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset date error when dates change
    if (dateError && fromDate && toDate) {
      validateDates();
    }
  }, [fromDate, toDate]);

  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (fromDate && isBefore(fromDate, today)) {
      setDateError("From date cannot be in the past");
      return false;
    }

    if (toDate && isBefore(toDate, today)) {
      setDateError("To date cannot be in the past");
      return false;
    }

    if (fromDate && toDate && isAfter(fromDate, toDate)) {
      setDateError("From date cannot be after To date");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLeaveTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, leaveType: value }));
  };

  const handleDateChange = (date, type) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setFormData((prev) => ({ ...prev, [type]: formattedDate }));
    if (type === 'fromDate') setFromDate(date);
    else setToDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${leave_API_END_POINT}/apply`, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/employee/dashboard');
      }
    } catch (error) {
      console.error("Leave submission failed:", error);
      toast.error("Failed to submit leave request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 md:p-8"
    >
      <EmployeeNavbar/>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-2xl mx-auto mt-20"
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex justify-between items-center">
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold mx-auto"
            >
              Apply for Leave
            </motion.h2>
            {onClose && (
              <motion.button
                variants={itemVariants}
                onClick={onClose}
                className="p-1 rounded-full hover:bg-blue-500 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Leave Type */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="leaveType" className="text-gray-700 font-medium">
              Leave Type
            </Label>
            <Select onValueChange={handleLeaveTypeChange} value={formData.leaveType}>
              <SelectTrigger className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <SelectValue placeholder="Select Leave Type" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <SelectItem value="sick" className="hover:bg-blue-50">Sick Leave</SelectItem>
                <SelectItem value="casual" className="hover:bg-blue-50">Casual Leave</SelectItem>
                <SelectItem value="paid" className="hover:bg-blue-50">Paid Leave</SelectItem>
                <SelectItem value="unpaid" className="hover:bg-blue-50">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          {/* Date Range */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fromDate" className="text-gray-700 font-medium">
                From Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formData.fromDate || "Select date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border border-gray-200 shadow-lg rounded-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={(date) => handleDateChange(date, 'fromDate')}
                    initialFocus
                    disabled={(date) => isBefore(date, new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate" className="text-gray-700 font-medium">
                To Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal border-gray-300 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formData.toDate || "Select date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border border-gray-200 shadow-lg rounded-lg" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={(date) => handleDateChange(date, 'toDate')}
                    initialFocus
                    disabled={(date) => 
                      isBefore(date, new Date()) || 
                      (fromDate && isBefore(date, fromDate))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </motion.div>

          {dateError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-medium"
            >
              {dateError}
            </motion.div>
          )}

          {/* Reason */}
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="reason" className="text-gray-700 font-medium">
              Reason for Leave
            </Label>
            <Textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Please explain your reason for taking leave..."
              className="w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </motion.div>

          {/* Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4"
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-24 hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-24 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting
                </span>
              ) : "Submit"}
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
    </div>
  );
};

export default ApplyLeave;