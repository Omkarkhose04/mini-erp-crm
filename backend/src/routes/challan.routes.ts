import express from "express";
import {
    createChallanController,
    confirmChallanController,
    getChallansController,
    getChallanController,
    cancelChallanController,
} from "../controllers/challan.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN", "SALES"),
    createChallanController
);

router.post(
    "/:id/confirm",
    authenticate,
    authorize("ADMIN", "SALES"),
    confirmChallanController
);

router.get(
    "/",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getChallansController
);

router.get(
    "/:id",
    authenticate,
    authorize("ADMIN", "SALES", "WAREHOUSE", "ACCOUNTS"),
    getChallanController
);

router.post(
    "/:id/cancel",
    authenticate,
    authorize("ADMIN", "SALES"),
    cancelChallanController
);

export default router;