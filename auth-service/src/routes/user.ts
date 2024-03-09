import express from "express";
const router = express.Router();
import { UserController } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyUser";
const userController = new UserController();

router.get('/', verifyToken ,userController.home);
router.post('/auth/register' ,userController.signUp);
router.post('/auth/login' , userController.signIn);

export default router;