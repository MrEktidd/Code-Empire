/** Safe, versioned appearance preferences, independent of civilization saves.
 * Only allowlisted CSS custom properties can be customized by players.
 * Defaults are read from theme.css, which remains the single source of truth.
 */
export const TOKEN_GROUPS = [
  {id:'palette',title:'Interface Colors',description:'Backgrounds, surfaces and readable text.'},
  {id:'borders',title:'Borders & Shapes',description:'Outline colors, thickness, and corner rounding.'},
  {id:'scrollbars',title:'Scrollbars',description:'Customize the track, thumb, hover state and width.'},
] as const;

type ColorToken = {id:string;label:string;group:string;kind:'color'};
type RangeToken = {id:string;label:string;group:string;kind:'range';min:number;max:number;step:number;unit:'px'};
export type ThemeTokenDefinition = ColorToken|RangeToken;
export const THEME_TOKENS = [
  {id:'--ce-color-background',label:'Background',group:'palette',kind:'color'},
  {id:'--ce-color-surface',label:'Panel surface',group:'palette',kind:'color'},
  {id:'--ce-color-surface-raised',label:'Window headers',group:'palette',kind:'color'},
  {id:'--ce-color-surface-muted',label:'Controls & tabs',group:'palette',kind:'color'},
  {id:'--ce-color-text',label:'Primary text',group:'palette',kind:'color'},
  {id:'--ce-color-text-muted',label:'Secondary text',group:'palette',kind:'color'},
  {id:'--ce-color-accent',label:'Accent',group:'palette',kind:'color'},
  {id:'--ce-color-accent-hover',label:'Accent highlight',group:'palette',kind:'color'},
  {id:'--ce-color-on-accent',label:'Text on accent',group:'palette',kind:'color'},
  {id:'--ce-color-border',label:'Borders',group:'borders',kind:'color'},
  {id:'--ce-color-border-soft',label:'Subtle borders',group:'borders',kind:'color'},
  {id:'--ce-border-size',label:'Border thickness',group:'borders',kind:'range',min:1,max:4,step:1,unit:'px'},
  {id:'--ce-control-radius',label:'Control rounding',group:'borders',kind:'range',min:0,max:20,step:1,unit:'px'},
  {id:'--ce-panel-radius',label:'Window rounding',group:'borders',kind:'range',min:0,max:28,step:1,unit:'px'},
  {id:'--ce-scrollbar-track',label:'Track',group:'scrollbars',kind:'color'},
  {id:'--ce-scrollbar-thumb',label:'Thumb',group:'scrollbars',kind:'color'},
  {id:'--ce-scrollbar-thumb-hover',label:'Hover thumb',group:'scrollbars',kind:'color'},
  {id:'--ce-scrollbar-thumb-active',label:'Pressed thumb',group:'scrollbars',kind:'color'},
  {id:'--ce-scrollbar-border',label:'Thumb border',group:'scrollbars',kind:'color'},
  {id:'--ce-scrollbar-size',label:'Thickness',group:'scrollbars',kind:'range',min:5,max:18,step:1,unit:'px'},
  {id:'--ce-scrollbar-radius',label:'Corner rounding',group:'scrollbars',kind:'range',min:0,max:12,step:1,unit:'px'},
] as const satisfies readonly ThemeTokenDefinition[];

export type ThemeToken=typeof THEME_TOKENS[number]['id'];
export type ThemeValues=Record<ThemeToken,string>;
const STORAGE_KEY='code-empire-ui-theme-v1';
const HEX=/^#[0-9a-fA-F]{6}$/;
let initialDefaults:ThemeValues|undefined;

