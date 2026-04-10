import { body, validationResult } from 'express-validator';

export const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('name')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail().withMessage('Invalid email format'),
  body('address')
    .isString().withMessage('Address must be a string')
    .isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('password')
    .isString()
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least 1 uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least 1 special character'),
  validateResult
];

export const passwordUpdateValidation = [
  body('newPassword')
    .isString()
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least 1 uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least 1 special character'),
  validateResult
];

export const submitRatingValidation = [
  body('value')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('storeId').isUUID().withMessage('Valid store ID is required'),
  validateResult
];

export const updateRatingValidation = [
  body('value')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  validateResult
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isString().notEmpty().withMessage('Password is required'),
  validateResult
];

// Reusing for admin creation
export const adminUserCreationValidation = registerValidation;

export const storeCreationValidation = [
  body('name').isString().notEmpty().withMessage('Store name is required'),
  body('email').isEmail().withMessage('Invalid store email format'),
  body('address').isString().isLength({ max: 400 }).withMessage('Address cannot exceed 400 characters'),
  body('ownerId').isUUID().withMessage('Valid owner ID is required'),
  validateResult
];
