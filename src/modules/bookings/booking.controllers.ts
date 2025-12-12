import { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

// create a booking
const createABooking = async (req: Request, res: Response) => {
    try {
        const result: any = await bookingServices.createABooking(req.body);
        console.log(result)

        // if vehicle is not booked
        if (result.rowCount === 0) {
            return res.status(500).json({
                success: false,
                message: result
            })
        }

        // if vehicle booked
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// get all bookings 
const getAllBookings = async (req: Request, res: Response) => {
    try {
        const role = req.user;
        const result = await bookingServices.getAllBookings(role as JwtPayload);
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


// update booking info 
const updateBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;
        const result = await bookingServices.updateBooking(bookingId as string, status as string);
        if (!bookingId) {
            res.status(500).json({
                success: false,
                message: "Booking not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Booking marked as returned. Vehicle is now available",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const bookingControllers = {
    createABooking,
    getAllBookings,
    updateBooking
}