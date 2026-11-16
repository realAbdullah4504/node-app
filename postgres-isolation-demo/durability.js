
const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function setup() {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS durability_demo (
      id SERIAL PRIMARY KEY,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

// Experiment 1: Write and commit data
async function writeData() {
    const client = await pool.connect();

    try {
        console.log("Starting transaction...");

        await client.query("BEGIN");

        const result = await client.query(
            `INSERT INTO durability_demo (message)
       VALUES ($1)
       RETURNING *`,
            ["This record must survive a database restart"]
        );

        console.log("Inserted:", result.rows[0]);

        await client.query("COMMIT");

        console.log("Transaction committed!");

        // Get current WAL position
        const wal = await client.query(
            "SELECT pg_current_wal_lsn() AS wal_position"
        );

        console.log("WAL position:", wal.rows[0].wal_position);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

// Experiment 2: Read previously committed data
async function readData() {
    const result = await pool.query(`
    SELECT *
    FROM durability_demo
    ORDER BY id DESC
    LIMIT 5;
  `);

    console.log("\nRecords found in PostgreSQL:");

    console.table(result.rows);
}

async function main() {
    const mode = process.argv[2];

    try {
        await setup();

        if (mode === "write") {
            await writeData();
        } else if (mode === "read") {
            await readData();
        } else {
            console.log("Usage: node durability.js write");
            console.log("       node durability.js read");
        }
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await pool.end();
    }
}

main();
