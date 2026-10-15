import {useEffect,useRef,useState} from 'react';
import {EditorState} from '@codemirror/state';
import {EditorView,keymap,lineNumbers,highlightActiveLine,drawSelection} from '@codemirror/view';
import {defaultKeymap,history,historyKeymap,indentWithTab} from '@codemirror/commands';
import {indentUnit,syntaxHighlighting,defaultHighlightStyle,bracketMatching,indentOnInput} from '@codemirror/language';
import {python} from '@codemirror/lang-python';
import {autocompletion,closeBrackets,completionKeymap} from '@codemirror/autocomplete';
import {searchKeymap,highlightSelectionMatches} from '@codemirror/search';
import {lintGutter,setDiagnostics} from '@codemirror/lint';
export type Suggestion={label:string;detail?:string;info?:string;type?:string};
type Props={id:string;source:string;error?:string|null;completions?:Suggestion[];onChange:(source:string)=>void;onRun?:()=>void};
const editorStateCache=new Map<string,EditorState>();
const FONT_STORAGE='code-empire-editor-font-size';
function fontSize():number{try{return Math.max(11,Math.min(22,Number(localStorage.getItem(FONT_STORAGE))||13));}catch{return 13;}}
const BUILTINS=['print','len','range','int','float','str','list','dict','set','tuple','sum','min','max',
 'sorted','enumerate','zip','any','all','isinstance','type','abs','round'].map(label=>({label,type:'function'}));
export default function PythonEditor({id,source,error,completions=[],onChange,onRun}:Props){
 const host=useRef<HTMLDivElement>(null),view=useRef<EditorView|null>(null);
 const change=useRef(onChange),run=useRef(onRun);
 const [size,setSize]=useState(fontSize);
 change.current=onChange;run.current=onRun;
 useEffect(()=>{
  if(!host.current)return;
  const saved=editorStateCache.get(id);
  const options=[...completions,...BUILTINS];
  const extensions=[
   EditorState.tabSize.of(4),indentUnit.of('    '),
   lineNumbers(),highlightActiveLine(),drawSelection(),history(),indentOnInput(),bracketMatching(),
   closeBrackets(),highlightSelectionMatches(),python(),syntaxHighlighting(defaultHighlightStyle),lintGutter(),
   keymap.of([{key:'Mod-Enter',run:()=>{run.current?.();return true;}},...defaultKeymap,...historyKeymap,...completionKeymap,...searchKeymap,indentWithTab]),
   autocompletion({override:[ctx=>{
    const word=ctx.matchBefore(/[\w.]*/);
    if(!word||(!ctx.explicit&&word.from===word.to))return null;
    return {from:word.from,options};
   }]}),
   EditorView.updateListener.of(update=>{if(update.docChanged)change.current(update.state.doc.toString());}),
   EditorView.theme({
    '&':{height:'100%',backgroundColor:'#0b1521',color:'#c9e0d5'},
    '.cm-scroller':{fontFamily:'"Cascadia Code",Consolas,monospace',overflow:'auto'},
    '.cm-content':{padding:'14px 0'},'.cm-gutters':{backgroundColor:'#0c1824',color:'#6e8a94',borderRight:'1px solid #2b4050'},
    '.cm-activeLine':{backgroundColor:'#1d354030'},'&.cm-focused':{outline:'none'},
    '.cm-cursor':{borderLeftColor:'#a6f0bd'},'.cm-selectionBackground':{backgroundColor:'#376e7259'}
   })
  ];
  const state=saved&&saved.doc.toString()===source?saved:EditorState.create({doc:source,extensions});
  const editor=new EditorView({state,parent:host.current});view.current=editor;
  return()=>{editorStateCache.set(id,editor.state);view.current=null;editor.destroy();};
 // Preserve the editor between tab switches. Source updates are applied below.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[id]);
 useEffect(()=>{
  const v=view.current;
  if(v&&v.state.doc.toString()!==source)v.dispatch({changes:{from:0,to:v.state.doc.length,insert:source}});
 },[source]);
 useEffect(()=>{
  const v=view.current;if(!v)return;
  const m=error?.match(/(?:File "[^"]+", )?line\s+(\d+)/i);
  const line=m?Number(m[1]):0;
  if(!line||line>v.state.doc.lines){v.dispatch(setDiagnostics(v.state,[]));return;}
  const loc=v.state.doc.line(line);
  v.dispatch(setDiagnostics(v.state,[{from:loc.from,to:loc.to,severity:'error',message:error??'Python error'}]));
 },[error,source]);
 useEffect(()=>{if(view.current)view.current.dom.style.fontSize=size+'px';},[size]);
 const adjust=(delta:number)=>{const value=Math.max(11,Math.min(22,size+delta));setSize(value);try{localStorage.setItem(FONT_STORAGE,String(value));}catch{}};
 return <div className="platform-editor">
  <div className="platform-editor-toolbar"><span>PYTHON · TAB = 4 SPACES · CTRL/⌘+ENTER RUN</span>
   <div><button title="Reduce editor font size" onClick={()=>adjust(-1)}>A−</button><button title="Increase editor font size" onClick={()=>adjust(1)}>A＋</button></div>
  </div>
  <div className="platform-editor-code" ref={host}/>
 </div>;
}
