import express from "express";
import cors from "cors";
import prisma from "./config/database.js";

import authRoutes from "./routes/auth.routes.js";

import {
    authenticate,
    AuthRequest
} from "./middleware/auth.middleware.js";

import { authorize } from "./middleware/role.middleware.js";

import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import challanRoutes from "./routes/challan.routes.js";

const app = express();

const corsOptions = {
    origin: "https://mini-erp-crm-beta-ivory.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.options(/.*/, cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Mini ERP backend is working"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ERP API is running"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {

        await prisma.$queryRaw`SELECT 1`;

        res.status(200).json({
            success: true,
            message: "Database connected successfully"
        });

    } catch (error) {

        console.error(
            "Database connection error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});


app.get(
    "/api/protected-test",
    authenticate,
    authorize("ADMIN"),
    (req: AuthRequest, res) => {

        res.status(200).json({
            success: true,
            message: "You have access to this protected route",
            user: req.user,
        });
    }
);

app.use("/api/auth", authRoutes);

app.use("/api/customers", customerRoutes);

app.use("/api/products", productRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/challans", challanRoutes);

export default app;