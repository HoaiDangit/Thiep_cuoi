import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/photo.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const p=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('image upload rejects disguised SVG and accepts only supported binary signatures',()=>{
 assert.equal(p.photoType(new TextEncoder().encode('<svg onload="alert(1)"></svg>')),null);
 assert.equal(p.photoType(new Uint8Array([255,216,255,224])),'image/jpeg');
 assert.equal(p.photoType(new Uint8Array([137,80,78,71,13,10,26,10])),'image/png');
 assert.equal(p.photoType(new TextEncoder().encode('RIFFxxxxWEBP')),'image/webp');
 assert.equal(p.photoType(new Uint8Array([137,80,78])),null);
});
test('saved photo references cannot contain external URLs, traversal or arbitrary IDs',()=>{
 const path='/api/photos/12345678-1234-4123-8123-123456789abc';assert.equal(p.validPhotoPath(path),true);
 for(const value of ['https://example.com/photo.jpg','data:image/svg+xml,<svg/>','/api/photos/../auth','/api/photos/not-a-uuid',path+'?x=1',null])assert.equal(p.validPhotoPath(value),false);
});
