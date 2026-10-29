import vinext from 'vinext';
import { defineConfig } from 'vite';
import { cloudflare } from '@cloudflare/vite-plugin';
import { copyFileSync,mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
// Vite copies public files to the asset root; publish them at the app prefix too.
const weddingPublicAssets={name:'wedding-public-assets',apply:'build' as const,closeBundle(){
 const directory=resolve('dist/client/weddings');mkdirSync(directory,{recursive:true});
 for(const file of ['wedding.png','favicon.svg'])copyFileSync(resolve('public',file),resolve(directory,file));
}};
export default defineConfig({plugins:[vinext(),cloudflare({configPath:'wrangler.jsonc',viteEnvironment:{name:'rsc',childEnvironments:['ssr']},inspectorPort:false}),weddingPublicAssets]});
