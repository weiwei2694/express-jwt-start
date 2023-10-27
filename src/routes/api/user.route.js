import express from 'express';
import { getUsersController } from '../../controllers/user.controller.js';
import { verifyToken } from '../../middlewares/auth.js';
const router = express.Router();

router.route('/').get(verifyToken, getUsersController);

export default router;
