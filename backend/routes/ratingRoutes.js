import { Router } from 'express';
import { verifyToken, requireRole } from '../middlewares/auth.js';
import { submitRating, modifyRating, getStoreReviews } from '../controllers/ratingController.js';
import { submitRatingValidation, updateRatingValidation } from '../validators/index.js';

const router = Router();

router.use(verifyToken, requireRole(['NORMAL']));

router.post('/', submitRatingValidation, submitRating);
router.put('/:id', updateRatingValidation, modifyRating);
router.get('/store/:storeId', getStoreReviews);

export default router;
