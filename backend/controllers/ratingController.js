import prisma from '../prisma.js';

// Helper to update store average rating
const updateStoreAverageRating = async (storeId) => {
  const aggr = await prisma.rating.aggregate({
    where: { storeId },
    _avg: { value: true }
  });
  
  const avg = aggr._avg.value || 0;

  await prisma.store.update({
    where: { id: storeId },
    data: { averageRating: parseFloat(avg.toFixed(2)) }
  });
};

export const submitRating = async (req, res) => {
  try {
    const { storeId, value, review } = req.body;
    const userId = req.user.id;

    // The unique constraint in DB handles duplicates natively, but we can preemptively check to return a nice message
    const existing = await prisma.rating.findUnique({
      where: { userId_storeId: { userId, storeId } }
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already rated this store.' });
    }

    const rating = await prisma.rating.create({
      data: { value, userId, storeId, review: review || null }
    });

    await updateStoreAverageRating(storeId);

    res.status(201).json({ success: true, data: rating, message: 'Rating submitted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const modifyRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, review } = req.body;
    const userId = req.user.id;

    const rating = await prisma.rating.findUnique({ where: { id } });
    
    if (!rating) {
      return res.status(404).json({ success: false, message: 'Rating not found' });
    }

    if (rating.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updateData = { value };
    if (review !== undefined) updateData.review = review || null;

    const updated = await prisma.rating.update({
      where: { id },
      data: updateData
    });

    await updateStoreAverageRating(rating.storeId);

    res.json({ success: true, data: updated, message: 'Rating updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStoreReviews = async (req, res) => {
  try {
    const { storeId } = req.params;

    const reviews = await prisma.rating.findMany({
      where: { storeId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } }
      }
    });

    const formatted = reviews.map(r => ({
      id: r.id,
      value: r.value,
      review: r.review,
      userName: r.user.name,
      userId: r.userId,
      createdAt: r.createdAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
