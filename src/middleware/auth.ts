import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from "../config";

export const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;
            const token = authHeader?.split(" ")[1];

            // if we didn't get jwt token
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication failed"
                })
            };

            // decode jwt toke
            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
            // set userinfo in the req
            req.user = decoded as JwtPayload;

            // check role 
            if (decoded.role === "customer" && req.user.id !== Number(req.params.userId)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You do not have permission to perform this action."
                })
            }
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied. You do not have permission to perform this action."
                })
            }

           

            // if the role is match and verify the token successfully
            next();

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            })
        }
    }
}