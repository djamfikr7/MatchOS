const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://matchos:devpass@localhost:5433/matchos_db',
});

const locations = [
    {
        name: 'World',
        type: 'country',
        parent: null,
        tier: 5,
        children: [
            {
                name: 'Algeria',
                type: 'country',
                tier: 3,
                children: [
                    {
                        name: 'Algiers',
                        type: 'city', // Changed from region to city
                        tier: 1,
                        children: [
                            { name: 'Sidi M\'Hamed', type: 'neighborhood', tier: 1 },
                            { name: 'Bab El Oued', type: 'neighborhood', tier: 2 },
                            { name: 'Hydra', type: 'neighborhood', tier: 1 }
                        ]
                    },
                    {
                        name: 'Oran',
                        type: 'city', // Changed from region to city
                        tier: 2,
                        children: [
                            { name: 'Oran City', type: 'neighborhood', tier: 2 },
                            { name: 'Es Senia', type: 'neighborhood', tier: 2 }
                        ]
                    }
                ]
            }
        ]
    }
];

async function seedLocations(node, parentId = null) {
    const query = `
    INSERT INTO location_zones (name, type, parent_id, economic_tier)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
  `;

    try {
        const res = await client.query(query, [node.name, node.type, parentId, node.tier]);
        const id = res.rows[0].id;
        console.log(`Seeded: ${node.name} (${node.type})`);

        if (node.children) {
            for (const child of node.children) {
                await seedLocations(child, id);
            }
        }
    } catch (err) {
        console.error(`Error seeding ${node.name}:`, err);
    }
}

async function main() {
    await client.connect();
    console.log('Connected to DB');

    // Clear existing locations to avoid duplicates (optional, be careful in prod)
    // await client.query('TRUNCATE location_zones CASCADE');

    for (const loc of locations) {
        await seedLocations(loc);
    }

    await client.end();
    console.log('Seeding complete');
}

main();
