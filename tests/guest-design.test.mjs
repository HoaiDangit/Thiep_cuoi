import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const compile=name=>ts.transpileModule(readFileSync(new URL('../lib/'+name+'.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const url=source=>'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const module=compile('guest-design').replace("'./wedding'",JSON.stringify(url(compile('wedding')))).replace("'./photo'",JSON.stringify(url(compile('photo'))));
const {validateGuestDesign,guestDesign}=await import(url(module));
test('guest design changes accept known templates and bounded image settings only',()=>{
 assert.deepEqual(validateGuestDesign({template:'merlot',orientation:'landscape',photoScale:200,photoX:0,photoY:100}),{template:'merlot',orientation:'landscape',photoScale:200,photoX:0,photoY:100});
 for(const value of [null,[],{template:'unknown'},{template:'garden',orientation:'wide'},{template:'garden',photo:'https://example.org/a.png'},{template:'garden',photo:'../private'},{template:'garden',photoScale:251},{template:'garden',photoX:Infinity},{template:'garden',photoOpacity:-1},{template:'garden',owner:'other'},{template:'garden',date:'2027-01-01'}])assert.throws(()=>validateGuestDesign(value));
 const design=guestDesign({template:'garden'});assert.equal(design.orientation,'portrait');assert.equal(design.photoOpacity,70);assert.equal(design.photoScale,100);
});
