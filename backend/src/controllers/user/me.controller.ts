import type { Request, Response } from "express";
import { findById } from "../../services/user.service.js";

export async function me(req: Request, res: Response) {
  const userId = req.user!.userId;

  const user = await findById(userId);

  if (!user) {
    return res.sendStatus(404);
  }

  res.json({
    id: user.id,
    email: user.email,
  });
}
