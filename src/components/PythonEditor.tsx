import {useEffect,useRef} from 'react';
import {EditorState} from '@codemirror/state';
import {EditorView,keymap,lineNumbers,highlightActiveLine,drawSelection} from '@codemirror/view';
import {defaultKeymap,history,historyKeymap,indentWithTab} from '@codemirror/commands';
import {syntaxHighlighting,defaultHighlightStyle,bracketMatching,indentOnInput} from '@codemirror/language';
import {python} from '@codemirror/lang-python';
import {autocompletion,closeBrackets,completionKeymap} from '@codemirror/autocomplete';
import {searchKeymap,highlightSelectionMatches} from '@codemirror/search';
import {API,contextApi} from '../docs/api';
import type {Controller} from '../engine/types';
export default function PythonEditor({controller,onChange}:{controller:Controller;onChange:(source:string)=>void}){
 const host=useRef<HTMLDivElement>(null),view=useRef<EditorView|null>(null);
 const change=useRef(onChange);change.current=onChange;
 useEffect(()=>{
  if(!host.current)return;
  const names=contextApi(controller.ownerType).map(a=>({label:a.name,type:'method',detail:a.signature,info:a.description}));
  const state=EditorState.create({doc:controller.source,extensions:[
   lineNumbers(),highlightActiveLine(),drawSelection(),history(),indentOnInput(),bracketMatching(),
   closeBrackets(),highlightSelectionMatches(),python(),syntaxHighlighting(defaultHighlightStyle),
   keymap.of([...defaultKeymap,...historyKeymap,...completionKeymap,...searchKeymap,indentWithTab]),
   autocompletion({override:[ctx=>{
    const word=ctx.matchBefore(/[\w.]*/);
    if(!word||(!ctx.explicit&&word.from===word.to))return null;
    return {from:word.from,options:[...names,...API.filter(a=>a.name==='memory').map(a=>({label:a.name,type:'variable',detail:a.signature,info:a.description}))]};
   }]}),
   EditorView.updateListener.of(update=>{if(update.docChanged)change.current(update.state.doc.toString());}),
   EditorView.theme({
    '&':{height:'100%',backgroundColor:'#0b1521',color:'#c9e0d5',fontSize:'13px'},
    '.cm-scroller':{fontFamily:'"Cascadia Code",Consolas,monospace',overflow:'auto'},
    '.cm-content':{padding:'14px 0'},'.cm-gutters':{backgroundColor:'#0c1824',color:'#6e8a94',borderRight:'1px solid #2b4050'},
    '.cm-activeLine':{backgroundColor:'#1d354030'},'&.cm-focused':{outline:'none'},
    '.cm-cursor':{borderLeftColor:'#a6f0bd'},'.cm-selectionBackground':{backgroundColor:'#376e7259'}
   })
  ]});
  const editor=new EditorView({state,parent:host.current});view.current=editor;
  return()=>{view.current=null;editor.destroy();};
 // Recreate editor only when switching controllers, not on each keystroke.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[controller.id]);
 useEffect(()=>{
  const v=view.current;
  if(v&&v.state.doc.toString()!==controller.source)
   v.dispatch({changes:{from:0,to:v.state.doc.length,insert:controller.source}});
 },[controller.source]);
 return <div className="code-mirror" ref={host}/>;
}
