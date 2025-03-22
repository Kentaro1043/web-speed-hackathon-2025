import { createRequire } from 'node:module';

import { defineConfig } from 'drizzle-kit';

const require = createRequire(import.meta.url);

export default defineConfig({
  dbCredentials: {
    ssl: false,
    host: 'db',
    port: 5432,
    user: 'user',
    password: 'password',
    database: 'database',
  },
  dialect: 'postgresql',
  out: './migrations',
  schema: require.resolve('@wsh-2025/schema/src/database/schema.ts'),
});
