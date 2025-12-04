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
          form_schema,
          ui_config
        )
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          form_schema = EXCLUDED.form_schema,
          ui_config = EXCLUDED.ui_config;
      `;

            // Build form schema from config
            const formSchema = config.form_schema || config.field_extensions || null;

            // Build ui_config from config
            const uiConfig = {
                icon: config.icon || 'Circle',
                color: config.color || 'blue',
                ai_prompt: config.ai_mediation_prompt,
                privacy_defaults: config.privacy_defaults,
                reputation_weights: config.reputation_weights,
                fraud_signals: config.fraud_signals,
            };

            try {
                await client.query(query, [
                    config.name,
                    config.category_id, // using category_id as slug
                    'core',
                    formSchema ? JSON.stringify(formSchema) : null,
                    JSON.stringify(uiConfig)
                ]);
                console.log(`✅ Seeded Category: ${config.name}`);
            } catch (err) {
                console.error(`❌ Error seeding ${config.name}:`, err.message);
            }
        }
    }

    await client.end();
    console.log('\n🎉 Category Seeding Complete');
}

seedCategories();
