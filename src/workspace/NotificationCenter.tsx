import type {ReactNode} from 'react';
import './workbench.css';
export type WorkbenchNotice={
 id:number;kind:'success'|'warning'|'error';title:string;detail:string;
 actionLabel?:string;onAction?:()=>void;
};
export default function NotificationCenter({notice,onDismiss}:{
 notice:WorkbenchNotice|null;onDismiss:()=>void;
}):ReactNode{
 if(!notice)return null;
 return <div className={'workbench-notice workbench-notice-'+notice.kind} role="status" aria-live="polite">
  <div className="workbench-notice-heading">
   <strong>{notice.kind==='success'?'✓ ':notice.kind==='warning'?'⚠ ':'✕ '}{notice.title}</strong>
   <button onClick={onDismiss} aria-label="Dismiss notification">×</button>
  </div>
  <p>{notice.detail}</p>
  {notice.onAction&&<button className="workbench-notice-action" onClick={()=>{notice.onAction?.();onDismiss();}}>
    {notice.actionLabel??'View details'} ↗</button>}
 </div>;
}
