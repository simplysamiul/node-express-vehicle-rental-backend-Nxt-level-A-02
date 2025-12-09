import express  from 'express';
import { authController } from './auth.controller';

const router = express.Router();

// create a user
router.post("/signup", authController.createUser);
// login user
router.post("/signin", authController.loginUser);

export const authRoutes = router;