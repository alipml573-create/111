import { useEffect, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color, TextStyle } from '@tiptap/extension-text-style';
import Moveable from 'react-moveable';
import Selecto from 'react-selecto';
import { X, Undo2, Redo2, Download, Upload, ImagePlus, Bold, Italic, Palette, RemoveFormatting } from 'lucide-react';
import { BURGUNDY, textToRichDocument } from './components';
import { useEdits, type RichTextMark, type RichTextNode } from './store';

function sanitizeRichText(value:unknown):RichTextNode|null{
 let textLength=0;
 const visit=(node:unknown,depth=0):RichTextNode|null=>{
  if(depth>12||!node||typeof node!=='object'||Array.isArray(node))return null;
  const record=node as Record<string,unknown>;
  if(!['doc','paragraph','text','hardBreak'].includes(String(record.type)))return null;
  const type=record.type as RichTextNode['type'];
  if(type==='text'){
   if(typeof record.text!=='string')return null;
   textLength+=record.text.length;if(textLength>100000)return null;
   const marks:RichTextMark[]=[];
   if(Array.isArray(record.marks))for(const mark of record.marks){
    if(!mark||typeof mark!=='object'||Array.isArray(mark))continue;
    const item=mark as Record<string,unknown>;
    if(item.type==='bold'||item.type==='italic')marks.push({type:item.type});
    else if(item.type==='textStyle'){
     const attrs=item.attrs&&typeof item.attrs==='object'&&!Array.isArray(item.attrs)?item.attrs as Record<string,unknown>:{};
     if(typeof attrs.color==='string'&&attrs.color.toLowerCase()===BURGUNDY)marks.push({type:'textStyle',attrs:{color:BURGUNDY}});
    }
   }
   return {type,text:record.text,marks:marks?.length?marks:undefined};
  }
  if(type==='hardBreak')return {type};
  if(record.content!==undefined&&!Array.isArray(record.content))return null;
  const content=(record.content as unknown[]|undefined)?.map(child=>visit(child,depth+1)).filter((child):child is RichTextNode=>Boolean(child));
  return {type,content:content??[]};
 };
 const result=visit(value);
 return result?.type==='doc'?result:null;
}

function TextDialog({value,richText,id,onClose}:{value:string;richText?:RichTextNode;id:string;onClose:()=>void}){
 const update=useEdits(s=>s.update);
 const editor=useEditor({extensions:[StarterKit,TextStyle,Color],content:richText??textToRichDocument(value),editorProps:{attributes:{'aria-label':'编辑选中的文字'}}});
 const save=()=>{const doc=sanitizeRichText(editor?.getJSON());update(id,{text:editor?.getText({blockSeparator:'\n'})??value,richText:doc??textToRichDocument(value)});onClose();};
 return <Dialog.Root open onOpenChange={open=>{if(!open)onClose();}}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="text-editor-dialog dialog-content" aria-describedby="text-editor-description"><Dialog.Title>修改文字</Dialog.Title><Dialog.Description id="text-editor-description">可以选中局部文字设为酒红色、加粗或斜体；换行会同步到演示页面。</Dialog.Description><Dialog.Close className="dialog-close" aria-label="关闭文字编辑"><X/></Dialog.Close>
 <div className="text-format-toolbar" role="toolbar" aria-label="局部文字格式">
  <button type="button" className={editor?.isActive('bold')?'is-active':''} aria-label="加粗" aria-pressed={editor?.isActive('bold')??false} onClick={()=>editor?.chain().focus().toggleBold().run()}><Bold size={17}/><span>加粗</span></button>
  <button type="button" className={editor?.isActive('italic')?'is-active':''} aria-label="斜体" aria-pressed={editor?.isActive('italic')??false} onClick={()=>editor?.chain().focus().toggleItalic().run()}><Italic size={17}/><span>斜体</span></button>
  <button type="button" className={editor?.isActive('textStyle',{color:BURGUNDY})?'is-active burgundy-button':''} aria-label="将选中文字设为酒红色" aria-pressed={editor?.isActive('textStyle',{color:BURGUNDY})??false} onClick={()=>editor?.chain().focus().setColor(BURGUNDY).run()}><Palette size={17}/><span>酒红色</span></button>
  <button type="button" aria-label="恢复选中文字的默认颜色" onClick={()=>editor?.chain().focus().unsetColor().run()}><RemoveFormatting size={17}/><span>默认色</span></button>
 </div>
 <EditorContent editor={editor}/><div className="text-editor-actions"><button onClick={onClose}>取消</button><button className="primary-button" onClick={save}>保存文字</button></div></Dialog.Content></Dialog.Portal></Dialog.Root>;
}

