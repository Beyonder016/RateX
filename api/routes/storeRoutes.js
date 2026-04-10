import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { getStoresWithUserRating, getOwnerDashboard, getOwnerRatingsList, getStoreById } from '../controllers/storeController.js';

const router = Router();

// Store owners
router.get('/owner', verifyToken, requireRole(['STORE_OWNER']), getOwnerDashboard);
router.get('/owner/ratings', verifyToken, requireRole(['STORE_OWNER']), getOwnerRatingsList);

// Normal users, admins, and store owners can browse stores
router.get('/', verifyToken, requireRole(['NORMAL', 'ADMIN', 'STORE_OWNER']), getStoresWithUserRating);
router.get('/:id', verifyToken, requireRole(['NORMAL', 'ADMIN', 'STORE_OWNER']), getStoreById);

export default router;
    