import express, { Request, Response } from "express";
import { initDb } from "./config/db";
import { authRoutes } from "./modules/auth/auth.route";

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

// ******************** USERS Routes ******************** //
// app.use("/api/v1/auth", userRoutes)

// ******************** VEHICLES Routes ******************** //


// ******************** BOOKING Routes ******************** //


export default app;