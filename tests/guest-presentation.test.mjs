import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/guest-presentation.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const p=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const wedding={groom:'Minh Anh',bride:'Ngọc Linh',date:'2026-12-20',time:'18:00',venue:'Nhà hàng chung',address:'Địa chỉ chung',mapUrl:'https://maps.app.goo.gl/original',message:'Lời mời chung',photoX:50,photoY:50};
test('guest overrides are bounded, plain text and cannot change wedding ownership or expiration',()=>{
 const custom=p.validateGuestPresentation({message:'  Lời nhắn riêng  ',date:'2028-02-29',time:'11:30',venue:'Sảnh riêng',address:'Địa chỉ riêng',mapUrl:'https://maps.app.goo.gl/new',photoScale:175,photoX:25,photoY:80});
 assert.equal(custom.message,'Lời nhắn riêng');assert.equal(custom.photoScale,175);
 for(const value of [null,[],{date:'2027-02-29'},{time:'24:00'},{message:'x'.repeat(1501)},{photoScale:99},{photoScale:251},{photoScale:NaN},{photoX:Infinity},{photoY:-1},{venue:''},{address:' '},{mapUrl:'javascript:alert(1)'},{mapUrl:'https://user:pass@example.com'},{owner:'other'},{expires:Date.now()},{mapQr:{url:'x',image:'x'}}])assert.throws(()=>p.validateGuestPresentation(value));
});
test('unmodified fields inherit future shared wedding updates while custom fields stay per guest',()=>{
 const custom={message:'Riêng khách này',date:'2026-12-21',photoScale:180};const resolved=p.applyGuestPresentation(wedding,custom);
 assert.equal(resolved.date,'2026-12-21');assert.equal(resolved.venue,wedding.venue);assert.equal(wedding.message,'Lời mời chung');
 const next=p.applyGuestPresentation({...wedding,time:'19:30',venue:'Sảnh mới'},custom);assert.equal(next.time,'19:30');assert.equal(next.venue,'Sảnh mới');assert.equal(next.message,'Riêng khách này');
 assert.deepEqual(p.applyGuestPresentation(wedding,{}),wedding);assert.equal(p.applyGuestPresentation(wedding,{message:''}).message,'');
});
test('custom addresses clear stale map links and cached generated QR survives database decoding',()=>{
 assert.equal(p.applyGuestPresentation(wedding,{address:'Địa chỉ khác'}).mapUrl,'');
 assert.equal(p.applyGuestPresentation(wedding,{date:'2026-12-21'}).mapUrl,wedding.mapUrl);
 const qr={url:'https://maps.app.goo.gl/new',image:'data:image/svg+xml;base64,PHN2Zy8+'};const stored=p.readGuestPresentation(JSON.stringify({address:'Địa chỉ riêng',mapQr:qr}));assert.deepEqual(stored.mapQr,qr);
 assert.deepEqual(p.readGuestPresentation('not json'),{});assert.deepEqual(p.readGuestPresentation(null),{});
});
