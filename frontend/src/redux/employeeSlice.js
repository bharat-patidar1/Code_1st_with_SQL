import { createSlice } from "@reduxjs/toolkit";


const employeeSlice = createSlice({
    name : "employee",
    initialState : {
        employee : null,
        allEmployees : [],
        totalHours : null
    },
    reducers :{
        //actions
        setAllEmployees : (state , action)=>{
            state.allEmployees = action.payload;
        },
        setTotalHours : (state , action)=>{
            state.totalHours = action.payload
        },
        setEmployee : (state , action)=>{
            state.employee = action.payload
        }
    }
})
export const {setAllEmployees , setTotalHours , setEmployee} = employeeSlice.actions;
export default employeeSlice.reducer;