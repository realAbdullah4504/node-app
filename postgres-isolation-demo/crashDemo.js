
const { Client } = require("pg");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { randomUUID } = require("crypto");

const exec = promisify(execFile);

const DATABASE_URL = process.env.DATABASE_URL;
const CONTAINER = process.env.POSTGRES_CONTAINER || "ateitis-postgres-local";

const sleep = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Connect to PostgreSQL
async function connect() {
    const client = new Client({
        connectionString: DATABASE_URL,
        connectionTimeoutMillis: 2000,
    });

    await client.connect();
    return client;
}

// Wait until PostgreSQL is ready after restart
async function waitForPostgres() {
    console.log("Waiting for PostgreSQL...");

    for (let i = 0; i < 30; i++) {
        try {
            const client = await connect();
            await client.query("SELECT 1");
            await client.end();

            console.log("PostgreSQL is ready!");
            return;
        } catch {
            await sleep(1000);
        }
    }

    throw new Error("PostgreSQL failed to restart.");
}

// Abruptly kill the PostgreSQL container
async function crashPostgres() {
    console.log("\n!!! CRASHING POSTGRESQL !!!");

    await exec("docker", ["kill", CONTAINER]);

    console.log("PostgreSQL container killed.");
}

// Restart the same container and volume
async function restartPostgres() {
    console.log("\nRestarting PostgreSQL...");

    await exec("docker", ["start", CONTAINER]);

    await waitForPostgres();
}

// Verify whether a record exists
async function checkRecord(runId) {
    const client = await connect();

    try {
        const result = await client.query(
            `SELECT * FROM crash_demo_records WHERE run_id = $1`,
            [runId]
        );

        return result.rowCount > 0;
    } finally {
        await client.end();
    }
}

// Create experiment table
async function setup() {
    const client = await connect();

    try {
        await client.query(`
      CREATE TABLE IF NOT EXISTS crash_demo_records (
        id BIGSERIAL PRIMARY KEY,
        run_id UUID UNIQUE NOT NULL,
        scenario TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

        const settings = await client.query(`
      SELECT
        current_setting('synchronous_commit') AS synchronous_commit,
        current_setting('fsync') AS fsync;
    `);

        console.log("PostgreSQL durability settings:", settings.rows[0]);
    } finally {
        await client.end();
    }
}

// --------------------------------------------------
// EXPERIMENT 1: CRASH BEFORE COMMIT
// --------------------------------------------------

async function crashBeforeCommit() {
    console.log("\n================================");
    console.log("EXPERIMENT 1: CRASH BEFORE COMMIT");
    console.log("================================");

    const runId = randomUUID();
    const client = await connect();

    // Prevent an unhandled connection error when Docker kills PG.
    client.on("error", () => { });

    try {
        await client.query("BEGIN");

        await client.query(
            `INSERT INTO crash_demo_records (run_id, scenario)
       VALUES ($1, $2)`,
            [runId, "UNCOMMITTED"]
        );

        console.log("Record inserted inside transaction.");
        console.log("Transaction is still OPEN.");

        // Simulate sudden database failure.
        await crashPostgres();

    } finally {
        // Connection was interrupted by the crash.
        await client.end().catch(() => { });
    }

    await restartPostgres();

    const exists = await checkRecord(runId);

    console.log("\nChecking uncommitted record:");

    if (!exists) {
        console.log("SUCCESS: Uncommitted record does not exist.");
    } else {
        console.log("UNEXPECTED: Record exists!");
    }
}

// --------------------------------------------------
// EXPERIMENT 2: CRASH AFTER COMMIT
// --------------------------------------------------

async function crashAfterCommit() {
    console.log("\n================================");
    console.log("EXPERIMENT 2: CRASH AFTER COMMIT");
    console.log("================================");

    const runId = randomUUID();
    const client = await connect();

    client.on("error", () => { });

    try {
        await client.query("SET synchronous_commit = on");

        await client.query("BEGIN");

        await client.query(
            `INSERT INTO crash_demo_records (run_id, scenario)
       VALUES ($1, $2)`,
            [runId, "COMMITTED"]
        );

        console.log("Record inserted inside transaction.");

        await client.query("COMMIT");

        console.log("COMMIT acknowledged by PostgreSQL!");

        // Immediately crash PostgreSQL after commit.
        await crashPostgres();

    } finally {
        await client.end().catch(() => { });
    }

    await restartPostgres();

    const exists = await checkRecord(runId);

    console.log("\nChecking committed record:");

    if (exists) {
        console.log("SUCCESS: Committed record survived the crash!");
    } else {
        console.log("FAILURE: Committed record is missing!");
    }
}

// --------------------------------------------------
// MAIN
// --------------------------------------------------

async function main() {
    if (!DATABASE_URL) {
        throw new Error("DATABASE_URL is required.");
    }

    try {
        await setup();

        await crashBeforeCommit();

        // await crashAfterCommit();

        console.log("\n================================");
        console.log("EXPERIMENTS COMPLETED");
        console.log("================================");
    } catch (error) {
        console.error("\nExperiment failed:", error.message);
        process.exitCode = 1;
    }
}

main();
