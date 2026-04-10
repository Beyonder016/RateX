import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { toggleWishlist, getWishlistedStores } from '../controllers/wishlistController.js';

const router = Router();

router.use(verifyToken, requireRole(['NORMAL']));

router.post('/toggle', toggleWishlist);
router.get('/', getWishlistedStores);

export default router;
