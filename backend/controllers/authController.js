import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

const getAuthErrorResponse = (error, fallbackMessage) => {
  if (error?.name === 'PrismaClientInitializationError') {
    return {
      status: 503,
      message: 'Database is temporarily unavailable. Please try again in a moment.'
    };
  }

  return {
    status: 500,
    message: fallbackMessage
  };
};

export const register = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role: 'NORMAL' // Hardcoded for public signup
      }
    });

    res.status(201).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    const response = getAuthErrorResponse(error, 'Server error during registration');
    res.status(response.status).json({ success: false, message: response.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Generic error to prevent enumeration
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    const response = getAuthErrorResponse(error, 'Server error during login');
    res.status(response.status).json({ success: false, message: response.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    const response = getAuthErrorResponse(error, 'Server error during password update');
    res.status(response.status).json({ success: false, message: response.message });
  }
};
