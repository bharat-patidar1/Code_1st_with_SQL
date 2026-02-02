import pool from "../dbConnect.js";
import bcrypt from "bcrypt"


const createAdminTable = `
  CREATE TABLE IF NOT EXISTS admin (
    _id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phoneNumber BIGINT NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Admin',
    profileBio TEXT,
    profilePhoto TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  );
`;

const createEmployeeTable = `CREATE TABLE IF NOT EXISTS employee (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phoneNumber BIGINT NOT NULL,
  department VARCHAR(255),
  location VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'Employee',
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  profileBio TEXT,
  profilePhoto VARCHAR(512),
  profileSkills JSON DEFAULT (JSON_ARRAY()),  -- store array of skills
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`

const createLeaveTable = `CREATE TABLE IF NOT EXISTS leaves (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId INT NOT NULL,  -- Foreign key to Employee table
  leaveType ENUM('sick', 'casual', 'paid', 'unpaid') NOT NULL,
  fromDate DATE NOT NULL,
  toDate DATE NOT NULL,
  reason TEXT NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (employeeId) REFERENCES employee(_id) ON DELETE CASCADE
);`

const createAttendaceTable = `CREATE TABLE IF NOT EXISTS attendance (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  employeeId INT NOT NULL,  -- Foreign key to Employee table
  date DATE NOT NULL,       -- assuming date string is ISO format (YYYY-MM-DD)
  sessions JSON DEFAULT (JSON_ARRAY()),  -- array of clockIn/clockOut/duration objects
  totalHoursToday TIME DEFAULT 0,
  isCompleteDay BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (employeeId) REFERENCES employee(_id) ON DELETE CASCADE
);`

const createSessionsTable = `CREATE TABLE IF NOT EXISTS attendance_session (
  _id INT AUTO_INCREMENT PRIMARY KEY,
  attendanceId INT NOT NULL,  -- FK to attendance table
  clockIn DATETIME NOT NULL,
  clockOut DATETIME,
  duration INT UNSIGNED NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (attendanceId) REFERENCES attendance(_id) ON DELETE CASCADE
);`;

const insertInitialAdmin = async () => {
  const hashedPassword = await bcrypt.hash("bharat", 10);

  const query = `
    INSERT IGNORE INTO admin 
    (name, email, phoneNumber, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  await pool.query(query, [
    "Bharat Patidar",
    "bharat@gmail.com",
    7024187781,
    hashedPassword,
    "Admin",
  ]);
};



async function initDB() {
    try {
        await pool.query(`USE railway`)
        await pool.query(createAdminTable);
        await insertInitialAdmin();
        await pool.query(createEmployeeTable);
        await pool.query(createLeaveTable);
        await pool.query(createAttendaceTable);
        await pool.query(createSessionsTable);
        console.log('✅ Tables created or already exist.');
        process.exit(0); // Done
    } catch (err) {
        console.error('❌ Error setting up tables:', err);
        process.exit(1); // Exit with failure
    }
}

initDB();
