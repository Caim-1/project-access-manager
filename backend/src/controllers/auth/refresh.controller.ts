import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";
import { signAccessToken, signRefreshToken } from "../../utils/tokens.js";

export async function refresh(req: Request, res: Response) {
  const token = req.cookies?.refreshToken;
  if (!token) return res.sendStatus(401);

  let payload: JwtPayload | string;
  try {
    payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    return res.sendStatus(403);
  }

  if (typeof payload !== "object" || payload === null || !("userId" in payload))
    return res.sendStatus(403);

  const storedTokens = await db.refreshTokens.findByUserId(payload.userId);

  const matchingToken = storedTokens.find((rt) =>
    bcrypt.compare(token, rt.tokenHash),
  );

  if (!matchingToken) return res.sendStatus(403);

  // Rotate
  await db.refreshTokens.delete(matchingToken.id);

  const newRefreshToken = signRefreshToken({ userId: payload.userId });
  const newAccessToken = signAccessToken({ userId: payload.userId });

  await db.refreshTokens.create({
    id: uuidv4(),
    userId: payload.userId,
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
