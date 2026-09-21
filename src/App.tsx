import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Reveal, {type RevealApi} from 'reveal.js';
import Notes from 'reveal.js/plugin/notes';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, Maximize2, Minimize2, Grid2X2, Keyboard, Play, Pencil, X, Mic } from 'lucide-react';
import SlideContent from './Slides';
import { DeckContext, Txt } from './components';
import { chapters, notes } from './content';
import { useEdits } from './store';
import type { RichTextNode } from './store';
import { slideScenes, slideBackgroundStyles } from './presentationTheme';
const Editor=lazy(()=>import('./Editor'));
const ivoryPages=new Set([1,3,4,6,8,10,11,13]);
const chapterPages=new Set([0,2,5,9,12,14]);
const sharedBrandAsset=(file:string)=>new URL(`assets/brand-logos-v1/${file}`,new URL(import.meta.env.BASE_URL,document.baseURI)).href;

export default function App(){
 const root=useRef<HTMLDivElement>(null);const deck=useRef<RevealApi|null>(null);const [active,setActive]=useState(0);const [overview,setOverview]=useState(false);const [help,setHelp]=useState(false);const [edit,setEdit]=useState(false);const [present,setPresent]=useState(new URLSearchParams(location.search).get('present')==='1');const [full,setFull]=useState(false);const [selected,setSelected]=useState<string|null>(null);const [textRequest,setTextRequest]=useState<{id:string;text:string;richText?:RichTextNode}|null>(null);const [scale,setScale]=useState(1);const [error,setError]=useState('');const [mobile,setMobile]=useState(matchMedia('(max-width: 760px)').matches);const [ready,setReady]=useState(false);
 const [notesOpen,setNotesOpen]=useState(false);
 const state=useRef({edit,help,present,textRequest,overview});state.current={edit,help,present,textRequest,overview};const hydrated=useEdits(s=>s.ready);
 const setPresentation=useCallback((value:boolean)=>{setPresent(value);if(value)setEdit(false);const url=new URL(location.href);if(value)url.searchParams.set('present','1');else url.searchParams.delete('present');history.replaceState(null,'',url);},[]);
 const toggleFullscreen=useCallback(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setError('当前浏览器未允许全屏。可使用浏览器的全屏功能继续演示。');}},[]);
 useEffect(()=>{void useEdits.getState().hydrate();let layoutFrame=0;const listener=()=>{setFull(Boolean(document.fullscreenElement));cancelAnimationFrame(layoutFrame);layoutFrame=requestAnimationFrame(()=>deck.current?.layout());};document.addEventListener('fullscreenchange',listener);const media=matchMedia('(max-width: 760px)');const resize=()=>setMobile(media.matches);media.addEventListener('change',resize);return()=>{document.removeEventListener('fullscreenchange',listener);media.removeEventListener('change',resize);cancelAnimationFrame(layoutFrame);};},[]);
 useEffect(()=>{document.body.classList.toggle('presentation-mode',present);document.body.classList.toggle('editing-mode',edit);document.body.classList.toggle('mobile-mode',mobile);return()=>{document.body.classList.remove('presentation-mode','editing-mode','mobile-mode');};},[present,edit,mobile]);
 useEffect(()=>{
  if(!hydrated||mobile||!root.current)return;
  let disposed=false;let initialized=false;
  const r=new Reveal(root.current,{
   width:1600,height:900,margin:0,minScale:.1,maxScale:3,center:false,controls:false,progress:false,
   hash:true,hashOneBasedIndex:true,history:false,transition:matchMedia('(prefers-reduced-motion: reduce)').matches?'none':'fade',transitionSpeed:'default',
   navigationMode:'linear',viewDistance:1,mobileViewDistance:1,fragments:false,touch:true,mouseWheel:false,scrollActivationWidth:0,
   plugins:[Notes],help:false,hideInactiveCursor:false,postMessage:true,postMessageEvents:false,autoPlayMedia:false,
   keyboardCondition:()=>!state.current.edit&&!state.current.help&&!state.current.textRequest&&!document.querySelector('.dialog-overlay'),
   keyboard:{38:()=>r.prev(),40:()=>r.next(),69:()=>{setPresentation(false);setEdit(e=>!e);},72:()=>setHelp(true),83:()=>setNotesOpen(true),70:()=>void toggleFullscreen(),27:()=>{if(state.current.present){setPresentation(false);if(document.fullscreenElement)void document.exitFullscreen();}else r.toggleOverview();}},
  });
  deck.current=r;
  const onChange=()=>{setActive(r.getIndices().h);setSelected(null);setScale(r.getScale());};
  r.on('slidechanged',onChange);r.on('overviewshown',()=>setOverview(true));r.on('overviewhidden',()=>setOverview(false));r.on('resize',()=>setScale(r.getScale()));
  void r.initialize().then(()=>{initialized=true;if(disposed){r.destroy();return;}setReady(true);onChange();}).catch(()=>{if(!disposed)setError('演示初始化失败，请刷新页面重试。');});
  return()=>{disposed=true;setReady(false);if(initialized)r.destroy();if(deck.current===r)deck.current=null;};
 },[hydrated,mobile,setPresentation,toggleFullscreen]);
 useEffect(()=>{if(!ready)return;deck.current?.configure({hideInactiveCursor:present,hideCursorTime:1800});},[present,ready]);
 useEffect(()=>{if(ready)deck.current?.sync();},[active,overview,ready]);
 useEffect(()=>{
  let last=0;let delta=0;let deltaTimer:ReturnType<typeof setTimeout>;
  const wheel=(e:WheelEvent)=>{if(mobile||state.current.edit||state.current.help||state.current.overview||document.querySelector('.dialog-overlay')||(e.target as HTMLElement).closest('.work-rail,.certificate-carousel')||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;e.preventDefault();delta+=e.deltaY;clearTimeout(deltaTimer);deltaTimer=setTimeout(()=>delta=0,100);if(Math.abs(delta)>70&&performance.now()-last>850){if(delta>0)deck.current?.next();else deck.current?.prev();last=performance.now();delta=0;}};
  const key=(e:KeyboardEvent)=>{if(state.current.edit&&!state.current.textRequest&&!document.querySelector('.dialog-overlay')){if(e.key==='Escape'||e.key.toLowerCase()==='e'){e.preventDefault();setEdit(false);setSelected(null);}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();if(e.shiftKey)useEdits.getState().redoChange();else useEdits.getState().undoChange();}}};
  window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('keydown',key);return()=>{window.removeEventListener('wheel',wheel);window.removeEventListener('keydown',key);clearTimeout(deltaTimer);};
 },[mobile]);
 const go=(i:number)=>{if(mobile)document.getElementById(`page-${i+1}`)?.scrollIntoView({behavior:'smooth'});else{deck.current?.slide(i);if(overview)deck.current?.toggleOverview(false);}};
 const toggleOverview=()=>{if(overview)deck.current?.toggleOverview(false);else{setOverview(true);requestAnimationFrame(()=>deck.current?.toggleOverview(true));}};
 const openNotes=()=>{try{const plugin=deck.current?.getPlugin('notes') as {open:()=>void}|undefined;plugin?.open();}catch{setError('演讲者视图未能打开，请允许本网页弹窗后重试。');}};
 useEffect(()=>{if(!mobile)return;const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);if(visible[0])setActive(Number(visible[0].target.id.replace('page-',''))-1);},{rootMargin:'-10% 0px -40% 0px',threshold:[0,.1,.3,.5]});document.querySelectorAll('.slides>section').forEach(e=>observer.observe(e));const initial=Number(location.hash.match(/page-(\d+)/)?.[1]??1);const frame=requestAnimationFrame(()=>document.getElementById(`page-${Math.min(15,Math.max(1,initial))}`)?.scrollIntoView());return()=>{observer.disconnect();cancelAnimationFrame(frame);};},[mobile]);
 const light=!mobile;
 return <DeckContext.Provider value={{edit,active,select:setSelected,openText:(id,text,richText)=>setTextRequest({id,text,richText})}}>
 <main className={`defense-app ambient-theme ${light?'light-chrome':''}`} aria-label="滕梓昊国家奖学金答辩演示">
  <div className="reveal" key={mobile?'reader':'presentation'} ref={root}><div className="slides">{chapters.map(([chapter,label,title],i)=><section id={`page-${i+1}`} key={label} className={`slide slide-${i+1} ambient-slide scene-${slideScenes[i]} ${ivoryPages.has(i)?'ivory-slide':''} ${chapterPages.has(i)?'chapter-slide':''}`} style={slideBackgroundStyles[i]} data-background-color="#EAF4FF" aria-label={`第${i+1}页：${label}`}>
   <div className="slide-meta"><span className="meta-symbol">▰</span><span><Txt id={`meta-${i+1}-identity`}>滕梓昊</Txt> <i>/</i> <Txt id={`meta-${i+1}-deck`}>国家奖学金答辩</Txt></span><span><Txt id={`meta-${i+1}-chapter`}>{chapter.toUpperCase()}</Txt> <i>/</i> <Txt id={`meta-${i+1}-number`}>{String(i+1).padStart(2,'0')}</Txt></span><div className="slide-brand-logos" role="img" aria-label="上海政法学院与上海纪录片学院标识"><img src={sharedBrandAsset('shupl-logo.png')} alt=""/><span aria-hidden="true"/><img src={sharedBrandAsset('documentary-academy-logo.png')} alt=""/></div></div>
   <div className={`slide-content ${i===0||i===14?'cinematic-content':''}`}>{mobile||overview||Math.abs(active-i)<=1||i===7||i===10?<SlideContent index={i}/>:<div className="slide-placeholder"><h2>{title}</h2></div>}</div>
   <aside className="notes">{notes[i]}</aside>
  </section>)}</div></div>
  {!mobile?<><div className="global-top"><span className="global-chapter">{chapters[active][0]}</span><span className="global-count"><strong>{String(active+1).padStart(2,'0')}</strong><i>/</i>15</span></div><nav className="vertical-navigation" aria-label="答辩章节导航">{chapters.map(([,label],i)=><button key={label} className={i===active?'active':''} aria-label={`第${i+1}页：${label}`} aria-current={i===active?'page':undefined} title={label} onClick={()=>go(i)}><span>{String(i+1).padStart(2,'0')}</span><i/></button>)}</nav></>:null}
  <footer className="presentation-footer"><div className="footer-left"><span className="footer-kicker">A GROWTH DOCUMENTARY</span><span className="footer-separator"/><button aria-label="上一页" disabled={active===0} onClick={()=>mobile?go(active-1):deck.current?.prev()}><ArrowLeft size={17}/></button><span className="footer-current">{chapters[active][1]}</span><button aria-label="下一页" disabled={active===14} onClick={()=>mobile?go(active+1):deck.current?.next()}><ArrowRight size={17}/></button></div><div className="footer-tools">
   {!mobile?<><button className={present?'tool-active':''} onClick={()=>setPresentation(!present)} title="演示模式" aria-label={present?'退出演示模式':'进入演示模式'}><Play size={16}/><span>{present?'退出演示':'演示模式'}</span></button><button className={edit?'tool-active':''} title="编辑模式 E" aria-label="切换本地编辑模式" onClick={()=>{setEdit(!edit);setPresentation(false);setSelected(null);}}><Pencil size={16}/></button><button title="演讲备注 S" aria-label="打开演讲者备注" onClick={()=>setNotesOpen(true)}><Mic size={17}/></button><button title="章节总览 O" aria-label="切换章节总览" onClick={toggleOverview}><Grid2X2 size={17}/></button></>:null}
   <button title="键盘帮助 H" aria-label="打开使用帮助" onClick={()=>setHelp(true)}><Keyboard size={18}/></button>{!mobile?<button title="全屏 F" aria-label={full?'退出全屏':'进入全屏'} onClick={()=>void toggleFullscreen()}>{full?<Minimize2 size={17}/>:<Maximize2 size={17}/>}</button>:null}
  </div></footer><div className="progress-track" aria-hidden="true"><div style={{width:`${(active+1)/15*100}%`}}/></div>
 </main>
 <Dialog.Root open={help} onOpenChange={setHelp}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="help-dialog dialog-content" aria-describedby="help-description"><Dialog.Title>让答辩顺畅进行</Dialog.Title><Dialog.Description id="help-description">15个章节，一段完整的成长纪录。桌面横屏展示效果最佳。</Dialog.Description><Dialog.Close className="dialog-close" aria-label="关闭帮助"><X/></Dialog.Close><dl className="keyboard-map"><div><dt>↑ / ← / PageUp</dt><dd>上一页</dd></div><div><dt>↓ / → / Space / PageDown</dt><dd>下一页</dd></div><div><dt>F</dt><dd>进入或退出全屏</dd></div><div><dt>O / Esc</dt><dd>章节总览（非演示模式）</dd></div><div><dt>S</dt><dd>当前页讲稿 / 演讲者视图入口</dd></div><div><dt>E</dt><dd>本地编辑模式</dd></div><div><dt>H</dt><dd>打开帮助</dd></div><div><dt>Esc</dt><dd>退出演示模式 / 关闭弹窗</dd></div></dl><p>证书轮播：点击后使用 ← → 控制，↑ ↓ 和 PageUp / PageDown 仍可翻页。滚轮翻页有节流，避免触控板连续跳页。</p><p>编辑：点击选择，双击文字后可修改内容，并可将选中的局部文字设为酒红色、加粗或斜体；图片可等比例调整。修改保存在当前浏览器本机，请导出备份后换设备。</p><p>现场建议：先打开各页检查素材，进入全屏，再打开演示模式。演讲者视图需要允许浏览器弹窗；作品集链接需联网。</p></Dialog.Content></Dialog.Portal></Dialog.Root>
 <Dialog.Root open={notesOpen} onOpenChange={setNotesOpen}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="help-dialog notes-dialog dialog-content" aria-describedby="notes-description"><Dialog.Title>{String(active+1).padStart(2,'0')} / {chapters[active][1]}</Dialog.Title><Dialog.Description id="notes-description">当前页演讲备注。此面板会显示在投影画面中，请在正式讲述前关闭。</Dialog.Description><Dialog.Close className="dialog-close" aria-label="关闭演讲备注"><X/></Dialog.Close><p className="speaker-script">{notes[active]}</p><button className="primary-button" onClick={openNotes}>打开独立演讲者视图</button><p>独立视图包含计时与下一页预览，适合双屏。请使用普通浏览器并允许弹窗；内嵌预览可能无法打开。</p></Dialog.Content></Dialog.Portal></Dialog.Root>
 {edit&&!mobile?<Suspense fallback={<div className="editor-toolbar">正在打开编辑工具…</div>}><Editor selected={selected} onSelect={setSelected} textRequest={textRequest} onTextClose={()=>setTextRequest(null)} scale={scale} active={active}/></Suspense>:null}
 {error?<div className="app-message" role="alert">{error}<button aria-label="关闭提示" onClick={()=>setError('')}><X size={16}/></button></div>:null}
 </DeckContext.Provider>;
}
