import  express, { Request, Response }  from 'express';
import { userControllers } from './users.controller';
import { auth } from '../../middleware/auth';


const router = express.Router();

// get all users
router.get("/",auth("admin"), userControllers.getAllUsers);


export const userRoutes = router;