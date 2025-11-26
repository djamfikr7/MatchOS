const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://matchos:devpass@localhost:5433/matchos_db',
});

const configDir = path.join(__dirname, '../config/categories');

async function seedCategories() {
    await client.connect();
    console.log('Connected to DB');

    const files = fs.readdirSync(configDir);

    for (const file of files) {
        if (file.endsWith('.json')) {
            const config = JSON.parse(fs.readFileSync(path.join(configDir, file), 'utf8'));

            const query = `
        INSERT INTO categories (
          name, 
          slug, 
          type, 
          ai_prompt, 
          privacy_default, 
          reputation_weights, 
          fraud_signals
        )
        VALUES ($1, $2, 'core', $3, 2, $4, $5)
        ON CONFLICT (slug) DO UPDATE SET
          ai_prompt = EXCLUDED.ai_prompt,
          reputation_weights = EXCLUDED.reputation_weights,
          fraud_signals = EXCLUDED.fraud_signals;
      `;

            // Map privacy string to int
            const privacyMap = { 'public': 1, 'alias': 2, 'semi_private': 2, 'mediated': 3, 'ghost_mode': 4 };
            const privacyLevel = privacyMap[config.privacy_defaults?.requester] || 2;

            try {
                await client.query(query, [
                    config.name,
                    config.category_id, // using category_id as slug
                    config.ai_mediation_prompt,
                    JSON.stringify(config.reputation_weights),
                    JSON.stringify(config.fraud_signals)
                ]);
                console.log(`Seeded Category: ${config.name}`);
            } catch (err) {
                console.error(`Error seeding ${config.name}:`, err);
            }
        }
    }

    await client.end();
    console.log('Category Seeding Complete');
}

seedCategories();
