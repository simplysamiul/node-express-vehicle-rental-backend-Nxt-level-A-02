import express from 'express';
import { auth } from '../../middleware/auth';

const router = express.Router();


// create a booking 
router.post("/",auth("admin", "customer"),  )




export const bookingRoutes = router;