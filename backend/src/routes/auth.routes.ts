import { Router } from "express";
import { login, logout, refresh, register } from "../controllers/auth/index.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/register", register);

export default router;
