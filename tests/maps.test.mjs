import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/maps.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {weddingMapUrl,validMapUrl}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('existing invitations use a correctly encoded Vietnamese venue and address',()=>{
 const url=new URL(weddingMapUrl({venue:'Sảnh Hồng & Lan',address:'12 Nguyễn Huệ, TP. Hồ Chí Minh'}));
 assert.equal(url.origin,'https://www.google.com');
 assert.equal(url.searchParams.get('query'),'Sảnh Hồng & Lan 12 Nguyễn Huệ, TP. Hồ Chí Minh');
});
test('QR and directions prefer the exact shared map URL',()=>{
 assert.equal(weddingMapUrl({venue:'Nhà hàng',address:'Địa chỉ',mapUrl:' https://maps.app.goo.gl/abc123 '}),'https://maps.app.goo.gl/abc123');
 assert.equal(weddingMapUrl({venue:' ',address:' '}),'');
});
test('invalid map URLs cannot become clickable invitation links',()=>{
 for(const value of ['javascript:alert(1)','data:text/html,test','http://example.com','https://user:password@example.com','/relative',null,'https://example.com/'+'x'.repeat(2048)])assert.equal(validMapUrl(value),false);
 assert.equal(validMapUrl('https://www.google.com/maps/place/Test'),true);
 assert.match(weddingMapUrl({venue:'Nhà hàng',address:'Hà Nội',mapUrl:'javascript:alert(1)'}),/^https:\/\/www.google.com\/maps\/search/);
});
