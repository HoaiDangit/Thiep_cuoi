import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync,mkdtempSync,writeFileSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const tmp=mkdtempSync(join(tmpdir(),'loi-hen-auth-'));
const target=join(tmp,'auth-core.mjs');
writeFileSync(target,ts.transpileModule(readFileSync(new URL('../lib/auth-core.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText);
const a=await import(pathToFileURL(target));
const config={url:'https://example.supabase.co',key:'sb_publishable_test'};
process.on('exit',()=>rmSync(tmp,{recursive:true,force:true}));
test('cookie-auth writes reject missing, cross-site and foreign Origin',()=>{
 for(const headers of [{},{origin:'https://other.test'},{origin:'https://loi-hen.test','sec-fetch-site':'cross-site'}])assert.throws(()=>a.verifyOrigin(new Request('https://loi-hen.test/api/auth/login',{method:'POST',headers})),e=>e.status===403);
 assert.doesNotThrow(()=>a.verifyOrigin(new Request('https://loi-hen.test/api/auth/login',{method:'POST',headers:{origin:'https://loi-hen.test'}})));
});
test('configuration refuses credential-bearing URLs and privileged keys',()=>{
 for(const cfg of [{},{SUPABASE_URL:'http://example.test',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_x'},{SUPABASE_URL:'https://name:password@example.test',SUPABASE_PUBLISHABLE_KEY:'sb_publishable_x'},{SUPABASE_URL:'https://example.test',SUPABASE_PUBLISHABLE_KEY:'sb_secret_x'}])assert.throws(()=>a.readAuthConfig(cfg));
 assert.deepEqual(a.readAuthConfig({SUPABASE_URL:config.url,SUPABASE_PUBLISHABLE_KEY:config.key}),config);
});
test('provider receives password only in request body and bearer only for identity lookup',async()=>{
 let seen;await a.authCall(config,'/token?grant_type=password',{email:'a@b.test',password:'sample-pass'},undefined,async(url,init)=>{seen={url,init};return Response.json({access_token:'token'});});
 assert.equal(seen.url,config.url+'/auth/v1/token?grant_type=password');assert.ok(!seen.url.includes('sample-pass'));assert.equal(seen.init.headers.apikey,config.key);assert.equal(seen.init.headers.Authorization,undefined);assert.equal(seen.init.cache,'no-store');
 await a.authCall(config,'/user',undefined,'valid-token',async(_,init)=>{assert.equal(init.method,'GET');assert.equal(init.headers.Authorization,'Bearer valid-token');return Response.json({id:'owner-id'});});
});
test('wrong passwords, upstream outages and throttling are safely classified without leaking responses',async()=>{
 for(const [status,expected]of [[400,400],[401,401],[429,429],[502,503]])await assert.rejects(()=>a.authCall(config,'/token',{},undefined,async()=>new Response('INTERNAL_SECRET_DETAIL',{status})),e=>e.status===expected&&!e.message.includes('INTERNAL_SECRET_DETAIL'));
 await assert.rejects(()=>a.authCall(config,'/user',undefined,'t',async()=>{throw new Error('network-secret');}),e=>e.status===503&&!e.message.includes('network-secret'));
});
test('sessions require bounded tokens and positive expiry',()=>{
 for(const x of [null,{}, {access_token:'a\nSet-Cookie:evil',refresh_token:'b',expires_in:3600},{access_token:'a',refresh_token:'b',expires_in:-1}])assert.throws(()=>a.validSession(x));
 assert.deepEqual(a.validSession({access_token:'abc.def.ghi',refresh_token:'abcd',expires_in:3600}),{access:'abc.def.ghi',refresh:'abcd',seconds:3600});
});
