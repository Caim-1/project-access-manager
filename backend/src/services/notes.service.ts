import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

export async function createNote(
  userId: string,
  title: string,
  content: string,
) {
  const result = await pool.query(
    `INSERT INTO notes (id, user_id, title, content) VALUES ($1, $2, $3, $4) RETURNING id, title, content`,
    [uuidv4, userId, title, content],
  );

  return result.rows[0];
}

export async function getNotesByUser(userId: string) {
  const result = await pool.query(
    `SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId],
  );

  return result.rows[0];
}
