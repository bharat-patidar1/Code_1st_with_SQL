import pool  from "../utils/dbConnect.js"

//queries/employee.query.js
export const findById = ({id})=>{
  return pool.query(
    `SELECT _id, name, email, phoneNumber, department, location, role, status
     FROM employee
     WHERE _id = ?`,
    [id]
  );
}

export const findAllName = ()=>{
  return pool.query(`SELECT name FROM employee;`)
}


export const findOneByEmail = ({email})=>{
  return pool.query(`SELECT * FROM employee WHERE email = ?`,[email]);
}

export const create = ({name , email , phoneNumber , department , location , password })=>{
  return pool.query(`
  INSERT INTO employee (name, email, phoneNumber, department, location, password, role)
  VALUES (?, ?, ?, ?, ?, ?, 'Employee');`,[name , email , phoneNumber , department , location , password ]);
}


// ✏️ Update employee password
export const findByEmailAndUpdatePassword = ({password , email})=>{
  return pool.query(`UPDATE employee
SET password = ?
WHERE email = ?
`,[password , email])
}

// ❌ Delete employee by ID
export const findByIdAndDelete = ({employeeId})=>{
  return pool.query(`DELETE FROM employee WHERE _id = ?`,[employeeId])
} //metadata

// 📄 Get all employees with optional search keyword (use LIKE)
export const findByQuery = ({keyword})=>{
  return pool.query(
    `SELECT * FROM employee
     WHERE
       name LIKE CONCAT('%', ?, '%') OR
       department LIKE CONCAT('%', ?, '%') OR
       email LIKE CONCAT('%', ?, '%') OR
       location LIKE CONCAT('%', ?, '%')`,
    [keyword, keyword, keyword, keyword]);
}

// 🔎 Get employee by ID (without password)
export const findByIdWithoutPassword = `
  SELECT id, name, email, department, phoneNumber, location, status, createdAt
  FROM employee WHERE id = ?;
`;

// 📊 Get attendance for an employee (for dashboard)
export const findAttendanceByEmployeeId = `
  SELECT * FROM attendance
  WHERE employeeId = ? AND MONTH(date) = ? AND YEAR(date) = ?
  ORDER BY date DESC LIMIT 7;
`;


export const findAll = ()=>{
  return pool.query(`SELECT * FROM employee;`);
}