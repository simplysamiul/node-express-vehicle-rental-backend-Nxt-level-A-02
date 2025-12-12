import express from 'express';
import { auth } from '../../middleware/auth';
import { bookingControllers } from './booking.controllers';

const router = express.Router();


// create a booking 
router.post("/",auth("admin", "customer"), bookingControllers.createABooking )




export const bookingRoutes = router;