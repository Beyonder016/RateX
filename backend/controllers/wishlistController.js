import prisma from '../prisma.js';

export const toggleWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { storeId } = req.body;

    const existingId = await prisma.wishlist.findUnique({
      where: {
        userId_storeId: { userId, storeId }
      }
    });

    if (existingId) {
      await prisma.wishlist.delete({
        where: { id: existingId.id }
      });
      return res.json({ success: true, message: 'Removed from wishlist', isWishlisted: false });
    } else {
      await prisma.wishlist.create({
        data: { userId, storeId }
      });
      return res.json({ success: true, message: 'Added to wishlist', isWishlisted: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error adding wishlist' });
  }
};

export const getWishlistedStores = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlists = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        store: {
          include: {
            ratings: {
              where: { userId },
              select: { value: true, id: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedStores = wishlists.map(w => {
      const store = w.store;
      const userRatingObj = store.ratings[0];
      return {
        id: store.id,
        name: store.name,
        address: store.address,
        imageUrl: store.imageUrl,
        averageRating: store.averageRating,
        userRatingId: userRatingObj ? userRatingObj.id : null,
        myRating: userRatingObj ? userRatingObj.value : null,
        isWishlisted: true
      };
    });

    res.json({ success: true, data: { stores: formattedStores } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error retrieving wishlists' });
  }
};
