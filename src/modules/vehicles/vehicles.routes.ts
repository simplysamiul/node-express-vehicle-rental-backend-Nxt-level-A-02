import express from 'express';
import { vehicleControllers } from './vehicles.controller';
import { auth } from '../../middleware/auth';

const router = express.Router();

// create vehcile
router.post("/",auth("admin"), vehicleControllers.createVehile);

// get all vehicles
router.get("/", vehicleControllers.getAllVehicles);

// get vehicles by id
router.get("/:vehicleId", vehicleControllers.getSingleVehicle);


export const vehilceRoutes = router;