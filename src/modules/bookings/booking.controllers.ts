import { Request, Response } from "express";
import { bookingServices } from "./booking.services";

// create a booking
const createABooking = async (req: Request, res: Response) => {
    try {
        const result:any = await bookingServices.createABooking(req.body);
        console.log(result)

        // if vehicle is not booked
        if(result.rowCount === 0){
            return res.status(500).json({
                success:false,
                message:result
            })
        }

        // if vehicle booked
        res.status(201).json({
            success:true,
            message: "Booking created successfully",
            data:result.rows[0]
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const bookingControllers = {
    createABooking,
}