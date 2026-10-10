import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const cfg=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
if(cfg.d1_databases[0].database_id==='00000000-0000-4000-8000-000000000000')throw new Error('Hãy tạo D1 và điền database_id thật vào wrangler.jsonc trước khi deploy.');
const executable=process.platform==='win32'?'pnpm.cmd':'pnpm';
for(const args of [['run','check'],['run','test'],['run','build'],['run','db:remote'],['exec','wrangler','deploy','--config','dist/server/wrangler.json']]){const r=spawnSync(executable,args,{stdio:'inherit',shell:process.platform==='win32'});if(r.error)throw r.error;if(r.status!==0)process.exit(r.status??1);}
