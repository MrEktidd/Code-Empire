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
