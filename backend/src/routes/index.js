import {Router} from 'express';

import authRoutes from './authRoute.js';
import messageRoutes from './messageRoute.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/messages', messageRoutes);

export default router;