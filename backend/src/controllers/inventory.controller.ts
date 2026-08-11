import { Request, Response } from "express";
import {
    createStockMovement,
    getStockMovements,
} from "../services/inventory.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export async function createStockMovementController(
    req: AuthRequest,
    res: Response
) {
    try {
        const {
            productId,
            quantity,
            movementType,
            reason,
        } = req.body;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (
            !productId ||
            !quantity ||
            !movementType ||
            !reason
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product, quantity, movement type and reason are required",
            });
        }

        if (!["IN", "OUT"].includes(movementType)) {
            return res.status(400).json({
                success: false,
                message: "Movement type must be IN or OUT",
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0",
            });
        }

        const result = await createStockMovement({
            productId: Number(productId),
            quantity: Number(quantity),
            movementType,
            reason,
            createdById: req.user.userId,
        });

        res.status(201).json({
            success: true,
            message: "Stock movement created successfully",
            ...result,
        });
    } catch (error) {
        console.error("Create stock movement error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create stock movement";

        if (
            message === "Product not found" ||
            message === "Insufficient stock"
        ) {
            return res.status(400).json({
                success: false,
                message,
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to create stock movement",
        });
    }
}

export async function getStockMovementsController(
    req: Request,
    res: Response
) {
    try {
        const movements = await getStockMovements();

        res.status(200).json({
            success: true,
            movements,
        });
    } catch (error) {
        console.error("Get stock movements error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch stock movements",
        });
    }
}