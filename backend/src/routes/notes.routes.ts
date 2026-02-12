import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.js";
import * as notesController from "../controllers/notes.controller.js";

const router = Router();

// All notes routes require authentication
router.use(authenticate);
router.get("/", notesController.list);
router.get("/:id", notesController.getOne);
router.post("/", notesController.create);
router.put("/:id", notesController.update);
router.delete("/:id", notesController.remove);

export default router;
