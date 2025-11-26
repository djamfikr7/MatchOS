const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://matchos:devpass@localhost:5433/matchos_db',
});

async function applySchema() {
    await client.connect();
    console.log('Connected to DB');

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    try {
        await client.query(schemaSql);
        console.log('Schema applied successfully');
    } catch (err) {
        console.error('Error applying schema:', err);
    }

    await client.end();
}

applySchema();
