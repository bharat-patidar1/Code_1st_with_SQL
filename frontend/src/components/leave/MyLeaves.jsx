import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Clock, Check, X, Loader2, CalendarDays, AlertCircle, NotebookPen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { leave_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import EmployeeNavbar from "../employee/EmployeeNavbar";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyLeaves = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`${leave_API_END_POINT}/myleaves`, {
                    withCredentials: true,
                });
                setLeaves(res.data.leaves || []);
            } catch (error) {
                console.error("Error fetching leaves:", error);
                toast.error("Failed to fetch leave applications");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMyLeaves();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await axios.delete(`${leave_API_END_POINT}/${id}/delete`, {
                withCredentials: true,
            });
            setLeaves((prev) => prev.filter((leave) => leave._id !== id));
            toast.success("Leave deleted successfully");
        } catch (error) {
            console.error("Error deleting leave:", error);
            toast.error(error.response?.data?.message || "Failed to delete leave");
        } finally {
            setDeletingId(null);
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const getStatusVariant = (status) => {
        switch (status) {
            case "approved": return { 
                bg: "bg-emerald-100/90", 
                text: "text-emerald-800", 
                icon: Check,
                border: "border-emerald-200"
            };
            case "rejected": return { 
                bg: "bg-rose-100/90", 
                text: "text-rose-800", 
                icon: X,
                border: "border-rose-200"
            };
            default: return { 
                bg: "bg-amber-100/90", 
                text: "text-amber-800", 
                icon: Clock,
                border: "border-amber-200"
            };
        }
    };

    const getLeaveTypeColor = (type) => {
        switch (type) {
            case "sick": return "bg-blue-100 text-blue-800 border border-blue-200";
            case "casual": return "bg-indigo-100 text-indigo-800 border border-indigo-200";
            case "paid": return "bg-violet-100 text-violet-800 border border-violet-200";
            case "unpaid": return "bg-slate-100 text-slate-800 border border-slate-200";
            default: return "bg-slate-100 text-slate-800 border border-slate-200";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20">
            <EmployeeNavbar />
            
            <div className="p-4 md:p-6 max-w-4xl mx-auto py-6 mt-10">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                        duration: 0.4,
                        ease: "easeOut"
                    }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1.5">Leave Application Forms</h2>
                    <p className="text-slate-600/90 text-sm md:text-base">Review your leave history and status</p>
                </motion.div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Skeleton className="h-28 w-full rounded-xl" />
                            </motion.div>
                        ))}
                    </div>
                ) : leaves.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 300,
                            damping: 20
                        }}
                        className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm text-center border border-slate-200/70 max-w-md mx-auto"
                    >
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100/50 mb-3">
                            <CalendarDays className="h-5 w-5 text-blue-600/80" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-1.5">No applications yet</h3>
                        <p className="text-slate-500/90 text-sm mb-4">You haven't applied for any leaves</p>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button 
                                onClick={() => navigate('/employee/dashboard/applyLeave')} 
                                className="gap-1.5 bg-blue-600/90 hover:bg-blue-700/90 text-white shadow-sm"
                            >
                                <NotebookPen className="h-4 w-4" />
                                Apply for Leave
                            </Button>
                        </motion.div>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {leaves.map((leave) => {
                                const status = getStatusVariant(leave.status);
                                const StatusIcon = status.icon;
                                
                                return (
                                    <motion.div
                                        key={leave._id}
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
                                        exit={{ opacity: 0, x: -10 }}
                                        whileHover={{ y: -2 }}
                                        layout
                                    >
                                        <Card className="border border-slate-200/80 bg-white/90 backdrop-blur-sm rounded-xl shadow-xs hover:shadow-sm transition-all duration-300">
                                            <CardHeader className="pb-2 px-5 pt-4">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${getLeaveTypeColor(leave.leaveType)} text-xs font-medium rounded-full`}>
                                                            {leave.leaveType}
                                                        </Badge>
                                                        <span className="text-xs text-slate-600/90 flex items-center gap-1.5">
                                                            <CalendarDays className="h-3.5 w-3.5 text-slate-500/80" />
                                                            {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge className={`${status.bg} ${status.text} ${status.border} text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full`}>
                                                            <StatusIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
                                                            <span className="capitalize">{leave.status}</span>
                                                        </Badge>
                                                        {leave.status === "pending" && (
                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-7 w-7 p-0 text-slate-500 hover:text-rose-500 hover:bg-rose-50/50"
                                                                    onClick={() => handleDelete(leave._id)}
                                                                    disabled={deletingId === leave._id}
                                                                >
                                                                    {deletingId === leave._id ? (
                                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                                    ) : (
                                                                        <Trash2 className="h-3.5 w-3.5" />
                                                                    )}
                                                                </Button>
                                                            </motion.div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="px-5 pb-4 pt-0">
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-3 text-sm bg-slate-50/50 p-3 rounded-lg border border-slate-200/50">
                                                        <NotebookPen className="h-4 w-4 text-slate-500/80 mt-0.5 flex-shrink-0" />
                                                        <p className="text-slate-800/90">{leave.reason}</p>
                                                    </div>
                                                    
                                                    {leave.adminRemark && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ 
                                                                opacity: 1, 
                                                                height: "auto",
                                                                transition: { duration: 0.3 }
                                                            }}
                                                            className={`text-sm p-3 rounded-lg border ${status.border} ${status.bg} flex items-start gap-3`}
                                                        >
                                                            <AlertCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${status.text}`} />
                                                            <p className={status.text}>{leave.adminRemark}</p>
                                                        </motion.div>
                                                    )}
                                                    
                                                    <div className="text-xs text-slate-500/90 mt-1 flex justify-between items-center">
                                                        <span>Leave Duration :&nbsp;
                                                            { Math.ceil((new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24) + 1)} days
                                                        </span>
                                                        <span className="text-xs bg-slate-100/70 px-2 py-0.5 rounded-full">
                                                            {new Date(leave.fromDate) > new Date() ? "Upcoming" : "Past"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLeaves;