import { Response } from "express";
import {
    createChallan,
    confirmChallan,
    getChallans,
    getChallanById,
    cancelChallan,
} from "../services/challan.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export async function createChallanController(
    req: AuthRequest,
    res: Response
) {
    try {
        const {
            customerId,
            items,
        } = req.body;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!customerId || !items) {
            return res.status(400).json({
                success: false,
                message: "Customer and products are required",
            });
        }

        const challan = await createChallan({
            customerId: Number(customerId),
            items,
            createdById: req.user.userId,
        });

        res.status(201).json({
            success: true,
            message: "Challan created successfully",
            challan,
        });
    } catch (error) {
        console.error("Create challan error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to create challan";

        res.status(400).json({
            success: false,
            message,
        });
    }
}

export async function confirmChallanController(
    req: AuthRequest,
    res: Response
) {
    try {
        const challanId = Number(req.params.id);

        if (Number.isNaN(challanId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid challan ID",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        const challan = await confirmChallan(
            challanId,
            req.user.userId
        );

        res.status(200).json({
            success: true,
            message: "Challan confirmed successfully",
            challan,
        });
    } catch (error) {
        console.error("Confirm challan error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to confirm challan";

        res.status(400).json({
            success: false,
            message,
        });
    }
}

export async function getChallansController(
    req: AuthRequest,
    res: Response
) {
    try {
        const challans = await getChallans();

        res.status(200).json({
            success: true,
            challans,
        });
    } catch (error) {
        console.error("Get challans error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch challans",
        });
    }
}

export async function getChallanController(
    req: AuthRequest,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid challan ID",
            });
        }

        const challan = await getChallanById(id);

        if (!challan) {
            return res.status(404).json({
                success: false,
                message: "Challan not found",
            });
        }

        res.status(200).json({
            success: true,
            challan,
        });
    } catch (error) {
        console.error("Get challan error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch challan",
        });
    }
}

export async function cancelChallanController(
    req: AuthRequest,
    res: Response
) {
    try {
        const challanId = Number(req.params.id);

        if (Number.isNaN(challanId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid challan ID",
            });
        }

        const challan = await cancelChallan(challanId);

        res.status(200).json({
            success: true,
            message: "Challan cancelled successfully",
            challan,
        });
    } catch (error) {
        console.error("Cancel challan error:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Failed to cancel challan";

        res.status(400).json({
            success: false,
            message,
        });
    }
}