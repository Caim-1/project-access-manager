import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../services/user.service.js";

const SALT_ROUNDS = 10;

export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser(email, passwordHash);

  return res.status(201).json(user);
}
