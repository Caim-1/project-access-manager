import "dotenv/config";
import app from "./app.js";
import { pool } from "./db.js";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
