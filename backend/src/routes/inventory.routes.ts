import express from "express";
import {
    createStockMovementController,
    getStockMovementsController,
} from "../controllers/inventory.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/movement",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    createStockMovementController
);

router.get(
    "/movements",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getStockMovementsController
);

export default router;