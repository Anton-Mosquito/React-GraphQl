import { cleanEnv, str, num } from 'envalid';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from monorepo root (one level up from server/)
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export type Env = {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  CLIENT_URL: string;
  API_URL: string;
  TMDB_API_KEY: string;
  TMDB_API_BASE_URL: string;
  TMDB_IMAGE_BASE_PATH: string;
  SMTP_SERVICE: string;
  GOOGLE_CLIENT: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  JWT_ACCESS_SECRET: string;
  JWT_REFRESH_SECRET: string;
};

const env = cleanEnv(process.env, {
  PORT: num({ default: 5001 }),
  NODE_ENV: str({ default: 'development' }),
  DATABASE_URL: str(),
  CLIENT_URL: str(),
  API_URL: str(),
  TMDB_API_KEY: str(),
  TMDB_API_BASE_URL: str(),
  TMDB_IMAGE_BASE_PATH: str(),
  SMTP_SERVICE: str(),
  GOOGLE_CLIENT: str(),
  GOOGLE_CLIENT_ID: str(),
  GOOGLE_CLIENT_SECRET: str(),
  GOOGLE_REFRESH_TOKEN: str(),
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
}) as unknown as Env;

export { env };
export default env;
