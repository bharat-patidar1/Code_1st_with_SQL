import pool from '../utils/dbConnect.js'
import { findWorkByDates ,  findAllByEmployeeId , findByDateWithEmployee , findByEmployeeAndDate , saveSessionById, saveAttendanceById, findSessionsByAttendanceId , saveSessionClockInByAttendanceId, createNewSessionByAttendanceId, findByEmployeeId} from "../queries/attendance.query.js"
import getIndianCurrentTime from '../utils/getIndianCurrentTime.js';

export const attendance_findWorkByDates = async(date)=>{
    const [attendance] = await findWorkByDates(date)
    return attendance;
}
    
export const attendance_findByDateWithEmployee = async(date)=>{
    const [attendance] = await findByDateWithEmployee(date)
    return attendance;
}

export const attendance_findByEmployeeAndDate = async({employeeId , date})=>{
    const [attendance] = await findByEmployeeAndDate({employeeId , date})
    return attendance[0];
}

export const attendance_findAllByEmployeeId = async(employeeId)=>{
    const [attendances] = await findAllByEmployeeId(employeeId)
    return attendances;
}


export const createAttendanceWithSession = async ({ employeeId, date }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // 1. Insert into attendance table
    const [attendanceResult] = await connection.query(
      `INSERT INTO attendance (employeeId, date, totalHoursToday, isCompleteDay)
       VALUES (?, ?, 0, FALSE)`,
      [employeeId, date]
    );
    const attendanceId = attendanceResult.insertId;
    try {
      const clockInTime = getIndianCurrentTime()
      const [result] = await connection.query(
        `INSERT INTO attendance_session(attendanceId, clockIn, clockOut, duration)
         VALUES (?, ?, NULL, 0)`,
        [attendanceId, clockInTime]
      );
    } catch (err) {
      throw err; // Re-throw to trigger rollback
    }
    
    await connection.commit();

    return { success: true, attendanceId };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const attendance_findSessionsByAttendanceId = async(attendanceId)=>{
    const [sessions] = await findSessionsByAttendanceId(attendanceId)
    return sessions;
};

export const attendance_saveSessionById = async({sessionId , clockOut , duration})=>{
    const [result] = await saveSessionById({sessionId , clockOut , duration})
    return result;
}

export const attendance_saveAttendanceById = async({attendanceId , totalHoursToday , isCompleteDay})=>{
    const [result] = await saveAttendanceById({attendanceId , totalHoursToday , isCompleteDay})

    return result;
}

export const attendance_saveSessionClockInByAttendanceId = async(data)=>{
     await saveSessionClockInByAttendanceId(data)
    return true;
}

export const attendance_createNewSessionByAttendanceId = async({attendanceId })=>{
    const [result] = await createNewSessionByAttendanceId({attendanceId })
    return result;
}

export const attendance_findByEmployeeId = async(data)=>{
    const [attendance] = await findByEmployeeId(data)
    return attendance[0];
}