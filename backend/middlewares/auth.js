import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, email: true, name: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden: Insufficient role permissions' });
    }
    next();
  };
};
