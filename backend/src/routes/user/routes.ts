import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { me } from "../../controllers/user/index.js";

const router = Router();

router.get("/me", authenticate, me);

export default router;
