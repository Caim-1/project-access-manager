import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import * as notesController from "../controllers/notes.controller.js";

const router = Router();

// All notes routes require authentication
router.use(authenticate);
router.post("/", notesController.create);
router.get("/", notesController.list);

export default router;
