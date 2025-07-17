import { attendance_findByEmployeeAndDate, attendance_findAllByEmployeeId, createAttendanceWithSession, attendance_saveSessionById, attendance_findSessionsByAttendanceId, attendance_saveSessionClockInByAttendanceId, attendance_createNewSessionByAttendanceId, attendance_findByDateWithEmployee } from "../services/attendance.services.js";
import { attendance_saveAttendanceById } from "../services/attendance.services.js";
import calculateDurationInSeconds from "../utils/calculateSeconds.js";
import getIndianCurrentTime from "../utils/getIndianCurrentTime.js";
import secondsToHHMMSS from "../utils/secondsToHHMM.js";


export const employeeClockIn = async (req, res) => {
    try {
        const employeeId = req.employeeId;
        const todayDate = new Date().toISOString().split("T")[0];
        // Check if attendance for today already exists
        let attendance = await attendance_findByEmployeeAndDate({ employeeId, date: todayDate })
        // 2. If not exists, create it
        if (!attendance) {
            attendance = await createAttendanceWithSession({ employeeId, date: todayDate });
            return res.status(200).json({
                success: true,
                message: "Clocked in successfully (new attendance created)",
                totalHoursToday : '00:00:00'
            });
        }
        //3. Check if already clocked in without last session clockout

        const sessions = await attendance_findSessionsByAttendanceId({ attendanceId: attendance._id })
        const lastSession = sessions.at(-1);
        if (lastSession && !lastSession.clockOut) {
            return res.status(400).json({
                success: false,
                message: "Already clocked in. Please clock out first."
            })
        }

        await attendance_createNewSessionByAttendanceId({ attendanceId: attendance._id })
        await attendance_saveSessionClockInByAttendanceId({ attendanceId: attendance._id });
        
        return res.status(200).json({
            success: true,
            message: "Clocked in successfully",
            attendance
        });

    } catch (error) {
        console.log(error)
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

        const attendance = await attendance_findByEmployeeAndDate({ employeeId, date: todayDate });
        if (!attendance) {
            return res.status(400).json({
                success: false,
                message: "You have not clocked in today"
            })
        }
        //get last session
        const sessions = await attendance_findSessionsByAttendanceId({ attendanceId: attendance._id })
        const lastSession = sessions[sessions.length - 1];
        if (!lastSession || !lastSession.clockIn || lastSession.clockOut) {
            return res.status(400).json({
                success: false,
                message: "You must clock in before clocking out.",
            });
        }
        const clockOutTime = getIndianCurrentTime();
        //set clockout time
        const duration = calculateDurationInSeconds(lastSession.clockIn, clockOutTime);
      

        //update sessions
        await attendance_saveSessionById({ sessionId: lastSession._id, clockOut: clockOutTime, duration: parseInt(duration)});

        //update total hours
        const allSessions = await attendance_findSessionsByAttendanceId({ attendanceId: attendance._id })
        const totalSecondsToday = allSessions.reduce((total, session) => total + (session.duration || 0), 0);
        const hoursTotal = secondsToHHMMSS(totalSecondsToday);
        console.log("hoursTotal" , hoursTotal)
        const dayCompletion = (totalSecondsToday >= 28800);
        //update attendance
        await attendance_saveAttendanceById({ attendanceId: attendance._id, totalHoursToday: hoursTotal, isCompleteDay: dayCompletion })
        
        const att = await attendance_findByDateWithEmployee({ employeeId, date: todayDate });
        console.log("att" , att)

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

        const attendance = await attendance_findAllByEmployeeId({ employeeId });
        // Parse JSON sessions if they come as string
        

        res.status(200).json({
            success: true,
            attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