export function isThemeValue(token:ThemeToken,value:unknown):value is string {
  const def=THEME_TOKENS.find(t=>t.id===token)!;
  if(typeof value!=='string')return false;
  if(def.kind==='color')return HEX.test(value);
  const parsed=Number(value.slice(0,-2));
  return value.endsWith('px')&&Number.isFinite(parsed)&&parsed>=def.min&&parsed<=def.max
    &&Math.abs((parsed-def.min)/def.step-Math.round((parsed-def.min)/def.step))<1e-8;
}
/** CSS is the source of defaults, rather than duplicating 21 color literals in TS. */
export function themeDefaults():ThemeValues {
  if(initialDefaults)return {...initialDefaults};
  const computed=getComputedStyle(document.documentElement);
  const result={} as ThemeValues;
  for(const entry of THEME_TOKENS){
    const value=computed.getPropertyValue(entry.id).trim();
    if(!isThemeValue(entry.id,value))throw Error('Invalid default theme token '+entry.id);
    result[entry.id]=value.toLowerCase();
  }
  initialDefaults=result;
  return {...result};
}
export function validateThemeOverrides(source:unknown):Partial<ThemeValues> {
  const valid:Partial<ThemeValues>={};
  if(!source||typeof source!=='object'||Array.isArray(source))return valid;
  const data=source as Record<string,unknown>;
  for(const def of THEME_TOKENS){
    const candidate=data[def.id];
    if(isThemeValue(def.id,candidate))valid[def.id]=candidate.toLowerCase();
  }
  return valid;
}
export function readSavedTheme():ThemeValues {
  const defaults=themeDefaults();
  try{
    const record:unknown=JSON.parse(localStorage.getItem(STORAGE_KEY)??'null');
    if(record&&typeof record==='object'&&!Array.isArray(record)){
      const obj=record as {version?:unknown;overrides?:unknown};
      if(obj.version===1)return {...defaults,...validateThemeOverrides(obj.overrides)};
    }
  }catch{/* Malformed JSON, blocked storage or unavailable storage: default safely. */}
  return defaults;
}
export function applyTheme(theme:ThemeValues):void {
  const root=document.documentElement.style;
  const defaults=themeDefaults();
  for(const def of THEME_TOKENS){
    const current=theme[def.id];
    if(current===defaults[def.id]||!isThemeValue(def.id,current))root.removeProperty(def.id);
    else root.setProperty(def.id,current);
  }
}
export function persistTheme(theme:ThemeValues):void{
  const defaults=themeDefaults();
  const overrides:Partial<ThemeValues>={};
  for(const def of THEME_TOKENS) {
    if(!isThemeValue(def.id,theme[def.id]))throw Error('Invalid theme value '+def.id);
    if(theme[def.id]!==defaults[def.id])overrides[def.id]=theme[def.id];
  }
  localStorage.setItem(STORAGE_KEY,JSON.stringify({version:1,overrides}));
}
export function initializeTheme():void {
  try{applyTheme(readSavedTheme());}catch{/* Appearance must never prevent app startup. */}
}
export type ThemePresetName='Classic'|'Amber Terminal'|'Ice Station'|'Crimson Protocol';
export const THEME_PRESETS:ThemePresetName[]=['Classic','Amber Terminal','Ice Station','Crimson Protocol'];
const PRESET_OVERRIDES:Record<ThemePresetName,Partial<ThemeValues>>={
  'Classic':{},
  'Amber Terminal':{
    '--ce-color-background':'#17140f','--ce-color-surface':'#251e17',
    '--ce-color-surface-raised':'#473829','--ce-color-surface-muted':'#32291c',
    '--ce-color-border':'#816545','--ce-color-border-soft':'#614b34',
    '--ce-color-text':'#f0e5ce','--ce-color-text-muted':'#c6af90',
    '--ce-color-accent':'#e2a74d','--ce-color-accent-hover':'#f8c775',
    '--ce-color-on-accent':'#261707','--ce-scrollbar-thumb':'#ab7c46',
    '--ce-scrollbar-thumb-hover':'#dfaa67','--ce-scrollbar-track':'#261e17'
  },
  'Ice Station':{
    '--ce-color-background':'#0a1726','--ce-color-surface':'#13283b',
    '--ce-color-surface-raised':'#24485d','--ce-color-surface-muted':'#193649',
    '--ce-color-border':'#4c8799','--ce-color-border-soft':'#28566a',
    '--ce-color-text':'#e0f5ff','--ce-color-text-muted':'#98c5d9',
    '--ce-color-accent':'#6bcef2','--ce-color-accent-hover':'#a8eaff',
    '--ce-color-on-accent':'#0a2535','--ce-scrollbar-thumb':'#519cb6',
    '--ce-scrollbar-thumb-hover':'#8cd5f0','--ce-scrollbar-track':'#102636'
  },
  'Crimson Protocol':{
    '--ce-color-background':'#1b1019','--ce-color-surface':'#281824',
    '--ce-color-surface-raised':'#533044','--ce-color-surface-muted':'#35202e',
    '--ce-color-border':'#835466','--ce-color-border-soft':'#563147',
    '--ce-color-text':'#f9dfe9','--ce-color-text-muted':'#caaaba',
    '--ce-color-accent':'#ed869f','--ce-color-accent-hover':'#ffb1c6',
    '--ce-color-on-accent':'#2c1321','--ce-scrollbar-thumb':'#a76581',
    '--ce-scrollbar-thumb-hover':'#e29bb7','--ce-scrollbar-track':'#2a1626'
  }
};
export function presetTheme(name:ThemePresetName):ThemeValues{
 return {...themeDefaults(),...PRESET_OVERRIDES[name]};
}
/** Export format can be shared but imports never execute CSS/JS. */
export function exportTheme(theme:ThemeValues):string{
 const safe=validateThemeOverrides(theme);
 return JSON.stringify({version:1,theme:safe},null,2);
}
export function importTheme(text:string):ThemeValues{
 if(text.length>12000)throw Error('Theme file is too large.');
 const data:unknown=JSON.parse(text);
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Theme must be an object.');
 const obj=data as Record<string,unknown>;
 if(obj.version!==1||!obj.theme||typeof obj.theme!=='object'||Array.isArray(obj.theme))
  throw Error('Unsupported theme format. Expected version 1.');
 const fields=Object.keys(obj.theme);
 if(fields.length===0||fields.some(k=>!THEME_TOKENS.some(def=>def.id===k)))
  throw Error('Theme contains unknown or missing properties.');
 const safe=validateThemeOverrides(obj.theme);
 if(Object.keys(safe).length!==fields.length)throw Error('Theme contains invalid colors or dimensions.');
 return {...themeDefaults(),...safe};
}
