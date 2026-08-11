import { Request, Response } from "express";
import { loginUser } from "../services/auth.service.js";

export async function login(
    req: Request,
    res: Response
) {
    try {
        const { email, password } = req.body;

        const { user, token } = await loginUser(
            email,
            password
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
}