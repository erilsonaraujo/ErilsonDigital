import { Pool } from 'pg';
import { promises as fs } from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations', 'ecommerce');

async function ensureMigrationsTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function getAppliedMigrations() {
  const result = await pool.query('SELECT name FROM schema_migrations');
  return new Set(result.rows.map((row) => row.name));
}

async function runMigration(name: string, sql: string) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
    await client.query('COMMIT');
    console.log(`✓ Applied migration ${name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`✗ Failed migration ${name}`);
    throw error;
  } finally {
    client.release();
  }
}

async function migrate() {
  console.log('Running ecommerce migrations...');
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = (await fs.readdir(migrationsDir))
    .filter((file) => file.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      continue;
    }
    const sql = await fs.readFile(path.join(migrationsDir, file), 'utf-8');
    await runMigration(file, sql);
  }

  await pool.end();
  console.log('Ecommerce migrations complete.');
}

migrate().catch(async (error) => {
  console.error('Ecommerce migration error:', error);
  await pool.end();
  process.exit(1);
});
