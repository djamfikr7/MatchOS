INSERT INTO categories (name, slug, type, form_schema) 
VALUES (
    'Micro-Importation', 
    'micro-import', 
    'emergent', 
    '{"fields": [{"name": "origin", "type": "text", "label": "Origin City", "required": true}, {"name": "destination", "type": "text", "label": "Destination City", "required": true}, {"name": "weight_kg", "type": "number", "label": "Weight (kg)", "required": true}, {"name": "item_link", "type": "url", "label": "Product Link", "required": false}]}'
) 
ON CONFLICT (slug) DO UPDATE SET form_schema = EXCLUDED.form_schema;
