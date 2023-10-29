import express from 'express';
import { getUsersController } from '../../controllers/user.controller.js';
import { auth } from '../../middlewares/auth.js';
const router = express.Router();

router.route('/').get(auth, getUsersController);

export default router;
