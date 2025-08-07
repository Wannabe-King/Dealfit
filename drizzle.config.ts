import { env } from '@/data/env/server';
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/app/drizzle/migrations',
  schema: './src/app/drizzle/schema.ts',
  dialect: 'postgresql',
  strict:true,
  verbose:true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
