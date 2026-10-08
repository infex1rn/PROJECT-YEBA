import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { once } from 'node:events';
import test from 'node:test';

const target = new URL(process.env.DATABASE_URL || '');
assert.equal(target.hostname, '127.0.0.1');
assert.equal(target.pathname, '/yeba_audit', 'Use the disposable audit database');
process.env.JWT_SECRET = randomBytes(48).toString('base64');
process.env.NODE_ENV = 'test';
const app = require('../src/index').default;
const prisma = require('../src/config/database').default;
const { generateToken, hashPassword } = require('../src/utils/auth');

test('administration persists moderation and settings while retaining financial records', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/api`;
  const initialSettings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
  const passwordHash = await hashPassword('administration-regression-password');
  const nonce = randomBytes(12).toString('hex');
  const admin = await prisma.user.create({ data: { name: 'Admin regression', email: `admin-${nonce}@example.test`, passwordHash, role: 'ADMIN' } });
  const seller = await prisma.user.create({ data: { name: 'Seller regression', email: `seller-${nonce}@example.test`, passwordHash, role: 'DESIGNER', designer: { create: {} } }, include: { designer: true } });
  const buyer = await prisma.user.create({ data: { name: 'Buyer regression', email: `buyer-${nonce}@example.test`, passwordHash, role: 'BUYER', buyer: { create: {} } }, include: { buyer: true } });
  const tokens = new Map([admin, seller, buyer].map(user => [user.id, generateToken({ userId: user.id, role: user.role, tokenVersion: user.tokenVersion })]));
  const request = (path: string, user = admin, method = 'GET', body?: unknown) => fetch(base + path, {
    method, headers: { Authorization: `Bearer ${tokens.get(user.id)}`, 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const settingsBody = async (changes: Record<string, unknown>) => {
    const current = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
    return { version: current.version, maintenanceMode: current.maintenanceMode, userRegistration: current.userRegistration, designApproval: current.designApproval, categories: current.categories, ...changes };
  };
  const design = await prisma.design.create({ data: { designerId: seller.designer.id, title: 'Retained purchase regression', category: 'Logos', price: 25, status: 'APPROVED', fileUrl: 'https://storage.example.test/private', watermarkedPreviewUrl: 'https://storage.example.test/preview' } });
  const purchase = await prisma.transaction.create({ data: { buyerId: buyer.buyer.id, designId: design.id, amount: 25, paymentStatus: 'COMPLETED', paymentMethod: 'PAYSTACK', designTitle: design.title, previewUrl: design.watermarkedPreviewUrl } });
  await prisma.withdrawal.create({ data: { designerId: seller.designer.id, amount: 10 } });
  try {
    assert.equal((await request('/admin/settings', buyer)).status, 403);
    assert.equal((await request(`/admin/users/${buyer.id}/verification`, admin, 'PUT', { verified: true })).status, 200);
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: buyer.id } })).verified, true);
    assert.equal((await request(`/admin/users/${buyer.id}/verification`, admin, 'PUT', { verified: true, role: 'ADMIN' })).status, 400);
    const users = await (await request(`/admin/users?search=buyer-${nonce}`)).json();
    assert.equal(users.data.users[0].buyer.totalSpent, 25);
    const transactionDetails = await (await request(`/admin/transactions/${purchase.id}`)).text();
    assert.ok(!transactionDetails.includes('passwordHash'));
    assert.ok(!transactionDetails.includes(passwordHash));

    const reportResponse = await request('/reports', buyer, 'POST', { type: 'DESIGN', subjectId: design.id, reason: 'Regression review', description: 'A real persisted report for integration verification.' });
    assert.equal(reportResponse.status, 201);
    const report = (await reportResponse.json()).data;
    assert.equal((await request('/admin/reports', buyer)).status, 403);
    const reports = await (await request('/admin/reports?status=PENDING')).json();
    assert.ok(reports.data.reports.some((row: { id: number }) => row.id === report.id));
    const review = { expectedStatus: 'PENDING', status: 'REVIEWING', resolution: 'Review started in regression test' };
    assert.equal((await request(`/admin/reports/${report.id}/status`, admin, 'PUT', review)).status, 200);
    assert.equal((await request(`/admin/reports/${report.id}/status`, admin, 'PUT', review)).status, 409);
    assert.equal((await request(`/admin/reports/${report.id}/status`, admin, 'PUT', { expectedStatus: 'REVIEWING', status: 'RESOLVED', resolution: 'Regression review completed' })).status, 200);
    assert.equal((await prisma.report.findUniqueOrThrow({ where: { id: report.id } })).moderatorId, admin.id);

    const closedRegistration = await settingsBody({ userRegistration: false });
    assert.equal((await request('/admin/settings', admin, 'PUT', closedRegistration)).status, 200);
    assert.equal((await request('/admin/settings', admin, 'PUT', closedRegistration)).status, 409);
    assert.equal((await fetch(base + '/auth/register/buyer', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Closed registration test', email: `closed-${nonce}@example.test`, password: 'registration-regression-password' }) })).status, 403);
    assert.equal(await prisma.user.count({ where: { email: `closed-${nonce}@example.test` } }), 0);
    assert.equal((await request('/admin/settings', admin, 'PUT', await settingsBody({ categories: ['Regression category'], designApproval: false }))).status, 200);
    const submission = { title: 'Settings-enforced submission', category: 'Logos', price: 25, fileUrl: 'https://storage.example.test/private', watermarkedPreviewUrl: 'https://storage.example.test/preview' };
    assert.equal((await request('/designs', seller, 'POST', submission)).status, 400);
    const approved = await request('/designs', seller, 'POST', { ...submission, category: 'Regression category' });
    assert.equal(approved.status, 201);
    assert.equal((await approved.json()).design.status, 'APPROVED');
    assert.equal((await request('/admin/settings', admin, 'PUT', await settingsBody({ maintenanceMode: true }))).status, 200);
    assert.equal((await fetch(base + '/designs')).status, 503);
    assert.equal((await request('/designs', buyer)).status, 503);
    assert.equal((await request('/designs', admin)).status, 200);
    assert.equal((await request('/admin/settings', admin, 'PUT', await settingsBody({ maintenanceMode: false }))).status, 200);

    assert.equal((await request(`/users/${admin.id}`, buyer)).status, 403);
    assert.equal((await request(`/admin/users/${buyer.id}`, admin, 'DELETE')).status, 200);
    assert.equal((await prisma.user.findUniqueOrThrow({ where: { id: buyer.id } })).status, 'BANNED');
    assert.equal((await request('/auth/me', buyer)).status, 401);
    assert.equal((await request(`/designs/${design.id}`, seller, 'DELETE')).status, 200);
    assert.ok((await prisma.design.findUniqueOrThrow({ where: { id: design.id } })).archivedAt);
    assert.equal((await fetch(base + `/designs/${design.id}`)).status, 404);
    await prisma.design.update({ where: { id: design.id }, data: { title: 'Edited after purchase' } });
    assert.equal((await prisma.transaction.findUniqueOrThrow({ where: { id: purchase.id } })).designTitle, 'Retained purchase regression');
    await assert.rejects(prisma.buyer.delete({ where: { id: buyer.buyer.id } }));
    await assert.rejects(prisma.user.delete({ where: { id: buyer.id } }));
    await assert.rejects(prisma.design.delete({ where: { id: design.id } }));
    assert.equal(await prisma.transaction.count({ where: { id: purchase.id } }), 1);
    assert.equal((await request(`/admin/transactions/${purchase.id}/refund`, admin, 'PUT', {})).status, 503);
    assert.equal((await prisma.transaction.findUniqueOrThrow({ where: { id: purchase.id } })).paymentStatus, 'COMPLETED');
  } finally {
    await prisma.siteSettings.update({ where: { id: 1 }, data: { maintenanceMode: initialSettings.maintenanceMode, userRegistration: initialSettings.userRegistration, designApproval: initialSettings.designApproval, categories: initialSettings.categories, version: { increment: 1 } } });
    await prisma.report.deleteMany({ where: { OR: [{ reporterId: buyer.id }, { moderatorId: admin.id }] } });
    await prisma.transaction.deleteMany({ where: { buyerId: buyer.buyer.id } });
    await prisma.withdrawal.deleteMany({ where: { designerId: seller.designer.id } });
    await prisma.design.deleteMany({ where: { designerId: seller.designer.id } });
    await prisma.user.deleteMany({ where: { id: { in: [admin.id, seller.id, buyer.id] } } });
    await new Promise<void>((resolve, reject) => server.close((error: Error | undefined) => error ? reject(error) : resolve()));
    await prisma.$disconnect();
  }
});
