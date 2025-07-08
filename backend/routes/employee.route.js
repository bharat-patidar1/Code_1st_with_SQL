import express from 'express'
import { deleteEmployeeById, employeeLogin, employeeLogout, employeeRegister, getAllEmployees, getEmployeeDetail, updatePassword } from '../controllers/employee.controller.js';
import { isAuthenticatedAdmin } from '../middleware/isAuthenticated.js'
const router = express.Router();

router.route('/register').post(employeeRegister);
router.route('/login').post(employeeLogin);
router.route('/logout').get(employeeLogout);
router.route('/updatePassword').put(updatePassword);
router.route('/delete/:id').delete(isAuthenticatedAdmin , deleteEmployeeById);
router.route('/get').get(isAuthenticatedAdmin , getAllEmployees);
router.get('/get/:id', isAuthenticatedAdmin, getEmployeeDetail);

export default router;