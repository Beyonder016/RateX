import prisma from '../prisma.js';
import bcrypt from 'bcrypt';

export const getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count()
    ]);
    res.json({ success: true, data: { totalUsers, totalStores, totalRatings } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    let { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        // role search would need absolute match if enum, skip for contains
      ]
    } : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      select: { id: true, name: true, email: true, address: true, role: true, createdAt: true }
    });

    const total = await prisma.user.count({ where });

    res.json({ success: true, data: { users, total, page, limit } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;
    const normalizedRole = role || 'NORMAL';
    const allowedRoles = ['ADMIN', 'NORMAL', 'STORE_OWNER'];

    if (!allowedRoles.includes(normalizedRole)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { name, email, address, role: normalizedRole, password: hashedPassword }
    });

    res.status(201).json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.id === userId) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { store: true }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'You cannot delete the last admin account' });
      }
    }

    await prisma.$transaction(async (tx) => {
      if (user.store) {
        await tx.wishlist.deleteMany({ where: { storeId: user.store.id } });
        await tx.rating.deleteMany({ where: { storeId: user.store.id } });
        await tx.store.delete({ where: { id: user.store.id } });
      }

      await tx.wishlist.deleteMany({ where: { userId } });
      await tx.rating.deleteMany({ where: { userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    res.json({
      success: true,
      message: user.store
        ? 'User and their store were removed successfully'
        : 'User removed successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { store: true }
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      createdAt: user.createdAt
    };

    if (user.role === 'STORE_OWNER' && user.store) {
      data.storeName = user.store.name;
      data.storeRating = user.store.averageRating;
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getStores = async (req, res) => {
  try {
    let { search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const stores = await prisma.store.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
      include: {
        owner: { select: { name: true, email: true } }
      }
    });

    const total = await prisma.store.count({ where });

    res.json({ success: true, data: { stores, total, page, limit } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({ where: { id: ownerId }, include: { store: true } });
    if (!owner) return res.status(404).json({ success: false, message: 'Owner not found' });
    if (owner.role !== 'STORE_OWNER') return res.status(400).json({ success: false, message: 'Assigned user must be a STORE_OWNER' });
    if (owner.store) return res.status(400).json({ success: false, message: 'This owner already owns a store' });

    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) return res.status(400).json({ success: false, message: 'Store email already exists' });

    const store = await prisma.store.create({
      data: { name, email, address, ownerId }
    });

    res.status(201).json({ success: true, data: store });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