export default function Editor({selected,onSelect,textRequest,onTextClose,scale,active}:{selected:string|null;onSelect:(id:string|null)=>void;textRequest:{id:string;text:string;richText?:RichTextNode}|null;onTextClose:()=>void;scale:number;active:number}){
 const changes=useEdits(s=>s.changes);const update=useEdits(s=>s.update);const saveState=useEdits(s=>s.saveState);const undo=useEdits(s=>s.undo);const redo=useEdits(s=>s.redo);
 const [target,setTarget]=useState<HTMLElement|null>(null);const [error,setError]=useState('');const upload=useRef<HTMLInputElement>(null);const backup=useRef<HTMLInputElement>(null);const moveable=useRef<Moveable>(null);
 useEffect(()=>{const element=[...document.querySelectorAll<HTMLElement>('.slides section.present [data-edit-id]')].find(el=>el.dataset.editId===selected)??null;setTarget(element);document.querySelectorAll('.edit-selected').forEach(e=>e.classList.remove('edit-selected'));element?.classList.add('edit-selected');},[selected,active]);
 useEffect(()=>{moveable.current?.updateRect();},[changes]);
 const image=target?.dataset.editType==='image';
 const exportBackup=()=>{const blob=new Blob([JSON.stringify({version:1,changes},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='滕梓昊-答辩编辑备份.json';a.click();URL.revokeObjectURL(url);};
 return <>
 <div className="editor-toolbar" aria-label="本地编辑工具栏"><span className="editor-label">编辑模式</span><span className="editor-instructions">点击选择 · 双击文字修改 · 拖动微调布局</span><div className="editor-tools"><button disabled={!undo.length} aria-label="撤销" onClick={()=>useEdits.getState().undoChange()}><Undo2 size={18}/></button><button disabled={!redo.length} aria-label="重做" onClick={()=>useEdits.getState().redoChange()}><Redo2 size={18}/></button><button disabled={!image} onClick={()=>upload.current?.click()}><ImagePlus size={17}/>替换图片</button><button onClick={exportBackup}><Download size={17}/>导出备份</button><button onClick={()=>backup.current?.click()}><Upload size={17}/>导入备份</button><span className={`save-state ${saveState}`}>{saveState==='saved'?'已保存到本机':saveState==='saving'?'保存中…':'保存失败，请导出备份'}</span></div></div>
 {error?<div className="editor-error" role="alert">{error}<button onClick={()=>setError('')} aria-label="关闭错误提示"><X size={16}/></button></div>:null}
 <input ref={upload} type="file" accept="image/*" hidden onChange={async e=>{const file=e.target.files?.[0];e.target.value='';if(!file||!selected)return;if(file.size>20*1024*1024){setError('请使用20MB以内的图片。');return;}try{const bitmap=await createImageBitmap(file);bitmap.close();const reader=new FileReader();reader.onload=()=>update(selected,{image:String(reader.result)});reader.readAsDataURL(file);}catch{setError('图片无法读取，请使用PNG、JPEG或WebP图片。');}}}/>
 <input ref={backup} type="file" accept="application/json,.json" hidden onChange={async e=>{const file=e.target.files?.[0];e.target.value='';if(!file)return;try{if(file.size>50*1024*1024)throw new Error();const data=JSON.parse(await file.text());if(data.version!==1||!data.changes||typeof data.changes!=='object'||Array.isArray(data.changes))throw new Error();const allowed=new Set(['text','richText','image','x','y','width','height']);for(const [id,item] of Object.entries(data.changes)){if(id.length>300||!item||typeof item!=='object'||Array.isArray(item))throw new Error();for(const [k,v] of Object.entries(item)){if(!allowed.has(k))throw new Error();if(['x','y','width','height'].includes(k)&& (typeof v!=='number'||!Number.isFinite(v)||Math.abs(v)>5000))throw new Error();if(k==='text'&&typeof v!=='string')throw new Error();if(k==='richText'&&!sanitizeRichText(v))throw new Error();if(k==='image'&&(typeof v!=='string'||!/^data:image\/(png|jpeg|webp|gif);base64,/.test(v)))throw new Error();}}useEdits.getState().replace(data.changes);onSelect(null);}catch{setError('这不是有效的答辩编辑备份，请选择本网页导出的JSON文件。');}}}/>
 <Selecto container={document.body} selectableTargets={['.slides section.present [data-edit-id]']} selectByClick={true} selectFromInside={false} hitRate={30} onSelectEnd={e=>{const el=e.selected.at(-1) as HTMLElement|undefined;if(el?.dataset.editId)onSelect(el.dataset.editId);}}/>
 <Moveable ref={moveable} target={target} draggable resizable={image} keepRatio={true} zoom={1/Math.max(scale,.1)} origin={false} edge={false} throttleDrag={0} onDrag={e=>{e.target.style.transform=e.transform;}} onDragEnd={e=>{if(e.lastEvent&&selected)update(selected,{x:e.lastEvent.translate[0],y:e.lastEvent.translate[1]});}} onResize={e=>{e.target.style.width=`${e.width}px`;e.target.style.height=`${e.height}px`;e.target.style.transform=e.drag.transform;}} onResizeEnd={e=>{if(e.lastEvent&&selected){const last=e.lastEvent;update(selected,{width:last.width,height:last.height,x:last.drag.translate[0],y:last.drag.translate[1]});}}}/>
 {textRequest?<TextDialog id={textRequest.id} value={textRequest.text} richText={textRequest.richText} onClose={onTextClose}/>:null}
 </>;
}
