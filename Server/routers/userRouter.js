import express from 'express';
import { 
  get_login,
  post_login,
  post_signup,
  post_resetPwd,
  get_logout,
} from '../controllers/authController.js';
import { post_shoppingCart, post_validateCode } from '../controllers/userController.js';
import { validation } from '../middlewares/userMiddleware.js';

const router = express.Router();

router.route('/login').post(post_login).get(get_login);
router.route('/signup').post(post_signup);
router.post('/forgot-password', validation, post_resetPwd);
router.route('/shopping-cart/:id').patch(validation, post_shoppingCart);
router.get('/logout', get_logout);

router.post('/validatePromoCode', post_validateCode);

export default router;