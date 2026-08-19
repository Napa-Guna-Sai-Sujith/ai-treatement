import { Client } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_yzTYoOqdX97g@ep-weathered-mud-axorkca0-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function seedUsers() {
  const client = new Client({ connectionString });
  await client.connect();

  // Ensure columns exist
  await client.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
  `);

  // Create or Update Admin user
  await client.query(`
    INSERT INTO users (name, email, password_hash, role, is_approved)
    VALUES ('System Admin (Saisujith)', 'napagunasaisujith@gmail.com', '123456', 'System Administrator', TRUE)
    ON CONFLICT (email) DO UPDATE SET is_approved = TRUE, role = 'System Administrator', password_hash = '123456';
  `);

  const sampleUsers = [
    { name: 'Dr. Sarah Jenkins', email: 's.jenkins@oncology.org', password_hash: '123456', role: 'Medical Oncologist', is_approved: true },
    { name: 'Dr. Alex Vance', email: 'a.vance@precisionmed.io', password_hash: '123456', role: 'Genomic Researcher', is_approved: false },
    { name: 'Elena Rostova', email: 'e.rostova@trials.net', password_hash: '123456', role: 'Clinical Trial Investigator', is_approved: false }
  ];

  for (const u of sampleUsers) {
    await client.query(`
      INSERT INTO users (name, email, password_hash, role, is_approved, last_login, login_count)
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, 1)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash, is_approved = EXCLUDED.is_approved, last_login = CURRENT_TIMESTAMP, login_count = users.login_count + 1;
    `, [u.name, u.email, u.password_hash, u.role, u.is_approved]);
  }

  const res = await client.query('SELECT id, name, email, password_hash, role, is_approved, last_login FROM users ORDER BY id;');
  console.log('\n=== USERS IN DATABASE (WITH APPROVAL STATUS) ===');
  console.table(res.rows);

  await client.end();
}

seedUsers().catch(err => console.error(err));
