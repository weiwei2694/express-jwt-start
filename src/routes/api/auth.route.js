import express from 'express';
import {
  login,
  logoutController,
  refreshTokenController,
  register,
} from '../../controllers/auth.controller.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshTokenController);
router.post('/logout', logoutController);

export default router;
