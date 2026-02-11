import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db.js";

export async function logout(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;

  if (token) {
    const storedTokens = await db.refreshTokens.findAll();

    for (const rt of storedTokens) {
      const match = await bcrypt.compare(token, rt.token_hash);

      if (match) {
        await db.refreshTokens.delete(rt.id);
        break;
      }
    }
  }

  res.clearCookie("refreshToken");
  res.sendStatus(204);
}
