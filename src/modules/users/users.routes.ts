import  express, { Request, Response }  from 'express';
import { userControllers } from './users.controller';
import { auth } from '../../middleware/auth';


const router = express.Router();

// get all users
router.get("/",auth("admin"), userControllers.getAllUsers);

// update a user by id
router.put("/:userId",auth("admin", "customer"), userControllers.updateAUser);


// delete a user by id
router.delete("/:userId", auth("admin"), userControllers.deleteAUser);


export const userRoutes = router; 