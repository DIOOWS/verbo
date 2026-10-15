(function(root){
'use strict';
const DECISIONS=['Aceitou Jesus','Quer se batizar','Quer ser líder de célula','Quer ser anfitrião de célula'];
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const id=v=>/^\d+$/.test(String(v??'').trim())?String(v).trim().replace(/^0+(?=\d)/,''):norm(v);
const yes=v=>['sim','s','yes','true','1','x'].includes(norm(v));
function parse(matrix){
 const rows=matrix.filter(r=>r.some(v=>v!==''&&v!==null&&v!==undefined));
 if(rows.length<2)throw Error('A planilha precisa de um cabeçalho e pelo menos uma pessoa.');
 const headers=rows[0].map(v=>String(v??''));
 if(headers.some(v=>!v.trim())||new Set(headers.map(norm)).size!==headers.length)throw Error('Há colunas sem título ou com títulos repetidos. Corrija o cabeçalho.');
 const name=headers.findIndex(v=>norm(v)==='nome');
 const code=headers.findIndex(v=>norm(v)==='codigo da inscricao');
 const ident=headers.findIndex(v=>['id','id verbo'].includes(norm(v)));
 if(name<0)throw Error('Não encontrei a coluna Nome.');
 const dcols=DECISIONS.map(d=>headers.findIndex(h=>norm(h)===norm(d)));
 const original=headers.map((h,i)=>i).filter(i=>i!==ident&&!dcols.includes(i));
 const baseHeaders=original.map(i=>headers[i]);
 const people=rows.slice(1).map((r,n)=>{
  if(!String(r[name]??'').trim())throw Error('Nome vazio na linha '+(n+2)+'.');
  const value=ident<0?String(n+1).padStart(3,'0'):String(r[ident]??'').trim();
  if(!value)throw Error('ID vazio na linha '+(n+2)+'.');
  return {id:value,code:code<0?'':String(r[code]??'').trim(),values:original.map(i=>r[i]??''),decisions:dcols.map(i=>i>=0&&yes(r[i]))};
 });
 if(new Set(people.map(p=>id(p.id))).size!==people.length)throw Error('Existem IDs repetidos (001 e 1 contam como o mesmo ID).');
 const codes=people.map(p=>p.code).filter(Boolean);
 if(new Set(codes).size!==codes.length)throw Error('Existem códigos de inscrição repetidos.');
 return {headers:baseHeaders,people,generated:ident<0};
}
function merge(base,incoming){
 if(JSON.stringify(base.headers)!==JSON.stringify(incoming.headers))throw Error('As colunas originais são diferentes. Use a mesma base em todos os aparelhos.');
 const out=JSON.parse(JSON.stringify(base));let added=0;let conflicts=0;
 const names=base.headers.findIndex(h=>norm(h)==='nome');
 for(const p of incoming.people){
 const existing=out.people.find(q=>id(q.id)===id(p.id));
 if(!existing)throw Error('ID '+p.id+' não existe na base deste aparelho. Consolidação interrompida.');
 if(existing.code!==p.code||norm(existing.values[names])!==norm(p.values[names]))throw Error('O ID '+p.id+' identifica pessoas diferentes. Use a mesma base numerada.');
 for(let i=0;i<4;i++)if(p.decisions[i]&&!existing.decisions[i]){existing.decisions[i]=true;added++;}
 if(JSON.stringify(existing.values)!==JSON.stringify(p.values))conflicts++;
 }
 return {base:out,added,conflicts};
}
const matchesName=(name,query)=>{const terms=norm(query).split(/\s+/).filter(Boolean);return terms.length>0&&terms.every(term=>norm(name).includes(term));};
const api={DECISIONS,norm,id,yes,parse,merge,matchesName};root.VerboCore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
