
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bank_accounts (
      id INTEGER PRIMARY KEY,
      balance NUMERIC(12, 2) NOT NULL
    );
  `);

  await pool.query(`
    INSERT INTO bank_accounts (id, balance)
    VALUES (1, 1000)
    ON CONFLICT (id)
    DO UPDATE SET balance = 1000;
  `);
}

async function getBalance() {
  const result = await pool.query(
    "SELECT balance FROM bank_accounts WHERE id = 1"
  );

  return Number(result.rows[0].balance);
}

// --------------------------------------------------
// DEMO 1: WITHOUT EXPLICIT LOCKING
// --------------------------------------------------

async function withoutLocking() {
  console.log("\n=== WITHOUT EXPLICIT LOCKING ===");

  // Reset account balance
  await pool.query(
    "UPDATE bank_accounts SET balance = 1000 WHERE id = 1"
  );

  let readers = 0;
  let releaseReaders;

  const bothRead = new Promise((resolve) => {
    releaseReaders = resolve;
  });

  async function withdraw(user) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Both transactions read the balance.
      const result = await client.query(
        "SELECT balance FROM bank_accounts WHERE id = 1"
      );

      const balance = Number(result.rows[0].balance);

      console.log(`${user} read balance: ${balance}`);

      // Synchronize both transactions so they
      // read the balance before either updates it.
      readers++;

      if (readers === 2) {
        releaseReaders();
      }

      await bothRead;

      if (balance < 800) {
        await client.query("ROLLBACK");
        console.log(`${user}: Insufficient funds`);
        return;
      }

      // Deduct from the current database balance.
      await client.query(
        "UPDATE bank_accounts SET balance = balance - 800 WHERE id = 1"
      );

      await client.query("COMMIT");

      console.log(`${user}: Withdrawal successful`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  await Promise.all([
    withdraw("User A"),
    withdraw("User B"),
  ]);

  console.log("Final balance:", await getBalance());
}

// --------------------------------------------------
// DEMO 2: WITH SELECT FOR UPDATE
// --------------------------------------------------

async function withLocking() {
  console.log("\n=== WITH SELECT FOR UPDATE ===");

  // Reset account balance
  await pool.query(
    "UPDATE bank_accounts SET balance = 1000 WHERE id = 1"
  );

  async function withdraw(user, holdLock = false) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Lock the account row.
      const result = await client.query(`
        SELECT balance
        FROM bank_accounts
        WHERE id = 1
        FOR UPDATE
      `);

      const balance = Number(result.rows[0].balance);

      console.log(`${user} read balance: ${balance}`);

      // Keep the first transaction open temporarily
      // so the second transaction has to wait.
      if (holdLock) {
        await sleep(1000);
      }

      if (balance < 800) {
        await client.query("ROLLBACK");
        console.log(`${user}: Insufficient funds`);
        return;
      }

      await client.query(
        "UPDATE bank_accounts SET balance = balance - 800 WHERE id = 1"
      );

      await client.query("COMMIT");

      console.log(`${user}: Withdrawal successful`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  // Start User A first so it acquires the row lock.
  const userA = withdraw("User A", true);

  // Start User B while User A holds the lock.
  await sleep(100);

  const userB = withdraw("User B");

  await Promise.all([userA, userB]);

  console.log("Final balance:", await getBalance());
}

// --------------------------------------------------
// DEMO 3: GUARDED UPDATE (ATOMIC CHECK + WRITE)
// --------------------------------------------------

async function withGuardedUpdate() {
  console.log("\n=== WITH GUARDED UPDATE ===");

  // Reset account balance
  await pool.query(
    "UPDATE bank_accounts SET balance = 1000 WHERE id = 1"
  );

  async function withdraw(user) {
    // Single atomic statement: the balance check and the
    // deduction happen together. Postgres takes the row lock
    // for the statement's duration, and a concurrent UPDATE
    // re-evaluates the WHERE clause after the lock is released.
    const result = await pool.query(`
      UPDATE bank_accounts
      SET balance = balance - 800
      WHERE id = 1 AND balance >= 800
      RETURNING balance
    `);

    if (result.rowCount === 0) {
      console.log(`${user}: Insufficient funds`);
      return;
    }

    console.log(
      `${user}: Withdrawal successful, new balance: ${result.rows[0].balance}`
    );
  }

  // Start User A first, then User B while A's UPDATE is in flight.
  const userA = withdraw("User A");

  await sleep(100);

  const userB = withdraw("User B");

  await Promise.all([userA, userB]);

  console.log("Final balance:", await getBalance());
}

// --------------------------------------------------
// DEMO 4: HOLD A LOCK SO YOU CAN OBSERVE IT
// --------------------------------------------------

async function observeLock() {
  console.log("\n=== OBSERVE LOCK ===");

  // Reset account balance
  await pool.query(
    "UPDATE bank_accounts SET balance = 1000 WHERE id = 1"
  );

  const lockHolder = await pool.connect();

  try {
    await lockHolder.query("BEGIN");

    // Take the row lock, then keep the transaction open.
    await lockHolder.query(`
      SELECT balance
      FROM bank_accounts
      WHERE id = 1
      FOR UPDATE
    `);

    console.log(
      "User A holds the row lock for 15 seconds.\n" +
        "While it sleeps, run this in another terminal (psql or any SQL client):\n\n" +
        "  SELECT a.pid, a.state, a.wait_event_type, a.wait_event,\n" +
        "         l.locktype, l.mode, l.granted,\n" +
        "         now() - a.query_start AS query_age\n" +
        "  FROM pg_locks l\n" +
        "  JOIN pg_stat_activity a ON a.pid = l.pid\n" +
        "  WHERE l.relation = 'bank_accounts'::regclass;\n"
    );

    // While User A sleeps, User B tries to lock the same row
    // and blocks until A commits.
    const waiter = (async () => {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        console.log("User B is now blocked waiting for the lock...");

        await client.query(`
          SELECT balance
          FROM bank_accounts
          WHERE id = 1
          FOR UPDATE
        `);

        console.log("User B acquired the lock after User A released it.");

        await client.query("ROLLBACK");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    })();

    await sleep(15000);

    await lockHolder.query("COMMIT");
    console.log("User A committed — lock released.");

    await waiter;
  } catch (error) {
    await lockHolder.query("ROLLBACK");
    throw error;
  } finally {
    lockHolder.release();
  }
}

// --------------------------------------------------
// RUN EXPERIMENT
// --------------------------------------------------

async function main() {
  try {
    await setup();

    await withoutLocking();

    await withLocking();

    await withGuardedUpdate();

    await observeLock();
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
}

main();
