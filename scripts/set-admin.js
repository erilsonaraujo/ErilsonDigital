import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const POSTGRES_URL = process.env.POSTGRES_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!POSTGRES_URL) {
  console.error('POSTGRES_URL is required');
  process.exit(1);
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD are required (as env vars)');
  process.exit(1);
}

const pool = new Pool({
  connectionString: POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const email = String(ADMIN_EMAIL).toLowerCase().trim();
  const passwordHash = await bcrypt.hash(String(ADMIN_PASSWORD), 12);

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

run();

