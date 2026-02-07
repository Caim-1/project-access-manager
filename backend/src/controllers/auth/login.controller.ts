import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";
import { findUserByEmail } from "../../services/user.service.js";
import { signAccessToken, signRefreshToken } from "../../utils/tokens.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(401).json({ message: "Invalid credentials" });

  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const newAccessToken = signAccessToken({ userId: user.id });
  const newRefreshToken = signRefreshToken({ userId: user.id });

  await db.refreshTokens.create({
    id: uuidv4(),
    userId: user.id,
    tokenHash: await bcrypt.hash(newRefreshToken, 10),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth/refresh",
  });

  res.json({ accessToken: newAccessToken });
}
