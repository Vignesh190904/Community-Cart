import express from "express";
import { getAdminDashboard } from "../controllers/adminReports.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/dashboard", verifyToken, getAdminDashboard);

export default router;
