// Article sections for both blogs (praxenai.com and praxenai.ge). The article data stays plain
// (heading, paragraphs, list, table); the structure is shown with UI, in the spirit of the Saldo blog:
// price tables become price cards, "when / what" tables a timeline, step lists numbered steps,
// other lists accent bullets with a bold lead, and wide tables stack into cards on phones.
export type ArticleBlockData={h:string;p?:string[];list?:string[];table?:[string[],...string[][]]};

const money=/[£$€₾]|\d\s?p\b|\d¢/;
const stepHeading=/^(how|step)|launch|start|the \d+ |как |с чего|шаг|план|запуск|როგორ|ეტაპ|გეგმა|დავიწყოთ|გაშვება/i;
const timeHeading=/^(when|когда|როდის)$/i;
const timeCol=/timeline|time|срок|ვად/i;

// "Lead. Rest" or "Lead: rest" with a short lead: the lead is shown in bold.
function Lead({text}:{text:string}){
 const m=text.match(/^([^.:]{2,60}?)([.:])\s+(.+)$/);
 if(!m||/\d$/.test(m[1]))return <>{text}</>;
 return <><b>{m[1]+(m[2]===':'?':':'.')}</b> {m[3]}</>;
}

function priceColumn(rows:string[][]):number{
 let best=-1,bestN=0;
 for(let c=1;c<rows[0].length;c++){const n=rows.filter(r=>money.test(r[c]||'')).length;if(n>bestN){best=c;bestN=n}}
 return bestN>=Math.ceil(rows.length/2)?best:-1;
}

// The price in large type; a tail after the first comma ("…a month, optional") goes into a small note.
function PriceValue({text}:{text:string}){
 if(!money.test(text))return <span className="art-price-value is-text">{text}</span>;
 const k=text.indexOf(', ');
 return k>0&&money.test(text.slice(0,k))?<><span className="art-price-value">{text.slice(0,k)}</span><span className="art-price-note">{text.slice(k+2)}</span></>:<span className="art-price-value">{text}</span>;
}

export function ArticleBlock({b}:{b:ArticleBlockData}){
 const [head,...rows]=b.table||[[]];
 const steps=!!b.list&&stepHeading.test(b.h);
 const pc=b.table&&head[0]!==''?priceColumn(rows):-1;
 const timeline=!!b.table&&head.length===2&&timeHeading.test(head[0]);
 return (<>
  <h2>{b.h}</h2>
  {b.p?.map(t=><p key={t}>{t}</p>)}
  {b.list&&(steps
   ?<ol className="art-steps">{b.list.map((t,i)=><li key={t}><span aria-hidden="true">{i+1}</span><div><Lead text={t}/></div></li>)}</ol>
   :<ul className="art-list">{b.list.map(t=><li key={t}><Lead text={t}/></li>)}</ul>)}
  {b.table&&(pc>0
   ?<div className={'art-prices'+(rows.length===3?' is-3':'')}>{rows.map(r=><div key={r[0]} className="art-price">
     <b className="art-price-name">{r[0]}</b>
     <PriceValue text={r[pc]}/>
     {r.map((v,i)=>i===0||i===pc||!v?null:timeCol.test(head[i])?<span key={i} className="art-chip">{head[i]}: {v}</span>:<span key={i} className="art-price-note">{v}</span>)}
    </div>)}</div>
   :timeline
   ?<ol className="art-timeline">{rows.map(([when,what])=><li key={when}><b>{when}</b><span>{what}</span></li>)}</ol>
   :<div className={'ix-article-table'+(head.length<3?' is-narrow':' is-stack')}><table>
     <thead><tr>{head.map((h,k)=><th key={k}>{h}</th>)}</tr></thead>
     <tbody>{rows.map(r=><tr key={r[0]}>{r.map((v,k)=>k?<td key={k} data-label={head[k]}>{v}</td>:<th key={k} scope="row">{v}</th>)}</tr>)}</tbody>
    </table></div>)}
 </>);
}
