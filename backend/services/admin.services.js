import {findOne , create , findOneByEmail , findOneAndUpdatePassword} from "../queries/admin.query.js"
//find One

export const admin_findOne = async()=>{
const [admin] = await findOne();
return admin[0];  //object 
}

export const admin_create = async(adminData)=>{ 
const [admin] = await create(adminData);
return admin; //object return by handler result
}

export const admin_findOneByEmail = async(email)=>{
const [admin] = await findOneByEmail(email);
return admin[0]; // it is object [ {row 1} , { row 2 } , ...]
}

export const admin_findOneAndUpdatePassword = async(password , email)=>{
const [admin] = await findOneAndUpdatePassword({password , email});
return admin; //returns meta data . It is a result object 
}






// exports.getAllAdmins = async () => {
//   const [admins] = await adminQueries.getAllAdmins();
//   return admins;
// };

// exports.getAdminById = async (id) => {
//   const [result] = await adminQueries.getAdminById(id);
//   return result[0];
// };

// exports.createAdmin = async (adminData) => {
//   const [result] = await adminQueries.createAdmin(adminData);
//   return result.insertId;
// };

