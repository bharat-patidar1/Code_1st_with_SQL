
import { leave_create, leave_findByEmployeeId, leave_findAllLeavesWithEmployee, leave_findById, leave_findByIdAndDelete, leave_findByIdAndEmployeeId, leave_updateStatusById } from '../services/leaves.services.js';


export const applyLeave = async (req, res) => {
    try {
        const employeeId = req.employeeId;

        const { leaveType, fromDate, toDate, reason } = req.body;

        if (!leaveType || !fromDate || !toDate || !reason) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const from = new Date(fromDate);
        const to = new Date(toDate);

        if (to < from) {
            return res.status(400).json({
                success: false,
                message: "To date cannot be earlier than from date",
            });
        }

        const leaveApplication = await leave_create({
            employeeId,
            leaveType,
            fromDate: from,
            toDate: to,
            reason,
        });

        return res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            leave: leaveApplication,
        });
    } catch (error) {
        console.error("Error applying leave:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Apply job",
        });
    }
};


export const getEmployeeLeaves = async (req, res) => {
    try {
        const employeeId = req.employeeId;
        const leaves = await leave_findByEmployeeId({ employeeId });
        if (!leaves) {
            return res.status(400).json({
                success: false,
                message: " You have not applied for any leaves"
            })
        }
        return res.status(200).json({
            success: true,
            leaves,
            message: "Leaves Fetched Successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Failed to get Leaves"
        })
    }
}

export const getAllLeaves = async (req, res) => {
    try {
        const allLeaves = await leave_findAllLeavesWithEmployee();
        if (!allLeaves) {
            return res.status(400).json(
                {
                    success: false,
                    message: "No leaves found"
                }
            )
        }
        return res.status(200).json({
            message: "All Leaves Fetched Successfully",
            success: true,
            allLeaves
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Fetch All Leaves"
        })
    }
}

export const updateLeaveStatus = async (req, res) => {
    try {
        const leaveId = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            })
        }

        const leave = await leave_findById({leaveId});
        if (!leave) {
            return res.status(400).json({
                success: false,
                message: "Leave application not found"
            })
        }
        await leave_updateStatusById({status , leaveId});
        return res.status(200).json({
            success: true,
            message: "Status Updated Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Update status"
        })
    }
}

export const deleteLeave = async (req, res) => {
    try {
        const employeeId = req.employeeId;
        const leaveId = req.params.id;

        const leave = await leave_findByIdAndEmployeeId({leaveId , employeeId});

        if (!leave) {
            return res.status(404).json({ success: false, message: "Leave not found" });
        }

        if (leave.status !== "pending") {
            return res.status(400).json({ success: false, message: "Only pending leaves can be deleted" });
        }

        await leave_findByIdAndDelete({leaveId});
        return res.status(200).json({ success: true, message: "Leave deleted successfully" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to Delete leave"
        })
    }
}
