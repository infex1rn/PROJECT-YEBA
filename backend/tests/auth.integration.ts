import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import test from 'node:test';

const url = new URL(process.env.DATABASE_URL || '');
assert.equal(url.hostname, '127.0.0.1');
assert.equal(url.pathname, '/yeba_audit', 'Integration tests require the disposable audit database');
process.env.JWT_SECRET = randomBytes(48).toString('base64');
process.env.NODE_ENV = 'test';
const app = require('../src/index').default;
const prisma = require('../src/config/database').default;
const { generateToken, hashPassword } = require('../src/utils/auth');

test('real HTTP sessions honor current role, suspension, deletion and logout', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const user = await prisma.user.create({ data: {
    name: 'Authorization regression', email: `${randomBytes(12).toString('hex')}@example.test`,
    passwordHash: await hashPassword('integration-password'), role: 'ADMIN',
  } });
  const token = generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion });
  const request = (path: string, method = 'GET', bearer = token) => fetch(base + path, {
    method, headers: { Authorization: `Bearer ${bearer}` },
  });
  try {
    assert.equal((await fetch(base + '/auth/me')).status, 401);
    const session = await request('/auth/me');
    assert.equal(session.status, 200);
    assert.equal(session.headers.get('cache-control'), 'no-store');
    assert.equal((await session.json()).user.role, 'ADMIN');
    const details = await request(`/admin/users/${user.id}`);
    const text = await details.text();
    assert.equal(details.status, 200);
    assert.ok(!text.includes('passwordHash'));
    assert.ok(!text.includes(user.passwordHash));
    assert.equal((await request('/admin/transactions/1/refund', 'PUT')).status, 503);
    const designer = await prisma.user.create({ data: {
      name: 'Design regression', email: `${randomBytes(12).toString('hex')}@example.test`,
      passwordHash: user.passwordHash, role: 'DESIGNER', designer: { create: {} },
    }, include: { designer: true } });
    try {
      const withdrawal = await prisma.withdrawal.create({ data: { designerId: designer.designer.id, amount: 25 } });
      const processWithdrawal = (status: string) => fetch(base + `/admin/withdrawals/${withdrawal.id}/process`, {
        method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      assert.equal((await processWithdrawal('APPROVED')).status, 503);
      assert.equal((await prisma.withdrawal.findUnique({ where: { id: withdrawal.id } })).status, 'PENDING');
      assert.equal((await processWithdrawal('REJECTED')).status, 200);
      assert.ok((await prisma.withdrawal.findUnique({ where: { id: withdrawal.id } })).processedAt);
      assert.equal((await processWithdrawal('REJECTED')).status, 409);
      const design = await prisma.design.create({ data: {
        designerId: designer.designer.id, title: 'Authorization regression design', category: 'Logos', price: 25,
        fileUrl: 'https://storage.example.test/private', watermarkedPreviewUrl: 'https://storage.example.test/preview',
      } });
      assert.equal((await fetch(base + `/designs/${design.id}`)).status, 404);
      const ownerToken = generateToken({ userId: designer.id, role: 'DESIGNER', tokenVersion: 0 });
      assert.equal((await fetch(base + `/designs/${design.id}/preview`)).status, 401);
      const ownerPreview = await request(`/designs/${design.id}/preview`, 'GET', ownerToken);
      assert.equal(ownerPreview.status, 200);
      assert.ok(!(await ownerPreview.text()).includes('fileUrl'));
      assert.equal((await request(`/designs/${design.id}/preview`)).status, 200);
      const otherBuyer = await prisma.user.create({ data: { name: 'Preview access regression',
        email: `${randomBytes(12).toString('hex')}@example.test`, passwordHash: user.passwordHash, role: 'BUYER' } });
      try {
        assert.equal((await request(`/designs/${design.id}/preview`, 'GET',
          generateToken({ userId: otherBuyer.id, role: 'BUYER', tokenVersion: 0 }))).status, 404);
      } finally { await prisma.user.delete({ where: { id: otherBuyer.id } }); }
      await prisma.design.update({ where: { id: design.id }, data: { status: 'APPROVED' } });
      const publicResponse = await fetch(base + `/designs/${design.id}`);
      const publicBody = await publicResponse.text();
      assert.equal(publicResponse.status, 200);
      assert.ok(!publicBody.includes('fileUrl'));
      process.env.NEXT_PUBLIC_API_URL = base;
      const { apiClient } = require('../../frontend/lib/api-client');
      const list = await apiClient.getDesigns({ search: 'Authorization regression design', limit: 1 });
      assert.equal(list.success, true);
      assert.equal(list.data.designs[0].id, design.id);
      assert.equal(list.data.pagination.itemsPerPage, 1);
      apiClient.setToken(generateToken({ userId: designer.id, role: 'DESIGNER', tokenVersion: 0 }));
      assert.equal((await apiClient.deleteDesign(design.id)).success, true);
      const second = await prisma.design.create({ data: {
        designerId: designer.designer.id, title: 'Admin deletion regression', category: 'Logos', price: 25,
        fileUrl: 'https://storage.example.test/private', watermarkedPreviewUrl: 'https://storage.example.test/preview',
      } });
      apiClient.setToken(token);
      assert.equal((await apiClient.deleteDesignAdmin(second.id)).success, true);
      apiClient.clearToken();
    } finally {
      await prisma.withdrawal.deleteMany({ where: { designerId: designer.designer.id } });
      await prisma.design.deleteMany({ where: { designerId: designer.designer.id } });
      await prisma.user.delete({ where: { id: designer.id } });
    }
    assert.equal((await request(`/users/${user.id}`)).status, 200);
    assert.equal((await request('/users/invalid')).status, 400);
    await prisma.user.update({ where: { id: user.id }, data: { role: 'BUYER' } });
    assert.equal((await request('/admin/stats')).status, 401);
    const buyerToken = generateToken({ userId: user.id, role: 'BUYER', tokenVersion: 0 });
    assert.equal((await request('/admin/stats', 'GET', buyerToken)).status, 403);
    assert.equal((await request('/users/999999', 'GET', buyerToken)).status, 403);
    await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN', status: 'SUSPENDED' } });
    assert.equal((await request('/auth/me')).status, 401);
    const login = await fetch(base + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password: 'integration-password' }) });
    assert.equal(login.status, 401);
    await prisma.user.update({ where: { id: user.id }, data: { status: 'ACTIVE' } });
    assert.equal((await request('/auth/logout', 'POST')).status, 200);
    assert.equal((await request('/auth/me')).status, 401);
    const newToken = generateToken({ userId: user.id, role: 'ADMIN', tokenVersion: 1 });
    assert.equal((await request('/auth/me', 'GET', newToken)).status, 200);
    await prisma.user.delete({ where: { id: user.id } });
    assert.equal((await request('/auth/me', 'GET', newToken)).status, 401);
  } finally {
    await prisma.user.deleteMany({ where: { id: user.id } });
    await new Promise<void>((resolve, reject) => server.close((err: Error | undefined) => err ? reject(err) : resolve()));
    await prisma.$disconnect();
  }
});
