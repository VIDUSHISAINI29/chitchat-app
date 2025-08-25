import {Router} from 'express';
import { protectRoute } from '../middleware/authMiddleware.js';
import {getUsersForSidebar, getMessages, sendMessage} from '../controllers/messageController.js';

const router = Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;