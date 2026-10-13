// Uso (necesita Node 18 o más nuevo):
//   node herramientas/catalogo.mjs            -> recalcula integraciones/index.json (oficial y comunidad)
//   node herramientas/catalogo.mjs claves     -> crea clave-privada.json (GUARDALA, NO LA SUBAS) y clave-publica.json
//   node herramientas/catalogo.mjs firmar     -> crea integraciones/index.json.sig con tu clave privada
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createHash, webcrypto as c } from 'node:crypto';
const base = new URL('../integraciones/', import.meta.url);
const cmd = process.argv[2] || 'catalogo';
function lista(k) {
  const d = new URL(k + '/', base); let fs = [];
  try { fs = readdirSync(d).filter(f => f.endsWith('.json')).sort(); } catch {}
  return fs.map(f => {
    const raw = readFileSync(new URL(f, d)); const j = JSON.parse(raw);
    return { id: j.id, name: j.name, ver: j.ver, desc: j.desc, offline: !!j.offline, file: k + '/' + f, sha256: createHash('sha256').update(raw).digest('hex') };
  });
}
if (cmd === 'catalogo') {
  const idx = { oficial: lista('oficial'), comunidad: lista('comunidad') };
  writeFileSync(new URL('index.json', base), JSON.stringify(idx, null, 2) + '\n');
  console.log('index.json listo:', idx.oficial.length, 'oficiales y', idx.comunidad.length, 'de la comunidad');
} else if (cmd === 'claves') {
  const k = await c.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  writeFileSync('clave-privada.json', JSON.stringify(await c.subtle.exportKey('jwk', k.privateKey)));
  writeFileSync('clave-publica.json', JSON.stringify(await c.subtle.exportKey('jwk', k.publicKey)));
  console.log('Listo. Guardá clave-privada.json en un lugar seguro y NO la subas a GitHub.');
} else if (cmd === 'firmar') {
  const k = await c.subtle.importKey('jwk', JSON.parse(readFileSync('clave-privada.json')), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const firma = await c.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, k, readFileSync(new URL('index.json', base)));
  writeFileSync(new URL('index.json.sig', base), Buffer.from(firma).toString('base64'));
  console.log('index.json.sig listo');
}
