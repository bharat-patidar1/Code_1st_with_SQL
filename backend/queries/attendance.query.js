import pool from "../utils/dbConnect.js"
// Check if today's attendance exists for employee (used in clockIn & clockOut)
export const findAllByEmployeeId = ({ employeeId }) => {
  return pool.query(`SELECT * 
FROM attendance 
WHERE employeeId = ? 
ORDER BY date DESC;`, [employeeId])
}

export const findSessionsByAttendanceId = ({attendanceId}) => {
  return pool.query(`SELECT * FROM attendance_session WHERE attendanceId = ?;`, [attendanceId])
}
export const findWorkByDates = ({ startDateStr, todayStr }) => {
  return pool.query(`SELECT a.*, e.* 
   FROM attendance a
   JOIN employees e ON a.employee_id = e.id
   WHERE a.date BETWEEN ? AND ?
`, [startDateStr, todayStr])
}

export const findByDateWithEmployee = ({ date }) => {
  return pool.query(`SELECT 
  attendance.*,
  employee.name,
  employee.email,
  employee.phoneNumber,
  employee.department,
  employee.location,
  employee.role,
  employee.status
FROM 
  attendance
JOIN 
  employee ON attendance.employeeId = employee._id
WHERE 
  attendance.date = ?;`, [date]);
}

export const findByEmployeeAndDate = ({ employeeId, date }) => {
  return pool.query(`SELECT * 
FROM attendance 
WHERE employeeId = ? AND date = ? 
LIMIT 1;`, [employeeId, date])
}

export const saveSessionById = ({ sessionId, clockOut, duration }) => {
  return pool.query(`UPDATE attendance_session SET clockOut = ? , duration = ? WHERE _id = ?;`, [clockOut, duration, sessionId])
}

export const saveAttendanceById = ({ attendanceId, totalHoursToday, isCompleteDay }) => {
  return pool.query(`UPDATE attendance SET totalHoursToday = ? , isCompleteDay = ? WHERE _id = ?;`, [totalHoursToday, isCompleteDay, attendanceId])
}



export const saveSessionClockInByAttendanceId = ({ attendanceId, clockInTime }) => {
  console.log("Chalgya")
  return pool.query(`UPDATE attendance_session SET clockIn = ? WHERE attendanceId = ?;`, [clockInTime, attendanceId])
}


export const createNewSessionByAttendanceId = ({attendanceId , clockInTime})=>{
  return pool.query(`INSERT INTO attendance_session(attendanceId, clockIn, clockOut, duration)
   VALUES (?, ?, NULL, 0)`,
   [attendanceId, clockInTime]
)};