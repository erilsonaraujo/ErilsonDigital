// Script to initialize database and create first admin user
// Run this once after deploying to Vercel

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  if (!process.env.POSTGRES_URL) {
    console.log('⚠️  POSTGRES_URL not found. Skipping database initialization.');
    return;
  }

  try {
    console.log('Initializing database...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table admins created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_sessions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
        session_token VARCHAR(255) UNIQUE NOT NULL,
        ip VARCHAR(64),
        user_agent TEXT,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table admin_sessions created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(255) NOT NULL,
        ip VARCHAR(64),
        attempts INTEGER DEFAULT 0,
        last_attempt_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS login_attempts_identifier_ip
      ON login_attempts (identifier, ip)
    `);
    console.log('✓ Table login_attempts created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        project_type VARCHAR(100),
        budget VARCHAR(50),
        timeline VARCHAR(50),
        message TEXT,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table leads created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        company VARCHAR(255),
        budget VARCHAR(50),
        service VARCHAR(255),
        preferred_date DATE,
        preferred_time VARCHAR(20),
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        calendar_event_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table appointments created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        visitor_name VARCHAR(255),
        visitor_email VARCHAR(255),
        visitor_phone VARCHAR(50),
        transcript JSONB NOT NULL,
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table conversations created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        path VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        referrer TEXT,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        ip VARCHAR(50),
        user_agent TEXT,
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        device VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        visitor_id VARCHAR(255),
        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        pageviews INTEGER DEFAULT 0,
        events INTEGER DEFAULT 0,
        landing_path VARCHAR(255),
        exit_path VARCHAR(255),
        referrer TEXT,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_term VARCHAR(100),
        utm_content VARCHAR(100),
        country VARCHAR(100),
        region VARCHAR(100),
        city VARCHAR(100),
        device VARCHAR(50),
        browser VARCHAR(50),
        os VARCHAR(50),
        user_agent TEXT
      )
    `);
    console.log('✓ Table analytics_sessions created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        name VARCHAR(100) NOT NULL,
        path VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_events created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_goals (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(20) NOT NULL,
        match_value VARCHAR(255) NOT NULL,
        value NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_goals created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_goal_conversions (
        id SERIAL PRIMARY KEY,
        goal_id INTEGER NOT NULL REFERENCES analytics_goals(id) ON DELETE CASCADE,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        path VARCHAR(255),
        event_name VARCHAR(100),
        value NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS analytics_goal_unique
      ON analytics_goal_conversions (goal_id, session_id)
    `);
    console.log('✓ Table analytics_goal_conversions created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_funnels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_funnel_steps (
        id SERIAL PRIMARY KEY,
        funnel_id INTEGER NOT NULL REFERENCES analytics_funnels(id) ON DELETE CASCADE,
        step_order INTEGER NOT NULL,
        type VARCHAR(20) NOT NULL,
        match_value VARCHAR(255) NOT NULL
      )
    `);
    console.log('✓ Table analytics_funnels created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        trigger_type VARCHAR(30) NOT NULL,
        trigger_match VARCHAR(255),
        match_type VARCHAR(20) DEFAULT 'contains',
        tag_type VARCHAR(30) NOT NULL,
        tag_config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_tags created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_reports (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        dimensions JSONB NOT NULL,
        metrics JSONB NOT NULL,
        filters JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_reports created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_heatmap_points (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        path VARCHAR(255) NOT NULL,
        event_type VARCHAR(20) NOT NULL,
        x_percent NUMERIC,
        y_percent NUMERIC,
        viewport_w INTEGER,
        viewport_h INTEGER,
        element_tag VARCHAR(50),
        element_label VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_heatmap_points created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_recordings (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        visitor_id VARCHAR(255),
        start_path VARCHAR(255),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ended_at TIMESTAMP,
        duration_seconds INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_recordings created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_recording_chunks (
        id SERIAL PRIMARY KEY,
        recording_id INTEGER NOT NULL REFERENCES analytics_recordings(id) ON DELETE CASCADE,
        sequence INTEGER NOT NULL,
        events JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_recording_chunks created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_form_events (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        path VARCHAR(255),
        form_id VARCHAR(255),
        form_name VARCHAR(255),
        field_name VARCHAR(255),
        field_type VARCHAR(100),
        action VARCHAR(50) NOT NULL,
        value_length INTEGER,
        time_since_start INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_form_events created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_media_events (
        id SERIAL PRIMARY KEY,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        path VARCHAR(255),
        media_type VARCHAR(20) NOT NULL,
        media_label VARCHAR(255),
        action VARCHAR(50) NOT NULL,
        media_time NUMERIC,
        duration NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_media_events created');

    await pool.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'analytics_media_events' AND column_name = 'current_time'
        ) THEN
          ALTER TABLE analytics_media_events RENAME COLUMN "current_time" TO media_time;
        END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_experiments (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        target_path VARCHAR(255),
        traffic_percent INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_experiments created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_experiment_variants (
        id SERIAL PRIMARY KEY,
        experiment_id INTEGER NOT NULL REFERENCES analytics_experiments(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        weight INTEGER DEFAULT 50
      )
    `);
    console.log('✓ Table analytics_experiment_variants created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_experiment_assignments (
        id SERIAL PRIMARY KEY,
        experiment_id INTEGER NOT NULL REFERENCES analytics_experiments(id) ON DELETE CASCADE,
        variant_id INTEGER NOT NULL REFERENCES analytics_experiment_variants(id) ON DELETE CASCADE,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_experiment_assignments created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_experiment_conversions (
        id SERIAL PRIMARY KEY,
        experiment_id INTEGER NOT NULL REFERENCES analytics_experiments(id) ON DELETE CASCADE,
        variant_id INTEGER NOT NULL REFERENCES analytics_experiment_variants(id) ON DELETE CASCADE,
        visitor_id VARCHAR(255),
        session_id VARCHAR(255),
        goal VARCHAR(255),
        value NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_experiment_conversions created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS seo_keywords (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        query TEXT NOT NULL,
        page TEXT,
        clicks INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        ctr NUMERIC DEFAULT 0,
        position NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table seo_keywords created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS analytics_ga_imports (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        source VARCHAR(255),
        medium VARCHAR(255),
        campaign VARCHAR(255),
        page VARCHAR(255),
        sessions INTEGER DEFAULT 0,
        users INTEGER DEFAULT 0,
        pageviews INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table analytics_ga_imports created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms_v2 (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        version INTEGER DEFAULT 1,
        schema JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table forms_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_entries_v2 (
        id SERIAL PRIMARY KEY,
        form_id INTEGER NOT NULL REFERENCES forms_v2(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'submitted',
        data JSONB NOT NULL,
        ip VARCHAR(64),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table form_entries_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_drafts_v2 (
        id SERIAL PRIMARY KEY,
        form_id INTEGER NOT NULL REFERENCES forms_v2(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table form_drafts_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_actions_v2 (
        id SERIAL PRIMARY KEY,
        form_id INTEGER NOT NULL REFERENCES forms_v2(id) ON DELETE CASCADE,
        action_type VARCHAR(50) NOT NULL,
        config JSONB,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table form_actions_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_resources_v2 (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        capacity INTEGER DEFAULT 1,
        timezone VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table booking_resources_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_blocks_v2 (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER NOT NULL REFERENCES booking_resources_v2(id) ON DELETE CASCADE,
        start_at TIMESTAMP NOT NULL,
        end_at TIMESTAMP NOT NULL,
        reason VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table booking_blocks_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings_v2 (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER NOT NULL REFERENCES booking_resources_v2(id) ON DELETE CASCADE,
        form_entry_id INTEGER REFERENCES form_entries_v2(id) ON DELETE SET NULL,
        status VARCHAR(30) DEFAULT 'pending',
        start_at TIMESTAMP NOT NULL,
        end_at TIMESTAMP NOT NULL,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(50),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS bookings_v2_resource_time
      ON bookings_v2 (resource_id, start_at, end_at)
    `);
    console.log('✓ Table bookings_v2 created');

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS btree_gist
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS bookings_v2_conflict_gist
      ON bookings_v2
      USING GIST (resource_id, tsrange(start_at, end_at, '[)'))
      WHERE status NOT IN ('canceled', 'declined')
    `);
    console.log('✓ Index bookings_v2_conflict_gist created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_seasons_v2 (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(20) DEFAULT 'active'
      )
    `);
    console.log('✓ Table booking_seasons_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_pricing_v2 (
        id SERIAL PRIMARY KEY,
        resource_id INTEGER NOT NULL REFERENCES booking_resources_v2(id) ON DELETE CASCADE,
        season_id INTEGER REFERENCES booking_seasons_v2(id) ON DELETE SET NULL,
        price_per_day NUMERIC DEFAULT 0,
        price_per_hour NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table booking_pricing_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_coupons_v2 (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) NOT NULL,
        discount_value NUMERIC NOT NULL,
        min_total NUMERIC DEFAULT 0,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table booking_coupons_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS booking_payments_v2 (
        id SERIAL PRIMARY KEY,
        booking_id INTEGER NOT NULL REFERENCES bookings_v2(id) ON DELETE CASCADE,
        provider VARCHAR(50) NOT NULL,
        amount NUMERIC NOT NULL,
        status VARCHAR(30) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table booking_payments_v2 created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table site_settings created');

    const adminEmail = (process.env.ADMIN_EMAIL || 'joseerilsonaraujo@gmail.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.log('ℹ️  Admin user not created. Set ADMIN_EMAIL and ADMIN_PASSWORD to create/update an admin.');
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await pool.query(
        `INSERT INTO admins (email, password_hash)
         VALUES ($1, $2)
         ON CONFLICT (email)
         DO UPDATE SET password_hash = EXCLUDED.password_hash`,
        [adminEmail, passwordHash]
      );
      console.log(`✓ Admin user created/updated: ${adminEmail}`);
    }

    console.log('\n✅ Database initialized successfully!');

    await pool.end();
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    await pool.end();
    throw error;
  }
}

initializeDatabase();
