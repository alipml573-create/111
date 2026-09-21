import { createContext, Fragment, useContext, useState, type ReactNode, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowLeft, ArrowRight, X, ZoomIn } from 'lucide-react';
import { NumberTicker } from '../vendor/magicui/apps/www/registry/magicui/number-ticker';
import { BlurFade } from '../vendor/magicui/apps/www/registry/magicui/blur-fade';
import assets from './assets.json';
import { useEdits, type RichTextNode } from './store';
import { certificates } from './content';

export const BURGUNDY = '#8f1d2c';
export const DeckContext = createContext({edit:false,active:0,select:(_id:string)=>{},openText:(_id:string,_text:string,_doc?:RichTextNode)=>{}});
const assetMap = assets as Record<string,{src:string;thumb:string;width:number;height:number}>;
export function asset(file:string,small=false){const record=assetMap[file];return record?`${import.meta.env.BASE_URL}${small?record.thumb:record.src}`:'';}

function textParts(text:string,highlights:readonly string[]=[]):RichTextNode[]{
 const pattern=highlights.length?new RegExp(`(${highlights.map(value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g'):null;
 return (pattern?text.split(pattern):[text]).filter(Boolean).map(part=>({type:'text',text:part,marks:highlights.includes(part)?[{type:'bold'}]:undefined}));
}
export function textToRichDocument(text:string,highlights:readonly string[]=[]):RichTextNode{
 return {type:'doc',content:text.split('\n').map(line=>({type:'paragraph',content:textParts(line,highlights)}))};
}
function renderRichNode(node:RichTextNode,key:string):ReactNode{
 if(node.type==='text'){
  let content:ReactNode=node.text??'';
  for(const [index,mark] of (node.marks??[]).entries()){
   if(mark.type==='bold')content=<strong key={`${key}-b${index}`}>{content}</strong>;
   else if(mark.type==='italic')content=<em key={`${key}-i${index}`}>{content}</em>;
   else if(mark.type==='textStyle'&&mark.attrs?.color?.toLowerCase()===BURGUNDY)content=<span key={`${key}-c${index}`} className="editable-burgundy">{content}</span>;
  }
  return content;
 }
 if(node.type==='hardBreak')return <br key={key}/>;
 return (node.content??[]).map((child,index)=><Fragment key={`${key}-${index}`}>{renderRichNode(child,`${key}-${index}`)}</Fragment>);
}
function renderRichDocument(doc:RichTextNode){
 const blocks=doc.type==='doc'?(doc.content??[]):[doc];
 return blocks.map((block,index)=><Fragment key={`block-${index}`}>{renderRichNode(block,`block-${index}`)}{index<blocks.length-1?<br/>:null}</Fragment>);
}
export function Txt({id,children,as:Tag='span',className='',highlights}:{id:string;children:string;as?:'span'|'p'|'h1'|'h2'|'h3'|'div'|'small'|'li'|'td'|'th'|'dt'|'dd'|'figcaption';className?:string;highlights?:readonly string[]}){
 const {edit,select,openText}=useContext(DeckContext);const change=useEdits(s=>s.changes[id]);
 const style:CSSProperties={transform:change?`translate(${change.x??0}px,${change.y??0}px)`:undefined};
 const text=change?.text??children;
 const richText=change?.richText??textToRichDocument(text,highlights);
 return <Tag className={`editable ${className}`} data-edit-id={id} data-edit-type="text" style={style} onClick={edit?e=>{e.stopPropagation();select(id);}:undefined} onDoubleClick={edit?()=>openText(id,text,richText):undefined}>{renderRichDocument(richText)}</Tag>;
}
export function ImageFrame({file,previewFile,alt,id,fit='contain',className='',caption,small=false,zoom=true}:{file:string;previewFile?:string;alt:string;id?:string;fit?:'cover'|'contain';className?:string;caption?:string;small?:boolean;zoom?:boolean}){
 const {edit,select}=useContext(DeckContext);const identity=id??`img-${file}`;const change=useEdits(s=>s.changes[identity]);const [open,setOpen]=useState(false);
 const src=change?.image??asset(previewFile??file,small);const style:CSSProperties={transform:change?`translate(${change.x??0}px,${change.y??0}px)`:undefined,width:change?.width,height:change?.height};
 return <><figure className={`image-frame editable ${className}`} data-edit-id={identity} data-edit-type="image" data-asset-file={file} style={style}>
  <button className="image-button" tabIndex={edit||zoom?0:-1} aria-label={`${edit?'选择图片':'放大查看'}：${alt}`} onClick={e=>{e.stopPropagation();if(edit)select(identity);else if(zoom)setOpen(true);}}>
   <img src={src} alt={alt} width={assetMap[previewFile??file]?.width} height={assetMap[previewFile??file]?.height} style={{objectFit:fit}} loading="eager" fetchPriority={id?.startsWith('cover-portrait')?'high':'auto'} decoding="sync" onError={e=>{e.currentTarget.dataset.failed='true';}} />
   {zoom&&!edit?<span className="zoom-affordance" aria-hidden="true"><ZoomIn size={18}/></span>:null}
  </button>{caption?<Txt id={`caption-${identity}`} as="figcaption" className="image-caption">{caption}</Txt>:null}
 </figure>
 <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="lightbox dialog-content" aria-describedby={undefined} onEscapeKeyDown={event=>event.stopPropagation()}><Dialog.Title className="sr-only">{alt}</Dialog.Title><Dialog.Close className="dialog-close" aria-label="关闭图片"><X/></Dialog.Close><img src={change?.image??asset(file)} alt={alt}/><p>{alt}</p></Dialog.Content></Dialog.Portal></Dialog.Root></>;
}
export function SectionHeader({page,en,subtitle}:{page:number;en:string;subtitle?:string}){
 const titles=['','专业，是我所有实践的起点','获字节跳动面试邀请','当AI进入真实商业场景','我开始理解AI生产流程','从内容执行，到项目统筹','把技术变成有温度的角色','从作品，到自己的创作体系','让专业能力，在竞赛中被看见','专业所长，也可以成为价值表达的力量','每一次认可，都是继续向前的理由','在校园里，我也始终是一个行动者','用镜头记录法治，让专业走出校园','从内容创作，继续走向创新创业'];
 const reduced=useReducedMotion();
 return <BlurFade blur="0px" offset={reduced?0:6} duration={reduced?0:.42} className="section-heading"><div className="eyebrow"><span className="gold-rule" aria-hidden="true"/><Txt id={`eyebrow-${page}`}>{en}</Txt></div><Txt id={`title-${page}`} as="h2">{titles[page-1]}</Txt>{subtitle?<Txt id={`subtitle-${page}`} as="p" className="section-subtitle">{subtitle}</Txt>:null}</BlurFade>;
}
export function BigStat({id,value,label,suffix='',prefix='',className='',animate=false}:{id?:string;value:string|number;label:string;suffix?:string;prefix?:string;className?:string;animate?:boolean}){
 const reduced=useReducedMotion();
 const base=id??`stat-${String(label).replace(/\s+/g,'-')}`;
 return <div className={`big-stat ${className}`}><div className="stat-value">{animate&&!reduced&&typeof value==='number'?<><NumberTicker value={value} className="ticker" aria-hidden="true"/><Txt id={`${base}-value`} className="sr-only">{`${prefix}${value}`}</Txt></>:<Txt id={`${base}-value`}>{`${prefix}${value}`}</Txt>}{suffix?<Txt id={`${base}-suffix`} className="stat-suffix">{suffix}</Txt>:null}</div><Txt id={`${base}-label`} as="div" className="stat-label">{label}</Txt></div>;
}
export function Tag({children,id}:{children:ReactNode;id?:string}){return typeof children==='string'?<Txt id={id??`tag-${children}`} className="tag">{children}</Txt>:<span className="tag">{children}</span>;}
export function CertificateCarousel(){
 const [current,setCurrent]=useState(0);const {edit}=useContext(DeckContext);
 const move=(d:number)=>setCurrent(c=>(c+d+certificates.length)%certificates.length);
 return <div className="certificate-carousel" role="region" aria-label="荣誉证书手动轮播" tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.stopPropagation();e.preventDefault();move(e.key==='ArrowRight'?1:-1);}}}>
  <div className="certificate-focus"><div className="archive-label">SELECTED HONOR / 证书聚焦</div><div className="certificate-stage"><ImageFrame id={`cert-${current}`} file={certificates[current][0]} alt={certificates[current][1]}/></div>
  <div className="carousel-controls"><button aria-label="上一张证书" onClick={()=>move(-1)}><ArrowLeft/></button><div aria-live="polite"><span>{String(current+1).padStart(2,'0')} / {certificates.length}</span><p>{certificates[current][1]}</p></div><button aria-label="下一张证书" onClick={()=>move(1)}><ArrowRight/></button></div>
  <p className="carousel-hint">{edit?'选中证书可调整布局':'手动切换 · 聚焦后可用 ← →'}</p></div><div className="certificate-archive"><div className="archive-label">HONOR ARCHIVE / 全部10张证书默认展示</div><div className="certificate-wall">{certificates.map(([file,title],i)=><article key={file}><ImageFrame id={`archive-cert-${i}`} file={file} alt={title}/><span>{String(i+1).padStart(2,'0')} / {title}</span></article>)}</div></div>
 </div>;
}
