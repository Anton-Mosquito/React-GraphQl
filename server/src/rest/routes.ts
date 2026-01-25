import { Router } from 'express';
import validateMiddleware from '../middleware/validate.middleware.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { authLimiter, activationLimiter } from '../middleware/rate-limit.js';
import {
  registrationSchema,
  loginSchema,
} from '../modules/auth/auth.schema.js';
import authController from '../modules/auth/auth.controller.js';

const router = Router();

router.post(
  '/registration',
  authLimiter,
  validateMiddleware(registrationSchema),
  authController.registration.bind(authController),
);
router.post(
  '/login',
  authLimiter,
  validateMiddleware(loginSchema),
  authController.login.bind(authController),
);
router.post('/logout', authController.logout.bind(authController));
router.get(
  '/activate/:link',
  activationLimiter,
  authController.activate.bind(authController),
);
router.get('/refresh', authController.refresh.bind(authController));
router.get(
  '/users',
  authMiddleware,
  authController.getUsers.bind(authController),
);

export default router;
