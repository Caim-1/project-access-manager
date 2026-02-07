import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = {
  refreshTokens: {
    async create(data: {
      id: string;
      userId: string;
      tokenHash: string;
      expiresAt: Date;
    }) {
      await pool.query(
        `INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
         VALUES ($1, $2, $3, $4)`,
        [data.id, data.userId, data.tokenHash, data.expiresAt],
      );
    },

    async findAll() {
      const result = await pool.query(`SELECT * FROM refresh_tokens`);
      return result.rows;
    },

    async findByUserId(userId: string) {
      const result = await pool.query(
        `SELECT * FROM refresh_tokens WHERE user_id = $1`,
        [userId],
      );
      return result.rows;
    },

    async delete(id: string) {
      await pool.query(`DELETE FROM refresh_tokens WHERE id = $1`, [id]);
    },
  },
};
