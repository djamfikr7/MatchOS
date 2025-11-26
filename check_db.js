const { Client } = require('pg');

const client = new Client({
    user: 'matchos',
    host: 'localhost',
    database: 'matchos_db',
    password: 'devpass',
    port: 5433,
});

async function checkDB() {
    try {
        await client.connect();

        console.log("--- USERS ---");
        const resUsers = await client.query('SELECT id, email, role, skills FROM users');
        console.log(JSON.stringify(resUsers.rows, null, 2));

        console.log("\n--- REQUESTS ---");
        const resRequests = await client.query('SELECT id, title, status, "userId" FROM request');
        console.log(JSON.stringify(resRequests.rows, null, 2));

        // Check for duplicates
        const emails = resUsers.rows.map(r => r.email);
        const uniqueEmails = new Set(emails);
        if (emails.length !== uniqueEmails.size) {
            console.log("\n⚠️ DUPLICATE EMAILS FOUND!");
        } else {
            console.log("\n✅ No duplicate emails found.");
        }

    } catch (err) {
        console.error('Error executing query', err.stack);
    } finally {
        await client.end();
    }
}

checkDB();
