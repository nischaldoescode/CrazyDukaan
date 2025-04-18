import express from 'express';
import { loginUser,registerUser,adminLogin, verifyOtp, getAllUsers, deleteUser} from '../controllers/userController.js';
import adminAuth from '../middleware/adminAuth.js';
const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/verify', verifyOtp);

userRouter.get('/admin/users', adminAuth, getAllUsers);
userRouter.delete('/admin/users/:userId', adminAuth, deleteUser);


export default userRouter;