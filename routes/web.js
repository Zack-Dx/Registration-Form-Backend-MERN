import express from 'express';
import homeController from '../controllers/homeController.js';
import registerController from '../controllers/auth/registerController.js';
import loginController from '../controllers/auth/loginController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
// Routing
router.get('/', auth, homeController.index);
router.get('/register', registerController.register);
router.post('/register', registerController.postRegister);
router.get('/login', loginController.login);
router.post('/login', loginController.postLogin);
router.get('/logout', auth, loginController.logout);

export { router };
