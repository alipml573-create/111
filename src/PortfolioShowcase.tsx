import { useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { BlurFade } from '../vendor/magicui/apps/www/registry/magicui/blur-fade';
import { asset, DeckContext, ImageFrame, SectionHeader, Txt } from './components';
import { portfolioItems } from './content';
import assets from './assets.json';

type Orientation = 'landscape' | 'portrait';
const assetMap = assets as Record<string,{width:number;height:number}>;
const publicAssetBase = new URL(import.meta.env.BASE_URL, document.baseURI);
const portfolioVisual = (file:string) => new URL(`assets/portfolio-campus-v2/${file}`, publicAssetBase).href;
// Sort once, keeping the original work number and editing identity intact.
const exhibitionItems = portfolioItems.map(([file,title,category],index) => ({
 file,title,category,number:index+1,
 orientation:(assetMap[file].height > assetMap[file].width ? 'portrait' : 'landscape') as Orientation,
 ratio:assetMap[file].width / assetMap[file].height,
})).sort((a,b) => Number(a.orientation === 'portrait') - Number(b.orientation === 'portrait'))
 .map((item,index) => ({...item,index,displayNumber:index+1}));
const formatGroups = [
 {orientation:'landscape',label:'横屏',items:exhibitionItems.filter(item => item.orientation === 'landscape')},
 {orientation:'portrait',label:'竖屏',items:exhibitionItems.filter(item => item.orientation === 'portrait')},
] as const;
const total = exhibitionItems.length;
const wrap = (index:number) => (index + total) % total;

export default function PortfolioShowcase(){
 const { active, edit } = useContext(DeckContext);
 const reduced = useReducedMotion();
 const [current, setCurrent] = useState(2);
 const [autoplay, setAutoplay] = useState(!reduced);
 const [hovered, setHovered] = useState(false);
 const [focused, setFocused] = useState(false);
 const thumbs = useRef<Array<HTMLButtonElement|null>>([]);
 const work = exhibitionItems[current];
 const {file,title,category,number,displayNumber,orientation,ratio} = work;
 const group = formatGroups.find(item => item.orientation === orientation)!;
 const position = current - group.items[0].index;
 const previous = group.items[(position + group.items.length - 1) % group.items.length];
 const next = group.items[(position + 1) % group.items.length];
 const portrait = orientation === 'portrait';
 const running = active === 7 && autoplay && !hovered && !focused && !edit;

 useEffect(() => { if(reduced) setAutoplay(false); }, [reduced]);
 useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopForReducedMotion = () => { if(media.matches) setAutoplay(false); };
  media.addEventListener('change', stopForReducedMotion);
  return () => media.removeEventListener('change', stopForReducedMotion);
 }, []);
 useEffect(() => {
  if(!running) return;
  const timer = window.setInterval(() => {
   // Never replace a work while its original image, notes or an editor dialog is open.
   if(document.hidden || document.querySelector('.dialog-overlay,.reveal.overview,.reveal.paused')) return;
   setCurrent(index => wrap(index + 1));
  }, 1000);
  return () => window.clearInterval(timer);
 }, [running]);
 useEffect(() => {
  if(active !== 7) return;
  // Load only nearby full-size works; the entire preview rail uses small assets.
  const nearby = [-1,1,2].map(offset => exhibitionItems[wrap(current + offset)]);
  if(portrait) nearby.push(previous,next);
  for(const item of new Set(nearby)){
   const image = new Image();
   image.src = asset(item.file);
   void image.decode().catch(() => {});
  }
 }, [active, current, portrait, previous, next]);

 const select = (index:number, pin=false) => {
  setCurrent(index);
  if(pin) setAutoplay(false);
 };
 const keyboard = (event:KeyboardEvent<HTMLDivElement>) => {
  if(edit) return;
  if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();
   event.stopPropagation();
   const next = event.key === 'Home' ? 0 : event.key === 'End' ? total - 1 : wrap(current + (event.key === 'ArrowRight' ? 1 : -1));
   select(next, true);
   if((event.target as HTMLElement).closest('.portfolio-previews')) thumbs.current[next]?.focus();
  }else if(event.key === ' '){
   // Focused buttons retain native Space activation, without flipping the slide.
   event.stopPropagation();
   if(event.target === event.currentTarget){event.preventDefault();setAutoplay(value => !value);}
  }
 };
 return <div className="portfolio-showcase work-rail" role="region" aria-roledescription="轮播" aria-label={`AIGC作品展示：全部${total}件作品，横屏与竖屏分组`} tabIndex={0} onKeyDown={keyboard} onFocusCapture={event => setFocused(!(event.target as HTMLElement).closest('.portfolio-play-minimal'))} onBlurCapture={event => {if(!event.currentTarget.contains(event.relatedTarget as Node|null)) setFocused(false);}}>
  <div className="portfolio-scene" aria-hidden="true">
   <img className="portfolio-film-ribbon" src={portfolioVisual('film-ribbon.webp')} alt=""/>
   <img className="portfolio-acrylic-stage" src={portfolioVisual('acrylic-stage.webp')} alt=""/>
   <img className="portfolio-foliage" src={portfolioVisual('foliage-frame.webp')} alt=""/>
   <img className="portfolio-ideas-plinth" src={portfolioVisual('ideas-plinth.webp')} alt=""/>
   <span className="portfolio-slogan portfolio-slogan-cn"/>
   <span className="portfolio-slogan portfolio-slogan-en"/>
  </div>
  <div className="portfolio-heading">
   <SectionHeader page={8} en="AIGC PORTFOLIO"/>
   <div className="portfolio-summary"><Txt id="portfolio-total" as="h3">{String(total)}</Txt><Txt id="portfolio-summary">{`件作品\n横屏 ${formatGroups[0].items.length} · 竖屏 ${formatGroups[1].items.length}`}</Txt></div>
  </div>
  <div className={`portfolio-exhibition is-${orientation} ${portrait ? '' : 'portfolio-glass'}`} data-format={orientation} data-main-work-number={number} style={{'--portfolio-ratio':ratio} as CSSProperties} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
   <div className="portfolio-screen">
    {portrait ? <button type="button" className="portfolio-neighbor" aria-label={`前一件竖屏作品：${previous.title}`} onClick={() => select(previous.index,true)}>
     <img src={asset(previous.file,true)} alt="" style={{aspectRatio:previous.ratio}}/>
     <Txt id={`portfolio-neighbor-${previous.file}`}>{`${String(previous.displayNumber).padStart(2,'0')} / ${previous.category}`}</Txt>
    </button> : <><img className="portfolio-image-atmosphere" src={asset(file,true)} alt="" aria-hidden="true"/><div className="portfolio-screen-wash" aria-hidden="true"/></>}
    <BlurFade key={file} duration={reduced ? 0 : .18} offset={0} blur="0px" className="portfolio-main-image">
     <ImageFrame file={file} alt={title} className="portfolio-original"/>
    </BlurFade>
    {portrait ? <button type="button" className="portfolio-neighbor" aria-label={`后一件竖屏作品：${next.title}`} onClick={() => select(next.index,true)}>
     <img src={asset(next.file,true)} alt="" style={{aspectRatio:next.ratio}}/>
     <Txt id={`portfolio-neighbor-${next.file}`}>{`${String(next.displayNumber).padStart(2,'0')} / ${next.category}`}</Txt>
    </button> : null}
   </div>
   <aside className={`portfolio-details ${portrait ? 'portfolio-glass' : ''}`}>
    <div className="portfolio-work-heading" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
     <div className="portfolio-work-index"><Txt id={`portfolio-index-${file}`} as="h3">{String(displayNumber).padStart(2,'0')}</Txt><Txt id="portfolio-index-total">{`/ ${total}`}</Txt><Txt id={`portfolio-category-${file}`} className="portfolio-category">{category}</Txt></div>
     <Txt id={`portfolio-format-${file}`} as="p" className="portfolio-format-label">{`${group.label}作品 · ${position+1} / ${group.items.length}`}</Txt>
     <Txt id={`portfolio-title-${file}`} as="h3" className="portfolio-work-title">{title}</Txt>
     {number === 1 ? <Txt id="portfolio-event-note" as="p" className="portfolio-event-note">大型赛事现场公开放映</Txt> : null}
    </div>
    <div className="portfolio-navigation">
     <button type="button" className="portfolio-play-minimal" title={autoplay ? '暂停轮播' : '开始轮播'} aria-label={autoplay ? '暂停自动轮播' : '开始自动轮播'} onClick={event => {const next=!autoplay;setAutoplay(next);if(next){setHovered(false);setFocused(false);event.currentTarget.blur();}}}>
      {autoplay ? <Pause size={24}/> : <Play size={24}/>} 
     </button>
    </div>
   </aside>
  </div>
  <div className="portfolio-preview-panel portfolio-glass" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
   <div className="portfolio-preview-heading"><Txt id="portfolio-preview-heading">作品索引 · 01–18</Txt><Txt id="portfolio-preview-hint" as="p">悬停预览 · 点击停留 · ← → 浏览</Txt></div>
   <div className="portfolio-preview-groups">
    {formatGroups.map(format => <div key={format.orientation} className={`portfolio-preview-group group-${format.orientation}`} role="group" aria-label={`${format.label}作品：${format.items.length}件`}>
     <div className="portfolio-group-label"><Txt id={`portfolio-group-${format.orientation}`} as="h3">{format.label}</Txt><Txt id={`portfolio-group-${format.orientation}-count`}>{`${format.items.length}件`}</Txt></div>
     <div className="portfolio-previews">
      {format.items.map(item => <button type="button" key={item.file} ref={element => {thumbs.current[item.index] = element;}} className={`portfolio-preview ${item.index === current ? 'is-selected' : ''}`} aria-label={`预览作品 ${String(item.displayNumber).padStart(2,'0')}：${item.title}`} aria-pressed={item.index === current} title={item.title} data-work-number={item.displayNumber} data-original-work-number={item.number} data-orientation={item.orientation} onMouseEnter={() => select(item.index)} onFocus={() => select(item.index)} onClick={() => select(item.index,true)} style={{'--preview-ratio':item.ratio} as CSSProperties}>
       <img src={asset(item.file,true)} alt="" loading="eager" decoding="async"/>
       <span aria-hidden="true">{String(item.displayNumber).padStart(2,'0')}</span>
      </button>)}
     </div>
    </div>)}
   </div>
  </div>
 </div>;
}
