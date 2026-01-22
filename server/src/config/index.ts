import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  tmdb: {
    apiKey: string;
    apiBaseUrl: string;
    imageBasePath: string;
  };
}

function validateConfig(): Config {
  const requiredEnvVars = [
    'TMDB_API_KEY',
    'TMDB_API_BASE_URL',
    'TMDB_IMAGE_BASE_PATH',
  ];

  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    tmdb: {
      apiKey: process.env.TMDB_API_KEY!,
      apiBaseUrl: process.env.TMDB_API_BASE_URL!,
      imageBasePath: process.env.TMDB_IMAGE_BASE_PATH!,
    },
  };
}

export const config = validateConfig();

// Legacy exports for backward compatibility
export const API_KEY = config.tmdb.apiKey;
export const IMAGE_BASE_PATH = config.tmdb.imageBasePath;
export const API_BASE_URL = config.tmdb.apiBaseUrl;
