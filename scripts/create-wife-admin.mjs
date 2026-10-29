// Owner CLI only. Read the bootstrap password from stdin; never store it in source.
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const local=process.argv.includes('--local');
if(!local&&!process.argv.includes('--remote'))throw new Error('Pass --local or --remote. Supply the initial password on stdin.');
const wrangler=fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url));
function sql(command){const result=spawnSync(process.execPath,[wrangler,'d1','execute','DB',local?'--local':'--remote','--config','wrangler.jsonc',...(local?['--persist-to','.wrangler/state']:[]),'--command',command,'--json'],{encoding:'utf8',windowsHide:true});if(result.status!==0)throw new Error('Cloudflare database command failed.');return JSON.parse(result.stdout);}
const existing=sql("SELECT id,must_change FROM admin_credentials WHERE id='adminWife'")[0]?.results[0];
if(existing){console.log('adminWife already exists; its password was preserved.');process.exit(0);}
const source=ts.transpileModule(readFileSync(new URL('../lib/password.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {makePasswordRecord,TEMPORARY_PASSWORD_PEPPER}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const password=readFileSync(0,'utf8').replace(/\r?\n$/,'');
const record=await makePasswordRecord(password,TEMPORARY_PASSWORD_PEPPER);
sql(`INSERT INTO admin_credentials (id,salt,password_hash,iterations,updated,must_change,temporary) VALUES ('adminWife','${record.salt}','${record.password_hash}',${record.iterations},${record.updated},1,1) ON CONFLICT(id) DO NOTHING`);
console.log('adminWife provisioned. First login requires a new personal password.');
