import prisma from '../prisma.js';

export const getStoresWithUserRating = async (req, res) => {
  try {
    const userId = req.user.id;
    let { search, sortBy = 'averageRating', order = 'desc', page = 1, limit = 10, includeTotal = 'true' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      include: {
        ratings: {
          where: { userId },
          select: { value: true, id: true }
        },
        wishlists: {
          where: { userId },
          select: { id: true }
        }
      }
    });

    // Restructure to include userRating cleanly
    const formattedStores = stores.map(store => {
      const userRatingObj = store.ratings[0];
      const isWishlisted = store.wishlists.length > 0;
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        averageRating: store.averageRating,
        userRatingId: userRatingObj ? userRatingObj.id : null,
        myRating: userRatingObj ? userRatingObj.value : null,
        isWishlisted
      };
    });

    const data = { stores: formattedStores, page, limit };

    if (includeTotal !== 'false') {
      data.total = await prisma.store.count({ where });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // An owner only has one store
    const store = await prisma.store.findUnique({
      where: { ownerId: userId }
    });

    if (!store) {
      return res.status(404).json({ success: false, message: 'Store not found for this owner.' });
    }

    res.json({
      success: true,
      data: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: store.averageRating
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getOwnerRatingsList = async (req, res) => {
  try {
    const userId = req.user.id;
    let { sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const store = await prisma.store.findUnique({ where: { ownerId: userId } });
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const ratings = await prisma.rating.findMany({
      where: { storeId: store.id },
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      include: {
        user: { select: { name: true, email: true } }
      }
    });

    const total = await prisma.rating.count({ where: { storeId: store.id } });

    res.json({ success: true, data: { ratings, total, page, limit } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Usually available if verifyToken is executed

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          where: { userId },
          select: { value: true, id: true, review: true }
        },
        wishlists: {
          where: { userId },
          select: { id: true }
        },
        _count: {
          select: { ratings: true }
        }
      }
    });

    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

    const userRatingObj = store.ratings[0];
    const isWishlisted = store.wishlists.length > 0;

    const formattedStore = {
      id: store.id,
      name: store.name,
      address: store.address,
      description: store.description,
      imageUrl: store.imageUrl,
      averageRating: store.averageRating,
      totalRatings: store._count.ratings,
      userRatingId: userRatingObj ? userRatingObj.id : null,
      myRating: userRatingObj ? userRatingObj.value : null,
      myReview: userRatingObj ? userRatingObj.review : null,
      isWishlisted
    };

    res.json({ success: true, data: formattedStore });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving store details' });
  }
};
