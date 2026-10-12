import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
async function moduleAt(path){const js=ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;return import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));}
const a=await moduleAt('../lib/admin-core.ts'),w=await moduleAt('../lib/wedding.ts');
test('guest links stay open for exactly 40 days, including month/year boundaries',()=>{
 const created=Date.parse('2026-12-20T11:30:00Z'),expires=w.guestExpiry(created);
 assert.equal(expires-created,40*24*60*60*1000);assert.equal(new Date(expires).toISOString(),'2027-01-29T11:30:00.000Z');
 const now=Date.now();assert.equal(w.status({expires:now+1000,revoked:0}),'Đang mở');assert.equal(w.status({expires:now,revoked:0}),'Hết hạn');assert.equal(w.status({expires:now+1000,revoked:1}),'Đã thu hồi');
});
test('admin password comparison handles unicode and rejects wrong passwords',async()=>{
 assert.equal(await a.passwordMatches('Mật-khẩu-quản-trị-123','Mật-khẩu-quản-trị-123'),true);
 assert.equal(await a.passwordMatches('wrong','Mật-khẩu-quản-trị-123'),false);
 assert.equal(await a.passwordMatches('Mật-khẩu-quản-trị-123!','Mật-khẩu-quản-trị-123'),false);
 assert.equal((await a.digest('token')).length,64);
});
test('session cookies reject arbitrary strings and old forged identities',()=>{
 assert.equal(a.validAdminToken('a'.repeat(64)),true);for(const input of [null,'admin','local_seedy','a'.repeat(63),'g'.repeat(64),'a'.repeat(64)+'\n'])assert.equal(a.validAdminToken(input),false);
});
