import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/password.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const pepper='independent-test-server-secret-2026';
const p=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('personal passwords use salted slow hashes and exact Unicode verification',async()=>{
 const password='Mật2026!';
 const a=await p.makePasswordRecord(password,pepper),b=await p.makePasswordRecord(password,pepper);
 assert.equal(a.iterations,100000);assert.notEqual(a.salt,b.salt);assert.notEqual(a.password_hash,b.password_hash);
 assert.equal(await p.verifyPersonalPassword(password,a,pepper+'wrong'),false);
 assert.ok(!JSON.stringify(a).includes(pepper));
 assert.ok(!JSON.stringify(a).includes(password));assert.equal(await p.verifyPersonalPassword(password,a,pepper),true);
 assert.equal(await p.verifyPersonalPassword(password+'!',a,pepper),false);
 assert.equal(await p.verifyPersonalPassword(password,{...a,iterations:1},pepper),false);
});
test('personal password validation bounds hashing cost and does not trim passwords',async()=>{
 for(const value of [null,123,'short','x'.repeat(7),'x'.repeat(257)])assert.equal(p.validNewPassword(value),false);
 assert.equal(p.validNewPassword('x'.repeat(8)),true);
 await assert.rejects(p.makePasswordRecord('short',pepper));
 const password='  mật khẩu có khoảng trắng  ';
 const record=await p.makePasswordRecord(password,pepper);
 assert.equal(await p.verifyPersonalPassword(password,record,pepper),true);
 assert.equal(await p.verifyPersonalPassword(password.trim(),record,pepper),false);
});
