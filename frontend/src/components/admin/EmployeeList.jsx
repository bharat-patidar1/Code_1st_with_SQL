// EmployeeList.jsx — Full Employee Management Page

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import AddEmployeeModal from "./AddEmployeeModel";
import { Employee_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { useGetAllEmployees } from "../hooks/useGetAllEmployees";
import { fetchAllEmployees } from "@/api/fetchAllEmployee";
import AdminNavbar from "./AdminNavbar";
// import EditEmployeeModal from "./EditEmployeeModal"; // optional

export default function EmployeeList() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { allEmployees } = useSelector(store => store.employee)
  const { loading } = useSelector(store => store.load)
  const dispatch = useDispatch();
  // const [editEmployee, setEditEmployee] = useState(null); // optional

  const navigate = useNavigate();

  useGetAllEmployees();

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    setDeletingId(id);
    try {
      const res = await axios.delete(`${Employee_API_END_POINT}/delete/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        await fetchAllEmployees(dispatch);
      }
    } catch (err) {
      console.error("Failed to delete employee", err);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Manage Employees</h1>
          <Button onClick={() => setShowAddModal(true)}>+ Add Employee</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Department</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allEmployees?.map(emp => (
                    <TableRow key={emp._id}>
                      <TableCell
                        className="cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/employees/${emp._id}`)}
                      >
                        {emp.name}
                      </TableCell>
                      <TableCell>{emp.email}</TableCell>
                      <TableCell >{emp.department}</TableCell>
                      <TableCell>{emp.status}</TableCell>
                      <TableCell className="space-x-2">
                        {/* <Button variant="outline" onClick={() => setEditEmployee(emp)}>Edit</Button> */}
                        <Button variant="destructive" onClick={() => handleDelete(emp._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Employee Modal */}
        {showAddModal && <AddEmployeeModal onClose={() => setShowAddModal(false)} onSuccess={() => {
          setShowAddModal(false)
          return fetchAllEmployees(dispatch)
        }} />}

        {/* Edit Employee Modal (optional) */}
        {/* {editEmployee && (
        <EditEmployeeModal
          employee={editEmployee}
          onClose={() => setEditEmployee(null)}
          onSuccess={fetchEmployees}
        />
      )} */}
      </div>
    </div>
  );
}
