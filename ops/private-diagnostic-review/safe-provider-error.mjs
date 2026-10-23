// No message, SQL, documentation_url, result, request headers or token is emitted.
export function providerCodes(value){
 if(!Array.isArray(value?.errors))return [];
 return [...new Set(value.errors.slice(0,8).map(e=>e?.code).filter(n=>Number.isSafeInteger(n)&&n>=1000&&n<=999999))];
}
export async function readProviderCodes(response){
 if(response.status!==400||!response.headers.get('content-type')?.includes('application/json'))return [];
 const reader=response.body?.getReader();if(!reader)return [];
 try{const chunks=[];let length=0;while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>16384){await reader.cancel();return [];}chunks.push(value);}
 const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}return providerCodes(JSON.parse(new TextDecoder().decode(bytes)));
 }catch{return [];}finally{reader.releaseLock();}
}
