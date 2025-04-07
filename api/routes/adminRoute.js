import  express from "express";
import { registerUser, fetchUser, fetchUsers, deleteUser, seedDoctor, deleteAllUser } from "../controllers/adminController.js";
const router=express.Router();

router.post('/register',registerUser);

//to get all users, simply use the url
//to get all users with particular role, use like '/get_all_users?role=doctor'   (say)
router.get('/get-all-users', fetchUsers);

router.post('/get-user', fetchUser);

router.delete('/delete-user', deleteUser);
router.get('/seed-doctor',seedDoctor)
router.delete('/delete-all-users',deleteAllUser);

export default router;