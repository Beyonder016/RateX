import express from 'express';
import cors from 'cors';
import authRoutes from '../backend/routes/authRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';
import storeRoutes from '../backend/routes/storeRoutes.js';
import ratingRoutes from '../backend/routes/ratingRoutes.js';
import wishlistRoutes from '../backend/routes/wishlistRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/wishlists', wishlistRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'RateX API is running', ok: true });
});

export default app;
