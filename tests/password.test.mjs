import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/password.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const p=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('personal passwords use salted slow hashes and exact Unicode verification',async()=>{
 const password='Mật khẩu riêng của tôi 2026';
 const a=await p.makePasswordRecord(password),b=await p.makePasswordRecord(password);
 assert.equal(a.iterations,600000);assert.notEqual(a.salt,b.salt);assert.notEqual(a.password_hash,b.password_hash);
 assert.ok(!JSON.stringify(a).includes(password));assert.equal(await p.verifyPersonalPassword(password,a),true);
 assert.equal(await p.verifyPersonalPassword(password+'!',a),false);
 assert.equal(await p.verifyPersonalPassword(password,{...a,iterations:1}),false);
});
test('personal password validation bounds hashing cost and does not trim passwords',async()=>{
 for(const value of [null,123,'short','x'.repeat(257)])assert.equal(p.validNewPassword(value),false);
 assert.equal(p.validNewPassword('x'.repeat(16)),true);
 await assert.rejects(p.makePasswordRecord('short'));
 const password='  mật khẩu có khoảng trắng  ';
 const record=await p.makePasswordRecord(password);
 assert.equal(await p.verifyPersonalPassword(password,record),true);
 assert.equal(await p.verifyPersonalPassword(password.trim(),record),false);
});
