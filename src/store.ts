import { create } from 'zustand';
import Dexie, { type Table } from 'dexie';

export interface RichTextMark { type:'bold'|'italic'|'textStyle'; attrs?:{color?:string} }
export interface RichTextNode { type:'doc'|'paragraph'|'text'|'hardBreak'; text?:string; marks?:RichTextMark[]; content?:RichTextNode[] }
export interface Change { text?:string; richText?:RichTextNode; image?:string; x?:number; y?:number; width?:number; height?:number }
class DefenseDB extends Dexie {
  preferences!: Table<{id:string; changes:Record<string,Change>}>;
  constructor(){ super('scholarship-defense-v1'); this.version(1).stores({preferences:'id'}); }
}
const db = new DefenseDB();
interface State {
 changes:Record<string,Change>; undo:Record<string,Change>[]; redo:Record<string,Change>[];
 ready:boolean; saveState:'saved'|'saving'|'error';
 update:(id:string,change:Change)=>void; undoChange:()=>void; redoChange:()=>void;
 hydrate:()=>Promise<void>; replace:(changes:Record<string,Change>)=>void;
}
let saveSequence = Promise.resolve();
function persist(changes:Record<string,Change>){
  useEdits.setState({saveState:'saving'});
  saveSequence = saveSequence.catch(()=>{}).then(async()=>{
    try { await db.preferences.put({id:'deck',changes}); useEdits.setState({saveState:'saved'}); }
    catch { useEdits.setState({saveState:'error'}); }
  });
}
export const useEdits = create<State>((set,get)=>({
 changes:{},undo:[],redo:[],ready:false,saveState:'saved',
 update(id,change){ const s=get(); const changes={...s.changes,[id]:{...s.changes[id],...change}}; set({changes,undo:[...s.undo.slice(-49),s.changes],redo:[]}); persist(changes); },
 undoChange(){const s=get(); if(!s.undo.length)return;const changes=s.undo[s.undo.length-1];set({changes,undo:s.undo.slice(0,-1),redo:[...s.redo,s.changes]});persist(changes);},
 redoChange(){const s=get();if(!s.redo.length)return;const changes=s.redo[s.redo.length-1];set({changes,redo:s.redo.slice(0,-1),undo:[...s.undo,s.changes]});persist(changes);},
 async hydrate(){try{const saved=await db.preferences.get('deck');set({changes:saved?.changes??{},ready:true});}catch{set({ready:true,saveState:'error'});}},
 replace(changes){const s=get();set({changes,undo:[...s.undo,s.changes],redo:[]});persist(changes);},
}));
