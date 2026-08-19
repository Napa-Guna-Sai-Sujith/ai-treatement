import { Client } from 'pg';

const connectionString = process.env.VITE_NEON_DATABASE_URL || 'postgresql://neondb_owner:npg_yzTYoOqdX97g@ep-weathered-mud-axorkca0-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function fetchCompleteOutput() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log('====================================================');
  console.log('       COMPLETE DATABASE ANALYSIS & OUTPUT          ');
  console.log('====================================================\n');

  // 1. Tables Overview
  const tablesRes = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('1. PUBLIC SCHEMAS & TABLES:');
  console.table(tablesRes.rows);

  // 2. Patients Table Content
  const patientsRes = await client.query('SELECT * FROM patients ORDER BY id;');
  console.log(`\n2. PATIENTS TABLE (${patientsRes.rowCount} Records):`);
  console.log(JSON.stringify(patientsRes.rows, null, 2));

  // 3. Treatment Options Table Content
  const treatmentsRes = await client.query('SELECT * FROM treatment_options ORDER BY id;');
  console.log(`\n3. TREATMENT OPTIONS TABLE (${treatmentsRes.rowCount} Records):`);
  console.log(JSON.stringify(treatmentsRes.rows, null, 2));

  // 4. Clusters Table Content
  const clustersRes = await client.query('SELECT * FROM clusters ORDER BY id;');
  console.log(`\n4. CLUSTERS TABLE (${clustersRes.rowCount} Records):`);
  console.log(JSON.stringify(clustersRes.rows, null, 2));

  // 5. Users Table Content (Logins)
  const usersRes = await client.query('SELECT * FROM users ORDER BY last_login DESC;');
  console.log(`\n5. USERS TABLE - LOGINS (${usersRes.rowCount} Records):`);
  console.log(JSON.stringify(usersRes.rows, null, 2));

  await client.end();
}

fetchCompleteOutput().catch(err => {
  console.error('Error fetching data:', err);
});
