import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.services";

// create vehicle
const createVehile = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// get all vehicles
const getAllVehicles = async (re: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// get vehicle by id 
const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicleServices.getSingleVehicle(vehicleId as string);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

// update vehicle by id 
const updateSingleVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const result = await vehicleServices.updateSingleVehicle(req.body, vehicleId as string);
        res.status(200).json({
            succes:true,
            message: "Vehicle updated successfully",
            data: result.rows[0]
        })
    } catch (error:any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



export const vehicleControllers = {
    createVehile,
    getAllVehicles,
    getSingleVehicle,
    updateSingleVehicle
}