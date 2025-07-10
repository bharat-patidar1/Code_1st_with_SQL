import  pool  from "../utils/dbConnect.js"


// Used in adminRegister: Admin.findOne()
export const findOne = ()=>{
  return pool.query(`SELECT * FROM Admin LIMIT 1;`)
}
// Used in adminRegister: Admin.create()
export const create = ({name , email , phoneNumber , password , role})=>{
  return pool.query(`INSERT INTO Admin (name, email, phoneNumber, password, role) VALUES (?, ?, ?, ?, ?);` ,[name , email , phoneNumber , password , role])
}

// Used in adminLogin & updatePassword: Admin.findOne({ email })
export const findOneByEmail = ({email}) => {
  return pool.query(`SELECT * FROM admin WHERE email = ? LIMIT 1;`,[email]);
}

// Used in updatePassword: Admin.findOneAndUpdate(...)
export const findOneAndUpdatePassword = ({password , email}) => {
  return pool.query(`UPDATE admin SET password = ? WHERE email = ?;`,[password , email]);
}
