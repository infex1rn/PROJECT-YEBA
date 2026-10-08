import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || Buffer.byteLength(jwtSecret, 'utf8') < 32 ||
    new Set(jwtSecret).size < 16 || /your[-_ ]|change[-_ ]|example|placeholder/i.test(jwtSecret)) {
  throw new Error('JWT_SECRET must be configured with at least 32 random bytes; generate it with openssl rand -base64 48');
}

const lifetime = /^(\d+)(s|m|h|d)$/.exec(process.env.JWT_EXPIRES_IN || '24h');
const units: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
const jwtExpiresIn = lifetime ? Number(lifetime[1]) * units[lifetime[2]] : NaN;
if (!Number.isSafeInteger(jwtExpiresIn) || jwtExpiresIn < 1 || jwtExpiresIn > 86400) {
  throw new Error('JWT_EXPIRES_IN must be a duration from 1s to 24h');
}

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret,
  jwtExpiresIn,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '524288000'),
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
};
