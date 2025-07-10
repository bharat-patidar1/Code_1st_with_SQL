import { findAllName , findOneByEmail , create ,findByEmailAndUpdatePassword  , findAll , findByIdAndDelete , findByQuery , findById} from '../queries/employee.query.js'

export const employee_findById = async (id)=>{
    const [employee] = await findById(id);
    return employee[0];
}

export const employee_findAllName = async () => {
    const [name] = await findAllName();
    return name;    
}

export const employee_findOneByEmail = async (email) => {
    const [employee] = await findOneByEmail(email);
    return employee[0];
}

export const employee_create = async (employeeData) => {
    const [employee] = await create(employeeData);
    return employee; //it is result object
}

export const employee_findByEmailAndUpdatePassword = async (data) => {
    const [employee] = await findByEmailAndUpdatePassword(data);
    return employee; //meta data
}    

export const employee_findByIdAndDelete = async (id) => {
     await findByIdAndDelete(id);
    return true;
}

export const emmployee_findByQuery = async (keyword) => {
    const [employee] = await findByQuery(keyword);
    return employee;
}

export const employee_findAll = async () => {
    const [employee] = await findAll();
    return employee;
}