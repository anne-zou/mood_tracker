import { printSchema } from 'graphql';
import { schema } from '../graphql/schema.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const schemaString = printSchema(schema);
const outputPath = join(__dirname, '../../frontend/schema.graphql');

writeFileSync(outputPath, schemaString);
console.log(`✅ Schema exported to ${outputPath}`);
