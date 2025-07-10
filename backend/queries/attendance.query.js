import pool  from "../utils/dbConnect.js"
// Check if today's attendance exists for employee (used in clockIn & clockOut)
export const findAllByEmployeeId = ({employeeId})=>{
  return pool.query(`SELECT * 
FROM attendance 
WHERE employeeId = ? 
ORDER BY date DESC;`,[employeeId])
}

export const findSessionById = ({attendanceId})=>{
  return pool.query(`SELECT * FROM attendance_session WHERE attendanceId = ?;`,[attendanceId])
}

export const findWorkByDates = ({startDateStr , todayStr})=>{
  return pool.query(`SELECT a.*, e.* 
   FROM attendance a
   JOIN employees e ON a.employee_id = e.id
   WHERE a.date BETWEEN ? AND ?
`,[startDateStr , todayStr])
  }

  export const findByDateWithEmployee = ({date})=>{
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
  attendance.date = ?;`,[date]);
  }

  export const findByEmployeeAndDate = ({employeeId , date})=>{
    return pool.query(`SELECT * 
FROM attendance 
WHERE employeeId = ? AND date = ? 
LIMIT 1;`,[employeeId , date])
  }
    

  export const saveAttendance = ({attendanceId , clockInTime})=>{
    return pool.query(
      `INSERT INTO attendance(, clockIn, clockOut, duration)
       VALUES (?, ?, NULL, 0)`,
      [attendanceId, clockInTime]
    );
  }