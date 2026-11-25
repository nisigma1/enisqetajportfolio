import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';
const source = await readFile(new URL('../lib/contact-email.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { contactEmailDraft } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('email fallback preserves message, contact details, and selected payment without sending', () => {
  const values = { name: 'Enis & Test', email: 'test@example.com', project: 'Advanced (€60/month)', paymentMethod: 'Crypto payment', message: 'Përshëndetje!\nA & B? #test + details' };
  const draft = contactEmailDraft('enisqeta5@gmail.com', values);
  const url = new URL(draft.href);
  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'enisqeta5@gmail.com');
  assert.equal(url.searchParams.get('subject'), '[Website] Advanced (€60/month) — Enis & Test');
  for (const value of Object.values(values)) assert.ok(url.searchParams.get('body').includes(value));
  assert.ok(draft.text.includes(values.message));
});
test('ordinary inquiries omit payment and long drafts stay intact for copying', () => {
  const values = { name: 'Test\r\nName', email: 'test@example.com', project: 'Digital project', paymentMethod: '', message: 'a'.repeat(4000) };
  const draft = contactEmailDraft('enisqeta5@gmail.com', values);
  assert.doesNotMatch(new URL(draft.href).searchParams.get('subject'), /[\r\n]/);
  assert.doesNotMatch(draft.text, /Payment method:/);
  assert.ok(draft.text.endsWith(values.message));
});
