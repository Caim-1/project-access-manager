import type { Request, Response } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getPaginatedNotes,
  updateNote,
} from "../services/notes.service.js";

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

  // Extract query params with defaults
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  if (page < 1 || limit < 1) {
    throw new AppError("Invalid pagination parameters", 400);
  }

  const { data, total } = await getPaginatedNotes(userId, page, limit);

  const totalPages = Math.ceil(total / limit);

  res.json({ data, page, limit, total, totalPages });
}

export async function getOne(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const note = await getNoteById(id as string, userId);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
}

export async function update(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;
  const { title, content } = req.body;

  const note = await updateNote(id as string, userId, title, content);

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(note);
}

export async function remove(req: Request, res: Response) {
  const userId = req.user!.userId;
  const { id } = req.params;

  const deletedCount = await deleteNote(id as string, userId);

  if (deletedCount === 0) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.sendStatus(204);
}
