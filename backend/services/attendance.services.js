import pool from '../utils/dbConnect.js'
import { findWorkByDates ,  findAllByEmployeeId , findByDateWithEmployee , findByEmployeeAndDate , findSessionById, saveAttendance} from "../queries/attendance.query.js"

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
    const [attendance] = await findAllByEmployeeId(employeeId)
    return attendance;
}


export const createAttendanceWithSession = async ({ employeeId, todayDate }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    // 1. Insert into attendance table
    const [attendanceResult] = await connection.query(
      `INSERT INTO attendance (employeeId, date, totalHoursToday, isCompleteDay)
       VALUES (?, ?, 0, FALSE)`,
      [employeeId, todayDate]
    );
    const attendanceId = attendanceResult.insertId;
    try {
      const clockInTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
      console.log("ClockIn time:", clockInTime);
    
      await connection.query(
        `INSERT INTO attendance_session (attendanceId, clockIn, clockOut, duration)
         VALUES (?, ?, NULL, 0)`,
        [attendanceId, clockInTime]
      );
      console.log("Successfully inserted attendance session");
    } catch (err) {
      console.error("Error inserting into attendance_session:", err);
      throw err; // Re-throw to trigger rollback
    }
    
    // const clockInTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    // // 2. Insert into attendance_session table
    //  await connection.query(`INSERT INTO attendance_session (attendanceId, clockIn, clockOut, duration)
    //    VALUES (?, ?, NULL, 0)`,
    //   [attendanceId, clockInTime]
    // )
    
    await connection.commit();
    return { success: true, attendanceId };

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const attendance_findSessionById = async({attendanceId})=>{
    const [attendance] = await findSessionById({attendanceId})
    return attendance;
};

export const attendance_saveAttendance = async({attendanceId , clockInTime})=>{
    const [attendance] = await saveAttendance({attendanceId , clockInTime})
    return attendance;
}



