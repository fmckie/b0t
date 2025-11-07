import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// PostgreSQL configuration
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required. Make sure Docker PostgreSQL is running.');
}

console.log('🗄️  Using PostgreSQL database:', databaseUrl.substring(0, 30) + '...');

const pool = new Pool({
  connectionString: databaseUrl,
});

export const db = drizzle(pool);
