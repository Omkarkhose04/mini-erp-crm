import { Request, Response } from "express";
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
} from "../services/product.service.js";

export async function createProductController(
    req: Request,
    res: Response
) {
    try {
        const product = await createProduct(req.body);

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Create product error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to create product",
        });
    }
}

export async function getProductsController(
    req: Request,
    res: Response
) {
    try {
        const search =
            typeof req.query.search === "string"
                ? req.query.search
                : undefined;

        const products = await getProducts(search);

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("Get products error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch products",
        });
    }
}

export async function getProductController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
}

export async function updateProductController(
    req: Request,
    res: Response
) {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        const product = await updateProduct(id, req.body);

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Update product error:", error);

        res.status(400).json({
            success: false,
            message: "Failed to update product",
        });
    }
}