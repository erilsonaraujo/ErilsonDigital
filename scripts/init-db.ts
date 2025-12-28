// Script to initialize database and create first admin user
// Run this once after deploying to Vercel

import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function initializeDatabase() {
    try {
        console.log('Initializing database...');

        // Create tables
        await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        console.log('✓ Table admins created');

        await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        console.log('✓ Table leads created');

        await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        service VARCHAR(255),
        preferred_date DATE,
        preferred_time VARCHAR(20),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
        console.log('✓ Table appointments created');

        // Create first admin user
        const adminEmail = process.env.ADMIN_EMAIL || 'joseerilsonaraujo@gmail.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // CHANGE THIS!

        const passwordHash = await bcrypt.hash(adminPassword, 10);

        await sql`
      INSERT INTO admins (email, password_hash)
      VALUES (${adminEmail}, ${passwordHash})
      ON CONFLICT (email) DO NOTHING
    `;
        console.log(`✓ Admin user created: ${adminEmail}`);
        console.log('⚠️  IMPORTANT: Change the default password!');

        console.log('\n✅ Database initialized successfully!');
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

initializeDatabase();
