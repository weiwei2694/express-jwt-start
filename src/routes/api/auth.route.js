import express from 'express';
import {
  login,
  refreshTokenController,
  register,
} from '../../controllers/auth.controller.js';
const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshTokenController);

export default router;
