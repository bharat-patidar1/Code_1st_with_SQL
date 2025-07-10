import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { leave_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import EmployeeNavbar from "../employee/EmployeeNavbar";


const MyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyLeaves = async () => {
        try {
            const res = await axios.get(`${leave_API_END_POINT}/myleaves`, {
                withCredentials: true,
            });
            setLeaves(res.data.leaves || []);
        } catch (error) {
            console.error("Error fetching leaves:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMyLeaves(); // 👈 Called once when the component is mounted
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this leave?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${leave_API_END_POINT}/${id}/delete`, {
                withCredentials: true,
            });
            setLeaves((prev) => prev.filter((leave) => leave._id !== id));
            toast.success(res.data.message)
        } catch (error) {
            console.error("Error deleting leave:", error);
            toast.error(error.response.data.message)
        }
    };

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const getStatusBadge = (status) => {
        switch (status) {
            case "approved":
                return <Badge className="bg-green-500 text-white">Approved</Badge>;
            case "rejected":
                return <Badge className="bg-red-500 text-white">Rejected</Badge>;
            default:
                return <Badge className="bg-gray-500 text-white">Pending</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
            </div>
        );
    }
    console.log(leaves)
    if (leaves.length === 0) {
        return <p className="text-muted-foreground">No leave applications found.</p>;
    }

    return (
        <>
        <EmployeeNavbar/>
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-4">
            <h2 className="text-3xl font-bold mb-6 text-center">My Leave Applications</h2>
            {leaves.map((leave) => (
                <Card key={leave._id} className="shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="capitalize">{leave.leaveType} Leave</CardTitle>
                            <CardDescription>
                                {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(leave.status)}
                            {leave.status === "pending" && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Delete"
                                    onClick={() => handleDelete(leave._id)}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            <strong>Reason:</strong> {leave.reason}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
        </>
    );
};

export default MyLeaves;
