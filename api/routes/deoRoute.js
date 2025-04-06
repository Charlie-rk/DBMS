import express from "express";
import { testEntry, treatmentEntry, uploadReport, viewReports } from "../controllers/deoController.js";

const router = express.Router();

router.post('/test-entry', testEntry);
router.post('/treatment-entry', treatmentEntry);
router.post('/upload-report', uploadReport);
router.get('/reports', viewReports);

export default router;
