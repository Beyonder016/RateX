import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import {
  getDashboard,
  getUsers,
  createUser,
  getUserById,
  getStores,
  createStore
} from '../controllers/adminController.js';
import {
  adminUserCreationValidation,
  storeCreationValidation
} from '../validators/index.js';

const router = Router();

// All admin routes are protected and require ADMIN role
router.use(verifyToken, requireRole(['ADMIN']));

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.post('/users', adminUserCreationValidation, createUser);
router.get('/users/:id', getUserById);
router.get('/stores', getStores);
router.post('/stores', storeCreationValidation, createStore);

export default router;
