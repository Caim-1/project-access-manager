import type { Request, Response } from "express";
import { createNote, getNotesByUser } from "../services/notes.service.js";

export async function create(req: Request, res: Response) {
  // `authenticate` guarantees req.user exists
  const userId = req.user!.userId;
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const note = await createNote(userId, title, content);

  res.status(201).json(note);
}

export async function list(req: Request, res: Response) {
  const userId = req.user!.userId;

  const notes = await getNotesByUser(userId);

  res.json(notes);
}
