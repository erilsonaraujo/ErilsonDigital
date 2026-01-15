import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL is required (tip: run with `node --env-file=.env.local ...`)');
  process.exit(1);
}

function ask(question) {
  const rl = readline.createInterface({ input, output });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(String(answer ?? ''));
    });
  });
}

function askHidden(question) {
  return new Promise((resolve, reject) => {
    if (!input.isTTY || !output.isTTY) {
      reject(new Error('TTY is required for hidden input'));
      return;
    }

    output.write(question);
    const onData = (chunk) => {
      const char = String(chunk);
      if (char === '\r' || char === '\n') {
        output.write('\n');
        cleanup();
        resolve(value);
        return;
      }

      if (char === '\u0003') {
        cleanup();
        reject(new Error('Interrupted'));
        return;
      }

      if (char === '\u007f') {
        value = value.slice(0, -1);
        return;
      }

      value += char;
    };

    const cleanup = () => {
      input.off('data', onData);
      try {
        input.setRawMode(false);
      } catch {
        // ignore
      }
      input.pause();
    };

    let value = '';
    input.setEncoding('utf8');
    input.resume();
    input.setRawMode(true);
    input.on('data', onData);
  });
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const email = (await ask('Admin email: ')).toLowerCase().trim();
  if (!email || !email.includes('@')) {
    console.error('Invalid email');
    process.exit(1);
  }

  const canHide = Boolean(input.isTTY && output.isTTY);
  const askPassword = canHide ? askHidden : ask;
  const label = canHide ? ' (hidden)' : ' (will be visible)';

  const password = await askPassword(`Admin password${label}: `);
  const confirm = await askPassword(`Confirm password${label}: `);
  if (!password || password.length < 8) {
    console.error('Password must be at least 8 characters');
    process.exit(1);
  }
  if (password !== confirm) {
    console.error('Passwords do not match');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const upsert = await client.query(
      `INSERT INTO admins (email, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (email)
       DO UPDATE SET password_hash = EXCLUDED.password_hash
       RETURNING id, email`,
      [email, passwordHash]
    );

    const adminId = upsert.rows[0]?.id;
    if (adminId) {
      await client.query('DELETE FROM admin_sessions WHERE admin_id = $1', [adminId]);
    }
    await client.query('DELETE FROM login_attempts WHERE identifier = $1', [email]);

    await client.query('COMMIT');
    console.log(`Admin updated: ${upsert.rows[0]?.email}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Failed to set admin:', error);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((error) => {
  console.error(String(error?.message || error));
  process.exit(1);
});
