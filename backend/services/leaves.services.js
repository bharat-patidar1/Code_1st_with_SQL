import { create, findAllLeavesWithEmployee, findByEmployeeId, findByIdAndEmployeeId, findById, updateStatusById, findByIdAndDelete  } from "../queries/leaves.query.js";

export const leave_create = async(data)=>{
    const leave = await create(data);
    return leave;
}

export const leave_findByEmployeeId = async(employeeId)=>{
    const [leave] = await findByEmployeeId(employeeId);
    return leave;
}



export const leave_findAllLeavesWithEmployee = async()=>{
    const [leave] = await findAllLeavesWithEmployee();
    return leave;
}

export const leave_findById = async(id)=>{
    const leave = await findById(id);
    return leave[0];
}
    

export const leave_findByIdAndEmployeeId = async(data)=>{
    const [rows] = await findByIdAndEmployeeId(data);
    return rows[0];
}

export const leave_findByIdAndDelete = async(id)=>{
    const [result] = await findByIdAndDelete(id);
    return result; //metadata object 
}

export const leave_updateStatusById = async(data)=>{
    const result =  await updateStatusById(data)
    return result; //metadata object
}