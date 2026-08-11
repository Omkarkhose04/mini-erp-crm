import express from "express";
import {
    createProductController,
    getProductsController,
    getProductController,
    updateProductController,
} from "../controllers/product.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    createProductController
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getProductsController
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getProductController
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN", "WAREHOUSE"),
    updateProductController
);

export default router;