import  express from "express";
import { registerUser } from "../controllers/adminController.js";
const router=express.Router();

router.post('/register',registerUser);

export default router;