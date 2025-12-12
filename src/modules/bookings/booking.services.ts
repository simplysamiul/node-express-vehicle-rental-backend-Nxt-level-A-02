import { Request } from 'express';
import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import { BookingBody } from "../../types/types";

const createABooking = async (payload: BookingBody) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const vehicle = await pool.query(`SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id=$1`, [vehicle_id]);
    // if vehicle not found
    if (vehicle.rowCount === 0) {
        return "Vehicle not found";
    }

    // if vehicle not available
    if (vehicle.rows[0].availability_status !== "available") {
        return "Vehicle is unavailable"
    }

    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const total_days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const total_price = Number(vehicle.rows[0].daily_rent_price) * Number(total_days);

    // after booking
    const vehicleBooking = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price)
        VALUES ($1, $2, $3, $4, $5) RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
        [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);

    const bookingId = vehicleBooking.rows[0].id;

    const result = await pool.query(
        `
    SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'daily_rent_price', v.daily_rent_price
      ) AS vehicle
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
    `,
        [bookingId]
    );

    // Update vehicle status to booked
    await pool.query(
        `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
        [vehicle_id]
    );

    return result;
};


// get all bookings
const getAllBookings = async (role: JwtPayload) => {

    if (role.role === "admin") {
        const result = await pool.query(`
                 SELECT
                    b.id,
                    b.customer_id,
                    b.vehicle_id,
                    b.rent_start_date,
                    b.rent_end_date,
                    b.total_price,
                    b.status,
                    json_build_object('name', u.name, 'email', u.email) AS customer,
                    json_build_object('vehicle_name', v.vehicle_name, 'registration_number', v.registration_number) AS vehicle
                FROM bookings b
                JOIN vehicles v ON b.vehicle_id = v.id
                JOIN users u ON b.customer_id = u.id
                ORDER BY b.created_at DESC
            `);

        return result.rows;
    } else if (role.role === "customer") {
        const result = await pool.query(`
            SELECT
                b.id,
                b.vehicle_id,
                b.rent_start_date,
                b.rent_end_date,
                b.total_price,
                b.status,
                json_build_object(
                'vehicle_name', v.vehicle_name,
                'registration_number', v.registration_number,
                'type', v.type
                ) AS vehicle
            FROM bookings b
            JOIN vehicles v ON b.vehicle_id = v.id
            WHERE b.customer_id = $1
            ORDER BY b.created_at DESC
            `);

        return result.rows[0];
    }
}

// update bookig by id
const updateBooking = async (id: string, status: string) => {
    const bookingResult = await pool.query(
        `UPDATE bookings 
         SET status = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [status, id]
    );

    if (bookingResult.rowCount === 0) {
        throw new Error("Booking not found");
    }

    const booking = bookingResult.rows[0];

    // update vehicle availability status
    await pool.query(
        `UPDATE vehicles 
         SET availability_status = 'available', updated_at = NOW()
         WHERE id = $1`,
        [booking.vehicle_id]
    );

    const result = await pool.query(`
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,
            json_build_object(
                'availability_status', v.availability_status
            ) AS vehicle
        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = $1
    `, [id]);

    return result;
}


export const bookingServices = {
    createABooking,
    getAllBookings,
    updateBooking
}