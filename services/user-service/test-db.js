const { Client } = require('pg');

const client = new Client({
    user: 'matchos',
    host: 'localhost',
    database: 'matchos_db',
    password: 'devpass',
    port: 5433,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Connected successfully to PostgreSQL');
        const res = await client.query('SELECT NOW()');
        console.log('Current time from DB:', res.rows[0]);
        await client.end();
    } catch (err) {
        console.error('Connection error', err.stack);
    }
}

testConnection();
