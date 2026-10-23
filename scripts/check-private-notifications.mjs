import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash,randomBytes} from 'node:crypto';
import {createRequire} from 'node:module';
import {build} from 'esbuild';
const require=createRequire(import.meta.url);
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
// Generated synthetic keys are local test inputs, never logged/persisted or operational.
const key=randomBytes(32).toString('hex'), hash=createHash('sha256').update(key).digest('hex');
const bundle=await build({stdin:{contents:`import {handleNotificationMetadata} from './lib/private-diagnostic/notifications';export default {fetch(r,e){return handleNotificationMetadata(r,{...e,PRIVATE_DIAGNOSTIC_NOTIFY_ENABLED:r.headers.get('x-off')?'false':'true',PRIVATE_DIAGNOSTIC_NOTIFY_TOKEN_SHA256:r.headers.get('x-revoked')?'':e.TEST_HASH});}}`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'browser',external:['node:*']});
const mf=new Miniflare({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2026-05-22',compatibilityFlags:['nodejs_compat'],d1Databases:['PRIVATE_DIAGNOSTIC_DB'],bindings:{TEST_HASH:hash}});
const db=await mf.getD1Database('PRIVATE_DIAGNOSTIC_DB');
const request=(headers={},suffix='',method='GET')=>mf.dispatchFetch('https://synthetic.invalid/api/private-diagnostic/notifications'+suffix,{method,headers});
try {
 for(const [headers,status] of [[{},401],[{authorization:'Bearer '+key,'x-off':'1'},404],[{authorization:'Bearer '+key,'x-revoked':'1'},401],[{authorization:'Bearer '+'f'.repeat(64)},401]])assert.equal((await request(headers)).status,status);
 const auth={authorization:'Bearer '+key};
 assert.equal((await request(auth)).status,503); // no schema, auth before DB.
 for(const path of ['0001.sql','0002-notification-state.sql'])await db.exec((await readFile('migrations/private-diagnostic/'+path,'utf8')).replace(/--[^\n]*/g,'').replace(/\n/g,' '));
 assert.deepEqual(await (await request(auth)).json(),{version:1,cursor:null});
 const now=Math.floor(Date.now()/1000);
 const insert=(id,expiry=now+2592000)=>db.prepare("INSERT OR IGNORE INTO private_diagnostic_reports VALUES(?, 'synthetic-hash', '{\"marker\":\"synthetic-private-body\"}',1,?,?)").bind(id,now,expiry).run();
 await insert('synthetic-a');
 const one=await (await request(auth)).json();assert.match(one.cursor,/^[a-f0-9]{32}$/);assert.deepEqual(Object.keys(one).sort(),['cursor','version']);
 await insert('synthetic-a');assert.deepEqual(await (await request(auth)).json(),one);
 await insert('synthetic-b');const two=await (await request(auth)).json();assert.notEqual(two.cursor,one.cursor);
 await db.prepare("DELETE FROM private_diagnostic_reports WHERE receipt_id='synthetic-b'").run();assert.deepEqual(await (await request(auth)).json(),two);
 assert.equal((await request(auth,'?token=synthetic')).status,400);assert.equal((await request({...auth,cookie:'owner=synthetic'})).status,400);assert.equal((await request({...auth,origin:'https://synthetic.invalid'})).status,400);assert.equal((await request(auth,'','POST')).status,405);
 const response=await request(auth);assert.equal(response.headers.get('access-control-allow-origin'),null);assert.match(response.headers.get('cache-control'),/no-store/);
 await db.prepare('UPDATE private_diagnostic_notification_state SET expires_at=?').bind(now).run();assert.deepEqual(await (await request(auth)).json(),{version:1,cursor:null});
 await db.prepare('INSERT INTO private_diagnostic_retention_health VALUES(1,?)').bind(now).run();assert.equal(await db.prepare('SELECT count(*) AS n FROM private_diagnostic_notification_state').first('n'),0);
 await insert('synthetic-c',now);await db.prepare('UPDATE private_diagnostic_retention_health SET last_cleanup=?').bind(now).run();assert.equal(await db.prepare('SELECT count(*) AS n FROM private_diagnostic_notification_state').first('n'),0);
 await db.exec("CREATE TRIGGER synthetic_abort AFTER INSERT ON private_diagnostic_reports BEGIN SELECT RAISE(ABORT,'synthetic'); END;");
 await assert.rejects(insert('synthetic-d'));assert.equal(await db.prepare('SELECT count(*) AS n FROM private_diagnostic_notification_state').first('n'),0);
 console.log('PASS: auth/default-OFF/revocation, no-body metadata, insert-only atomic cursor, retry/delete isolation, strict expiry, cleanup insert/update, rollback, method/query/CORS/cache');
} finally {await mf.dispose();}
