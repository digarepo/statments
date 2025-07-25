// services/db.server.ts
import mariadb from "mariadb";

const pool = mariadb.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "12345",
  database: process.env.DB_NAME || "users",
  port: Number(process.env.DB_PORT) || 3306,
  connectionLimit: 5,
});

/**
 * Generic query function to execute SQL statements with parameters.
 * @param sql The SQL query string.
 * @param params An optional array of parameters to be bound to the query.
 * @returns A promise that resolves to an array of results, typed as T[].
 */
export async function query<T = unknown>(
  sql: string,
  params?: (string | number | boolean | null | Date)[] // Added Date type for parameters
): Promise<T[]> {
  let conn;
  try {
    conn = await pool.getConnection();
    // The mariadb driver's query method returns an array of rows, which is directly T[]
    const results: T[] = await conn.query(sql, params);
    console.log(`Executed query: ${sql}`);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (conn) conn.release();
  }
}

// You can add a simple check to ensure the pool can connect
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("Successfully connected to MariaDB pool.");
    conn.release();
  } catch (err) {
    console.error("Failed to connect to MariaDB pool:", err);
    // It's good practice to exit if the database connection is critical for the app
    // process.exit(1);
  }
})();