import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import test from 'node:test';
import jwt from 'jsonwebtoken';

const secret = randomBytes(48).toString('base64');
process.env.JWT_SECRET = secret;
const { generateToken, verifyToken } = require('../src/utils/auth');

test('startup refuses missing, weak and known example JWT keys in every environment', () => {
  for (const nodeEnv of ['development', 'production']) {
    for (const value of ['', 'your-secret-key', 'a'.repeat(64), 'your-super-secret-jwt-key-change-this-in-production']) {
      const result = spawnSync(process.execPath, ['--import', 'tsx', '-e', "require('./src/config')"], {
        cwd: process.cwd(), env: { ...process.env, NODE_ENV: nodeEnv, JWT_SECRET: value }, encoding: 'utf8',
      });
      assert.notEqual(result.status, 0, `${nodeEnv} accepted an unsafe key`);
      assert.match(result.stderr, /JWT_SECRET/);
      assert.ok(!result.stderr.includes(secret));
    }
  }
});

test('issued tokens round trip and forged default-key tokens are rejected', () => {
  assert.deepEqual(verifyToken(generateToken({ userId: 1, role: 'ADMIN', tokenVersion: 0 })), { userId: 1, role: 'ADMIN', tokenVersion: 0 });
  assert.throws(() => verifyToken(jwt.sign({ userId: 1, role: 'ADMIN' }, 'your-secret-key')));
});

test('rejects expired, unsigned, wrong-algorithm, unbounded and malformed claims', () => {
  for (const token of [
    jwt.sign({ userId: 1, role: 'ADMIN', tokenVersion: 0 }, secret, { expiresIn: -1 }),
    jwt.sign({ userId: 1, role: 'ADMIN', tokenVersion: 0 }, '', { algorithm: 'none' }),
    jwt.sign({ userId: 1, role: 'ADMIN', tokenVersion: 0 }, secret, { algorithm: 'HS384', expiresIn: 60 }),
    jwt.sign({ userId: 1, role: 'ADMIN', tokenVersion: 0 }, secret),
    jwt.sign({ userId: -1, role: 'ADMIN', tokenVersion: 0 }, secret, { expiresIn: 60 }),
    jwt.sign({ userId: 1, role: 'OWNER', tokenVersion: 0 }, secret, { expiresIn: 60 }),
  ]) assert.throws(() => verifyToken(token));
});
