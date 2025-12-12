import express from 'express';
import { auth } from '../../middleware/auth';
import { bookingControllers } from './booking.controllers';

const router = express.Router();


// create a booking 
router.post("/",auth("admin", "customer"), bookingControllers.createABooking );

// get all bookings 
router.get("/",auth("admin", "customer"), bookingControllers.getAllBookings)

// update booking info 
router.put("/:bookingId", bookingControllers.updateBooking)


export const bookingRoutes = router;