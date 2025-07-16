import pool from "../utils/dbConnect.js"

export const create = ({employeeId, leaveType, fromDate, toDate, reason})=>{
  return pool.query(`INSERT INTO leaves (employeeId, leaveType, fromDate, toDate, reason)
  VALUES (?, ?, ?, ?, ?);`,[employeeId, leaveType, fromDate, toDate, reason]);
}

export const findByEmployeeId = ({employeeId})=>{
  return pool.query(`SELECT * FROM leaves WHERE employeeId = ? ORDER BY fromDate DESC;`,[employeeId])
}

export const findAllLeavesWithEmployee = () => {
  return pool.query(`
    SELECT 
      l.*, 
      e._id AS employeeId,
      e.name AS employeeName,
      e.email AS employeeEmail,
      e.phoneNumber AS employeePhoneNumber,
      e.department AS employeeDepartment,
      e.location AS employeeLocation,
      e.role AS employeeRole,
      e.status AS employeeStatus,
      e.profileBio AS employeeProfileBio,
      e.profilePhoto AS employeeProfilePhoto,
      e.profileSkills AS employeeProfileSkills,
      e.createdAt AS employeeCreatedAt,
      e.updatedAt AS employeeUpdatedAt
    FROM 
      leaves l
    JOIN 
      employee e ON l.employeeId = e._id
    ORDER BY 
      l.appliedAt DESC;
  `);
};

export const findById = ({id})=>{
  return pool.query(`SELECT * FROM leaves WHERE _id = ?;`,[id])
};


export const findByIdAndEmployeeId = ({leaveId , employeeId})=>{
  return pool.query(
    `SELECT * FROM leaves WHERE _id = ? AND employeeId = ?`,
    [leaveId, employeeId]
  );
}

export const findByIdAndDelete = ({leaveId})=>{
  return pool.query(`DELETE FROM leaves WHERE _id = ?;`,[leaveId])
};

export const updateStatusById = ({status , leaveId})=>{
  return pool.query(`UPDATE leaves SET status = ? WHERE _id = ?;`,[status , leaveId])
}
