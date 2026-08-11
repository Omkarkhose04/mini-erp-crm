import bcrypt from "bcrypt";
import prisma from "../config/database.js";
import { generateToken } from "../utils/jwt.js";

export async function loginUser(
    email: string,
    password: string
) {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user.id, user.role);

    return {
        user,
        token,
    };
}