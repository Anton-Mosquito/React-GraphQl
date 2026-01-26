import { Router } from 'express';
import {
  validateMiddleware,
  authMiddleware,
  authLimiter,
  activationLimiter,
} from '#middleware/index.js';
import { registrationSchema, loginSchema } from '#schema/auth.schema.js';
import { AuthController } from '#modules/index.js';

const router = Router();

router.post(
  '/registration',
  authLimiter,
  validateMiddleware(registrationSchema),
  AuthController.registration.bind(AuthController),
);
router.post(
  '/login',
  authLimiter,
  validateMiddleware(loginSchema),
  AuthController.login.bind(AuthController),
);
router.post('/logout', AuthController.logout.bind(AuthController));
router.get(
  '/activate/:link',
  activationLimiter,
  AuthController.activate.bind(AuthController),
);
router.get('/refresh', AuthController.refresh.bind(AuthController));
router.get(
  '/users',
  authMiddleware,
  AuthController.getUsers.bind(AuthController),
);

export default router;
