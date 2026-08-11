import { Request, Response } from "express";
import {
    createCustomer,
    getCustomers,
    getCustomerById,
    updateCustomer,
    addFollowUp,
} from "../services/customer.service.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export async function createCustomerController(
    req: Request,
    res: Response
) {
    try {
        const customer = await createCustomer(req.body);

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer,
        });
    } catch (error) {
        console.error("Create customer error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to create customer",
        });
    }
}

export async function getCustomersController(
    req: Request,
    res: Response
) {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : undefined;

        const customers = await getCustomers(search);

        res.status(200).json({
            success: true,
            customers,
        });
    } catch (error) {
        console.error("Get customers error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customers",
        });
    }
}

export async function getCustomerController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        const customer = await getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found",
            });
        }

        res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        console.error("Get customer error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch customer",
        });
    }
}

export async function updateCustomerController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        const customer = await updateCustomer(id, req.body);

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            customer,
        });
    } catch (error) {
        console.error("Update customer error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to update customer",
        });
    }
}

export async function addFollowUpController(
    req: AuthRequest,
    res: Response
) {
    try {
        const customerId = Number(req.params.id);
        const { note, followUpDate } = req.body;

        if (Number.isNaN(customerId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid customer ID",
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!note || !followUpDate) {
            return res.status(400).json({
                success: false,
                message: "Note and follow-up date are required",
            });
        }

        const followUp = await addFollowUp(
            customerId,
            note,
            followUpDate,
            req.user.userId
        );

        res.status(201).json({
            success: true,
            message: "Follow-up added successfully",
            followUp,
        });
    } catch (error) {
        console.error("Add follow-up error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to add follow-up",
        });
    }
}