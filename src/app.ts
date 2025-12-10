import express, { Request, Response } from "express";
import { initDb } from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";
import { userRoutes } from "./modules/users/users.routes";
import { vehilceRoutes } from "./modules/vehicles/vehicles.routes";
import { bookingRoutes } from "./modules/bookings/booking.routes";

const app = express();

// parser
app.use(express.json());


// call databse
initDb();

// root route
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World!')
})

// ******************** AUTH Routes ******************** //
app.use("/api/v1/auth", authRoutes);

// ******************** USERS Routes ******************* //
app.use("/api/v1/users", userRoutes)

// ******************** VEHICLES Routes **************** //
app.use("/api/v1/vehicles", vehilceRoutes)

// ******************** BOOKING Routes ***************** //
app.use("/api/v1/bookings", bookingRoutes)


export default app;