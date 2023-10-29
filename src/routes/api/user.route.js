import express from 'express';
import { getUsersController } from '../../controllers/user.controller.js';
import { auth } from '../../middlewares/auth.js';
const router = express.Router();

router.route('/').get(auth('manageUser'), getUsersController);

export default router;
