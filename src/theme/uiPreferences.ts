/** Workbench accessibility/preferences are independent of savegame and theme presets. */
const SCALE_KEY='code-empire-ui-scale-v1';
export const UI_SCALES=[.85,1,1.15,1.3] as const;
export type UiScale=typeof UI_SCALES[number];
export function readUiScale():UiScale{
 try{
  const n=Number(localStorage.getItem(SCALE_KEY));
  return UI_SCALES.includes(n as UiScale)?n as UiScale:1;
 }catch{return 1;}
}
export function applyUiScale(scale:UiScale):void{
 document.documentElement.style.setProperty('--ce-ui-scale',String(scale));
}
export function saveUiScale(scale:UiScale):void{
 applyUiScale(scale);
 try{localStorage.setItem(SCALE_KEY,String(scale));}catch{/* Private-mode storage can be disabled. */}
}
export function initializeUiScale():void{applyUiScale(readUiScale());}
