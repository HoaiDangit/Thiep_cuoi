// Run only through an authenticated Cloudflare CLI. The raw token is never stored.
import { spawnSync } from 'node:child_process';
import { randomBytes,createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const args=process.argv.slice(2),local=args.includes('--local'),reset=args.includes('--reset');
const urlIndex=args.indexOf('--url');
if(urlIndex<0||!args[urlIndex+1])throw new Error('Usage: node scripts/create-admin-setup.mjs --url https://your-worker.workers.dev [--local] [--reset]');
const base=new URL(args[urlIndex+1]);
if(base.username||base.password||base.search||base.hash||(!local&&base.protocol!=='https:'))throw new Error('Provide a public HTTPS site URL.');
const wrangler=fileURLToPath(new URL('../node_modules/wrangler/bin/wrangler.js',import.meta.url));
function query(sql){const result=spawnSync(process.execPath,[wrangler,'d1','execute','DB',local?'--local':'--remote','--config','wrangler.jsonc',...(local?['--persist-to','.wrangler/state']:[]),'--command',sql,'--json'],{encoding:'utf8',windowsHide:true});if(result.error||result.status!==0)throw new Error('Cloudflare database command failed. Check Wrangler authentication and database migrations.');return JSON.parse(result.stdout);}
const existing=query("SELECT count(*) AS n FROM admin_credentials WHERE id='admin'");
if(existing[0]?.results[0]?.n&&!reset)throw new Error('A personal password already exists. Use the signed-in change-password page, or --reset only for an owner-authorized recovery.');
const token=randomBytes(32).toString('hex'),hash=createHash('sha256').update(token).digest('hex'),expires=Date.now()+24*60*60*1000;
query(`DELETE FROM admin_setup_tokens; INSERT INTO admin_setup_tokens (token_hash,expires) VALUES ('${hash}',${expires});`);
console.log(new URL('/setup#token='+token,base).href);
