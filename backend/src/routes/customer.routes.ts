import express from "express";
import {
    createCustomerController,
    getCustomersController,
    getCustomerController,
    updateCustomerController,
    addFollowUpController
} from "../controllers/customer.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "SALES"),
    createCustomerController
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getCustomersController
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getCustomerController
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN", "SALES"),
    updateCustomerController
);

router.post(
    "/:id/followups",
    authenticate,
    authorize("ADMIN", "SALES"),
    addFollowUpController
);

export default router;