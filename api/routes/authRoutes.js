import { Router } from 'express';
import { register, login, updatePassword } from '../controllers/authController.js';
import { registerValidation, loginValidation, passwordUpdateValidation } from '../validators/index.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.put('/password', verifyToken, passwordUpdateValidation, updatePassword);

export default router;
