export type DocScope='python'|'game';
export type DocLink={scope:DocScope;id:string;label:string};
export type DocArticle={
 id:string;scope:DocScope;category:string;title:string;summary:string;body:string;
 example:string;tip:string;related:DocLink[];signature?:string;returns?:string;
};
export function docKey(scope:DocScope,id:string){return scope+':'+id;}
export function findDoc(articles:DocArticle[],key:string){return articles.find(a=>docKey(a.scope,a.id)===key);}
export function searchDocs(articles:DocArticle[],query:string,category:string){
 const needle=query.trim().toLowerCase();
 return articles.filter(a=>(category==='All'||a.category===category)&&
  (!needle||[a.title,a.summary,a.body,a.category,a.signature??'',a.example].join(' ').toLowerCase().includes(needle)));
}

/** A linked article already open in the browser is focused, never duplicated. */
export const MAX_OPEN_DOC_TABS=12;
export type DocNavigationMode='current'|'new';
export function navigateDocTabs(tabs:string[],activeDoc:string,target:string,mode:DocNavigationMode):{tabs:string[];activeDoc:string}{
 const unique=[...new Set(tabs.filter(Boolean))];
 if(unique.includes(target))return {tabs:unique,activeDoc:target};
 if(mode==='new'||!unique.includes(activeDoc))
  return {tabs:[...unique,target].slice(-MAX_OPEN_DOC_TABS),activeDoc:target};
 return {tabs:unique.map(key=>key===activeDoc?target:key),activeDoc:target};
}
/** Extracts intentional inline references written as [[visible text|python:topic-id]]. */
export function inlineDocLinks(body:string):DocLink[]{
 const links:DocLink[]=[];
 for(const match of body.matchAll(/\[\[([^|\]]+)\|(python|game):([^\]]+)\]\]/g))
  links.push({label:match[1],scope:match[2] as DocScope,id:match[3]});
 return links;
}
