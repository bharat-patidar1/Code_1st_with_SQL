import express from 'express'
import { deleteEmployeeById, employeeLogin, employeeLogout, employeeRegister, getAllEmployees, getEmployeeDetail, updatePassword, updateProfilePhoto } from '../controllers/employee.controller.js';
import { isAuthenticatedAdmin, isAuthenticatedEmployee } from '../middleware/isAuthenticated.js'
import { singleUpload } from '../middleware/multer.js';
const router = express.Router();

router.route('/register').post(employeeRegister);
router.route('/login').post(employeeLogin);
router.route('/logout').get(employeeLogout);
router.route('/updatePassword').put(updatePassword);
router.route('/delete/:id').delete(isAuthenticatedAdmin , deleteEmployeeById);
router.route('/get').get(isAuthenticatedAdmin , getAllEmployees);
router.get('/get/:id', isAuthenticatedAdmin, getEmployeeDetail);
router.post('/profile', isAuthenticatedEmployee , singleUpload , updateProfilePhoto);

export default router;