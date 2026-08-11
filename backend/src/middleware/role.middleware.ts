import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware.js";

export function authorize(...allowedRoles: string[]) {
    return (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        console.log("User role:", req.user.role);
        console.log("Allowed roles:", allowedRoles);

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource",
            });
        }

        next();
    };
}