import express from 'express';
import { loginUser,registerUser,adminLogin, verifyOtp, getAllUsers, deleteUser, getUserProfile } from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/verify', verifyOtp);
userRouter.post('/profile', authUser, getUserProfile)
userRouter.get('/admin/users', adminAuth, getAllUsers);
userRouter.delete('/admin/users/:userId', adminAuth, deleteUser);


export default userRouter;
