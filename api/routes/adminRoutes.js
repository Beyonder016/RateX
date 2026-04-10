import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import {
  getDashboard,
  getUsers,
  createUser,
  deleteUser,
  getUserById,
  getStores,
  createStore
} from '../controllers/adminController.js';
import {
  adminUserCreationValidation,
  idParamValidation,
  storeCreationValidation
} from '../validators/index.js';

const router = Router();

// All admin routes are protected and require ADMIN role
router.use(verifyToken, requireRole(['ADMIN']));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.post('/users', adminUserCreationValidation, createUser);
router.get('/users/:id', idParamValidation, getUserById);
router.delete('/users/:id', idParamValidation, deleteUser);
router.get('/stores', getStores);
router.post('/stores', storeCreationValidation, createStore);

export default router;
