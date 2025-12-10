import { Request, Response } from "express";
import { userServices } from "./users.service";


// get full user list
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
};


const updateAUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await userServices.updateAUser(req.body, userId as string)
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Users data not found ..!",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


// delete a specific user by id
const deleteAUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await userServices.deleteAUser(userId as string);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Users data not found ..!",
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: result.rows[0],
            })
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const userControllers = {
    getAllUsers,
    updateAUser,
    deleteAUser,
}