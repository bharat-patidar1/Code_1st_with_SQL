import { attendance_findByEmployeeAndDate , attendance_findAllByEmployeeId , createAttendanceWithSession , attendance_findSessionById} from "../services/attendance.services.js";


export const employeeClockIn = async (req, res) => {
    try {
        const employeeId = req.employeeId;
        const todayDate = new Date().toISOString().split("T")[0]
        // Check if attendance for today already exists
        let attendance = await attendance_findByEmployeeAndDate({employeeId , date : todayDate})
        // 2. If not exists, create it
        if (!attendance) {
            console.log("Attendance not found")
            attendance = await createAttendanceWithSession({employeeId , todayDate});
            return res.status(200).json({
                success: true,
                message: "Clocked in successfully (new attendance created)",
                attendance
            });
        }
        //3. Check if already clocked in without last session clockout
        
        const sessions = await attendance_findSessionById({attendanceId : attendance._id})

        const lastSession = sessions.at(-1);
        if (lastSession && !lastSession.clockOut) {
            return res.status(400).json({
                success: false,
                message: "Already clocked in. Please clock out first."

            })
        }
        // 4. Add new clockIn session to existing attendance
        attendance.sessions.push({
            clockIn: new Date(),
            clockOut: null,
            duration: 0
        })
        await attendance.save();

        return res.status(200).json({
            success: true,
            message: "Clocked in successfully",
            attendance
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Clock In failed"
        })
    }
}

export const employeeClockOut = async (req, res) => {
    try {
        const employeeId = req.employeeId
        const todayDate = new Date().toISOString().split("T")[0];

        const attendance = await attendance_findByEmployeeAndDate({employeeId , date: todayDate});
        console.log(attendance)
        if (!attendance) {
            return res.status(400).json({
                success: false,
                message: "You have not clocked in today"
            })
        }

        //get last session
        const sessions = await attendance_findSessionById({attendanceId : attendance._id})
        const lastSession = sessions.at(-1);
        if (!lastSession || !lastSession.clockIn || lastSession.clockOut) {
            return res.status(400).json({
                success: false,
                message: "You must clock in before clocking out.",
            });
        }
        //set clockout time
        const now = new Date();
        lastSession.clockOut = now;
        //now calculate and asign duration
        const durationInMinutes = Math.floor((now - new Date(lastSession.clockIn)) / (1000 * 60));
        lastSession.duration = durationInMinutes;

        //update total hours
        attendance.totalHoursToday = attendance.sessions.reduce((total, session) => {
            return total + (session.duration || 0);
        }, 0); // Total in minutes

        // Optionally convert to hours:
        const totalInHours = attendance.totalHoursToday / 60;
        attendance.totalHoursToday = parseFloat(totalInHours.toFixed(2));
        attendance.isCompleteDay = totalInHours >= 8;
        await attendance_saveAttendance({attendanceId : attendance._id , clockInTime : lastSession.clockIn});

        return res.status(200).json({
            success: true,
            attendance,
            message: "Clocked Out Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to Clock Out"
        })
    }
}

export const AttendanceHistoryById = async (req, res) => {
    try {
        const employeeId = req.employeeId;

        const history = await attendance_findAllByEmployeeId({employeeId});
        return res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Failed to fetch attendance history"
        })
    }
}

