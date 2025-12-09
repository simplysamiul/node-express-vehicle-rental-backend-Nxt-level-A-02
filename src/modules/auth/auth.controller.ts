import { Request, Response } from "express"
import { authServices } from "./auth.service";

// create user
const createUser = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const result = await authServices.createUser(req.body);
        if (password.length < 6) {
            return res.status(500).json({
                success: false,
                message: "User password must be minimum 6 character..!"
            })
        }
        res.status(201).json({
            sucess: true,
            message: "User registered successfully..!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
};

// login user
const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await authServices.loginUser(email, password);

        // if user not found or provide wrong password
        if (result === false || result === null) {
            return res.status(404).json({
                sucess: false,
                message: `${result === false ? "Please provide correct password" : "User not found"}`
            })
        }

        // after getting user successfully 
        res.status(201).json({
            success: true,
            message: "Login successful",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            sucess: false,
            message: error.message
        })
    }
}



export const authController = {
    createUser,
    loginUser
}