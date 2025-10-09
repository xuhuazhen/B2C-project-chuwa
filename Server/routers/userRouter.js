import express from 'express';
import { 
  post_login,
  post_signup
} from '../controllers/authController.js'

const router = express.Router();

router.route('/login').post(post_login);
router.route('/signup').post(post_signup);

export default router;