import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {readFileSync} from 'node:fs';
const source=ts.transpileModule(readFileSync(new URL('../lib/honorifics.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const h=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('Vietnamese relationships determine the couple and guest forms of address',()=>{
 const message='Chúng mình rất mong được cùng bạn chung vui.';
 assert.equal(h.invitationMessage(message,'anh'),'Chúng em rất mong được cùng anh chung vui.');
 assert.equal(h.invitationMessage(message,'chi'),'Chúng em rất mong được cùng chị chung vui.');
 assert.equal(h.invitationMessage(message,'co'),'Chúng cháu rất mong được cùng cô chung vui.');
 assert.equal(h.invitationMessage(message,'chu'),'Chúng cháu rất mong được cùng chú chung vui.');
 assert.equal(h.invitationMessage(message,'em'),'Anh chị rất mong được cùng em chung vui.');
 assert.equal(h.invitationMessage('{{xung_ho}} kính mời {{danh_xung}}','ong-ba'),'chúng cháu kính mời ông bà');
});
test('old invitation names and wording remain unchanged until a salutation is selected',()=>{
 assert.equal(h.guestSalutation('Anh Nam và gia đình'),'Anh Nam và gia đình');
 assert.equal(h.guestSalutation('Nguyễn Văn Nam','anh'),'Anh Nguyễn Văn Nam');
 assert.equal(h.guestSalutation('Anh Nam','anh'),'Anh Nam');
 assert.equal(h.invitationMessage('Chúng tôi trân trọng kính mời bạn.'),'Chúng tôi trân trọng kính mời bạn.');
 assert.equal(h.invitationMessage('Tình bạn và bạn bè. Chúng mình chờ bạn!','co'),'Tình bạn và bạn bè. Chúng cháu chờ cô!');
 for(const invalid of [null,{},'admin','<script>',1])assert.equal(h.validHonorific(invalid),false);
 assert.equal(h.validHonorific(''),true);
});
