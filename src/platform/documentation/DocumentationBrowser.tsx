import {useMemo,useState} from 'react';
import type {ReactNode} from 'react';
import type {DocArticle,DocScope} from './types';
import {docKey,findDoc,searchDocs} from './types';
import './documentation.css';
type Props={
 scope:DocScope;articles:DocArticle[];tabs:string[];activeDoc:string;
 onChange:(tabs:string[],activeDoc:string)=>void;
 onPopout:(scope:DocScope,id:string)=>void;
 onCrossLink:(scope:DocScope,id:string)=>void;
};
export default function DocumentationBrowser({scope,articles,tabs,activeDoc,onChange,onPopout,onCrossLink}:Props){
 const [query,setQuery]=useState(''),[category,setCategory]=useState('All');
 const categories=[...new Set(articles.map(a=>a.category))];
 const matching=useMemo(()=>searchDocs(articles,query,category),[articles,query,category]);
 const fallback=articles[0],active=findDoc(articles,activeDoc)??fallback;
 const normalizedTabs=tabs.filter(k=>!!findDoc(articles,k));
 if(!normalizedTabs.includes(docKey(active.scope,active.id)))normalizedTabs.push(docKey(active.scope,active.id));
 const tabList=normalizedTabs.slice(-12);
 const open=(article:DocArticle,newTab=false)=>{
  const key=docKey(article.scope,article.id);
  const next=newTab||!tabList.length?[...tabList.filter(x=>x!==key),key]:tabList.map(t=>t===activeDoc?key:t);
  onChange(next.slice(-12),key);
 };
 const navigate=(scopeValue:DocScope,id:string,newTab=false)=>{
  const record=articles.find(x=>x.id===id&&x.scope===scopeValue);
  if(record)open(record,newTab);else onCrossLink(scopeValue,id);
 };
 const renderLinkedParagraph=(value:string):ReactNode[]=>{
  const chunks=value.split(/(\[\[[^\]]+\]\])/g);
  return chunks.map((chunk,index)=>{
    const match=chunk.match(/^\[\[([^|]+)\|(python|game):([^\]]+)\]\]$/);
    if(!match)return chunk;
    return <button key={index} className="documentation-inline-link"
      onClick={()=>navigate(match[2] as DocScope,match[3])}>{match[1]}</button>;
  });
 };
 const close=(key:string)=>{
  const next=tabList.filter(t=>t!==key);
  onChange(next,next.includes(activeDoc)?activeDoc:next[next.length-1]??docKey(fallback.scope,fallback.id));
 };
 return <div className="documentation-browser">
   <div className="documentation-toolbar">
    <strong>{scope==='python'?'PYTHON REFERENCE':'GAME API'}</strong>
    <span>{articles.length} ARTICLES · UNRESTRICTED</span>
   </div>
   <div className="documentation-tabs" role="tablist" aria-label="Open documentation tabs">
    {tabList.map(key=>{
      const a=findDoc(articles,key)!;
      return <div key={key} className={'documentation-tab '+(activeDoc===key?'active':'')} role="tab" aria-selected={activeDoc===key}>
       <button title={'Show '+a.title} onClick={()=>onChange(tabList,key)}>{a.title}</button>
       <button aria-label={'Close '+a.title+' tab'} title="Close tab" onClick={()=>close(key)}>×</button>
      </div>;
    })}
    <button className="documentation-new-tab" title="New documentation tab" onClick={()=>open(fallback,true)}>＋</button>
   </div>
   <div className="documentation-filter">
    <input aria-label="Search documentation" type="search" value={query} placeholder="Search topics, methods and examples..." onChange={e=>setQuery(e.target.value)}/>
    <select aria-label="Documentation category" value={category} onChange={e=>setCategory(e.target.value)}>
      <option value="All">All categories</option>{categories.map(v=><option key={v}>{v}</option>)}
    </select>
   </div>
   <div className="documentation-columns">
    <nav className="documentation-directory" aria-label="Documentation topics">
      {categories.map(cat=>{
       const items=matching.filter(x=>x.category===cat);
       if(!items.length)return null;
       return <section key={cat}><h3>{cat}</h3>{items.map(x=><button key={x.id} className={activeDoc===docKey(x.scope,x.id)?'active':''}
        onClick={()=>open(x)} onAuxClick={e=>{if(e.button===1)open(x,true);}} title={'Open '+x.title}>{x.title}</button>)}</section>;
      })}
      {!matching.length&&<p>No matching documents.</p>}
    </nav>
    <article className="documentation-article" key={activeDoc}>
      <div className="documentation-article-toolbar">
       <span>{active.category}</span>
       <div>
        <button title="Open this article in another tab" onClick={()=>open(active,true)}>＋ Tab</button>
        <button title="Pop out into a movable window" onClick={()=>onPopout(active.scope,active.id)}>↗ Pop out</button>
       </div>
      </div>
      <h2>{active.title}</h2>
      {active.signature&&<pre className="documentation-signature">{active.signature}</pre>}
      <p className="documentation-summary">{active.summary}</p>
      {active.body.split('\n\n').filter(Boolean).map((paragraph,i)=><p key={i}>{renderLinkedParagraph(paragraph)}</p>)}
      {active.example&&<><h3>Example</h3><pre className="documentation-code"><code>{active.example}</code></pre>
       <button className="documentation-copy" onClick={()=>{void navigator.clipboard?.writeText(active.example);}}>⧉ Copy example</button></>}
      {active.tip&&<div className="documentation-tip"><strong>Remember</strong><p>{active.tip}</p></div>}
      {active.returns&&<p className="documentation-return">Returns: {active.returns}</p>}
      {!!active.related.length&&<><h3>Related topics</h3><div className="documentation-related">
       {active.related.map(x=><button key={docKey(x.scope,x.id)} onClick={()=>navigate(x.scope,x.id)}
          title={'Open '+x.label}>{x.label} ↗</button>)}
      </div></>}
      {scope==='python'&&<a className="documentation-official" href="https://docs.python.org/3/tutorial/" target="_blank" rel="noreferrer">Official Python documentation ↗</a>}
    </article>
   </div>
 </div>;
}
