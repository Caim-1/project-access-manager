import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export async function createNote(
  userId: string,
  title: string,
  content: string,
) {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO notes (id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING id, title, content`,
    [id, userId, title, content],
  );

  return result.rows[0];
}

export async function getNotesByUser(userId: string) {
  const result = await pool.query(
    `SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows;
}

export async function getNoteById(noteId: string, userId: string) {
  const result = await pool.query(
    `SELECT * FROM notes WHERE id = $1 AND user_id = $2`,
    [noteId, userId],
  );

  return result.rows[0];
}

export async function updateNote(
  noteId: string,
  userId: string,
  title: string,
  content: string,
) {
  const result = await pool.query(
    `UPDATE notes SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 AND user_id = $4`,
    [title, content, noteId, userId],
  );

  return result.rows[0];
}

export async function deleteNote(noteId: string, userId: string) {
  const result = await pool.query(
    `DELETE FROM notes WHERE id = $1 AND user_id = $2`,
    [noteId, userId],
  );

  return result.rowCount;
}
