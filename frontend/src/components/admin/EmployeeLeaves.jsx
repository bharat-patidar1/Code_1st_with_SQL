// src/components/admin/EmployeeLeaves.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { leave_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setAllLeaves } from "@/redux/leaveSlice";
import AdminNavbar from "./AdminNavbar";

const EmployeeLeaves = () => {
    const { allLeaves } = useSelector(store => store.leave);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [newStatus, setNewStatus] = useState("pending");
    const dispatch = useDispatch()

    const fetchLeaves = async () => {
        
        setLoading(true);
        try {
            const res = await axios.get(`${leave_API_END_POINT}/all`, {
                withCredentials: true,
            });
            if(res.data.success){
                dispatch(setAllLeaves(res.data.allLeaves))
            }
        } catch (err) {
            console.error("Failed to fetch leaves", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [dispatch]);

    const handleUpdateStatus = async () => {
        if (!selectedLeave) return;
        try {

          const res =   await axios.put(
                `${leave_API_END_POINT}/${selectedLeave._id}/status`,
                { status: newStatus },
                { withCredentials: true }
            );
            if (res.data.success) {
                toast.success("Leave status updated successfully");
                setOpenDialog(false);
                fetchLeaves();
            }
        } catch (err) {
            console.log(err)
            toast.error("Update failed");
        }
    };

    return (
        <div>
            <AdminNavbar/>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                        Employee Leave Requests Dashboard
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <table className="w-full text-left border border-gray-300 text-sm bg-white rounded">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">S.No.</th>
                                    <th className="p-2 border">Employee</th>
                                    <th className="p-2 border">Type</th>
                                    <th className="p-2 border">From</th>
                                    <th className="p-2 border">To</th>
                                    <th className="p-2 border">Reason</th>
                                    <th className="p-2 border">Status</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {console.log(allLeaves[1])}
                                {allLeaves.map((leave, index) => (
                                    console.log(leave),
                                    <tr key={leave._id} className="border-t hover:bg-gray-50">
                                        <td className="p-2 border">{index + 1}</td>
                                        <td className="p-2 border">{leave.employeeName}</td>
                                        <td className="p-2 border capitalize">{leave.leaveType}</td>
                                        <td className="p-2 border">{new Date(leave.fromDate).toLocaleDateString()}</td>
                                        <td className="p-2 border">{new Date(leave.toDate).toLocaleDateString()}</td>
                                        <td className="p-2 border">{leave.reason}</td>
                                        <td className="p-2 border">
                                            <span
                                                className={`px-2 py-1 rounded text-white text-xs ${leave.status === "approved"
                                                        ? "bg-green-500"
                                                        : leave.status === "rejected"
                                                            ? "bg-red-500"
                                                            : "bg-yellow-500"
                                                    }`}
                                            >
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="p-2 border">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedLeave(leave);
                                                    setNewStatus(leave.status);
                                                    setOpenDialog(true);
                                                }}
                                            >
                                                Edit Status
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Leave Status</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Select value={newStatus} onValueChange={setNewStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button onClick={handleUpdateStatus}>Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        </div>
    );
};

export default EmployeeLeaves;