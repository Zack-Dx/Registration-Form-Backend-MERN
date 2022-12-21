import express from 'express';
import homeController from '../controllers/homeController.js';
import authController from '../controllers/auth/authController.js';
const router = express.Router();
// Routing
router.get('/', homeController.index);
router.get('/register', authController.register);
router.post('/register', authController.postRegister);

export { router };
