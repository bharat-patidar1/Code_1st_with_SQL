
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Login } from './components/auth/Login'
import AdminDashboard from './components/admin/AdminDashBoard'
import EmployeeOverview from './components/admin/EmployeeOverview'
import EmployeeDetail from './components/admin/EmployeeDetail'
import EmployeeList from './components/admin/EmployeeList'
import EmployeeDashboard from './components/employee/EmployeeDashboard'
import ForgotPassword from './components/employee/ForgetPassword'
import AttendanceHistory from './components/employee/AttendanceHistory'
import ApplyLeave from './components/leave/ApplyLeave'
import MyLeaves from './components/leave/MyLeaves'
import AdminWorkHours from './components/admin/AdminWorkHours'
import AdminAttendanceSummary from './components/admin/AdminAttendanceSummary'
import EmployeeLeaves from './components/admin/EmployeeLeaves'
import EmployeeProfile from './components/employee/EmployeeProfile'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
          {/* employee route control by admin */}
          <Route path="/admin/dashboard/overview" element={<EmployeeOverview/>}></Route>
          <Route path="/admin/dashboard/employee/:_id" element={<EmployeeDetail/>}></Route>
          <Route path="/admin/dashboard/employees" element={<EmployeeList/>}></Route>
          <Route path="/admin/dashboard/workhour" element={<AdminWorkHours/>}></Route>
          <Route path="/admin/dashboard/attendanceSummary" element={<AdminAttendanceSummary/>}></Route>
          <Route path="/admin/dashboard/employeeLeaves" element={<EmployeeLeaves/>}></Route>
          {/* employee routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard/>}></Route>
          <Route path="/employee/forgetPassword" element={<ForgotPassword/>}></Route>
          <Route path="/employee/dashboard/history" element={<AttendanceHistory/>}></Route>
          <Route path="/employee/dashboard/profile" element={<EmployeeProfile/>}></Route>
          {/* leave */}
          <Route path="/employee/dashboard/applyLeave" element={<ApplyLeave/>}></Route>
          <Route path="/employee/dashboard/leaves" element={<MyLeaves/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
