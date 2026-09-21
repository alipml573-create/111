import { useContext, useEffect, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useReducedMotion } from 'motion/react';
import { Award, Pause, Play } from 'lucide-react';
import { asset, DeckContext, ImageFrame, Txt } from './components';
import { certificates, honorStatements } from './content';
import assets from './assets.json';

const assetMap = assets as Record<string,{width:number;height:number}>;
const honorsAssetBase = new URL(import.meta.env.BASE_URL, document.baseURI);
const honorsVisual = (file:string) => new URL(`assets/honors-campus-v1/${file}`, honorsAssetBase).href;
const honors = certificates.map(([file,title],index) => {
 const [name,award] = title.split(' · ');
 return {file,title,name,award,index,ratio:assetMap[file].width / assetMap[file].height};
});
const total = honors.length;
const wrap = (index:number) => (index + total) % total;
const honorNarrative = <div className="honor-narrative" role="group" aria-label="荣誉与奖学金完整清单：15项">
 <img className="honor-narrative-shell" src={honorsVisual('honor-list-panel.webp')} alt="" aria-hidden="true"/>
 <ul>{honorStatements.map(({text,award},index) => <li key={text}>
  <Txt id={`honor-statement-${index}`} as="p" highlights={[award]}>{text}</Txt>
 </li>)}</ul>
</div>;

export default function HonorsShowcase(){
 const {active,edit} = useContext(DeckContext);
 const reduced = useReducedMotion();
 const [current,setCurrent] = useState(0);
 const [autoplay,setAutoplay] = useState(!reduced);
 const [hovered,setHovered] = useState(false);
 const [focused,setFocused] = useState(false);
 const item = honors[current];
 const running = active === 10 && autoplay && !edit && !hovered && !focused;

 useEffect(() => {if(reduced) setAutoplay(false);}, [reduced]);
 useEffect(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stopForReducedMotion = () => {if(media.matches) setAutoplay(false);};
  media.addEventListener('change', stopForReducedMotion);
  return () => media.removeEventListener('change', stopForReducedMotion);
 }, []);
 useEffect(() => {
  if(!running) return;
  const timer = window.setInterval(() => {
   // Preserve a certificate while its full image, notes, overview or editor is open.
   if(document.hidden || document.querySelector('.dialog-overlay,.reveal.overview,.reveal.paused')) return;
   setCurrent(index => wrap(index + 1));
  }, 1500);
  return () => window.clearInterval(timer);
 }, [running]);
 useEffect(() => {
  if(active !== 10) return;
  for(const offset of [-1,1]){
   const image = new Image();
   image.src = asset(honors[wrap(current + offset)].file);
   void image.decode().catch(() => {});
  }
 }, [active,current]);

 const keyboard = (event:KeyboardEvent<HTMLDivElement>) => {
  if(edit) return;
  if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
   event.preventDefault();event.stopPropagation();setAutoplay(false);
   if(event.key === 'Home') setCurrent(0);
   else if(event.key === 'End') setCurrent(total-1);
   else setCurrent(index => wrap(index + (event.key === 'ArrowRight' ? 1 : -1)));
  }else if(event.key === ' '){
   event.stopPropagation();
   if(event.target === event.currentTarget){event.preventDefault();setAutoplay(value => !value);}
  }
 };
 return <div className="certificate-carousel honors-showcase" role="region" aria-label="荣誉展示：左侧证书自动轮播，右侧15项荣誉文字" tabIndex={0} onKeyDown={keyboard} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={event => setFocused(!(event.target as HTMLElement).closest('.honor-play-symbol'))} onBlurCapture={event => {if(!event.currentTarget.contains(event.relatedTarget as Node|null)) setFocused(false);}}>
  <div className="honors-scene" aria-hidden="true">
   <img className="honors-gold-ribbon" src={honorsVisual('gold-ribbon.webp')} alt=""/>
   <img className="honors-foliage" src={honorsVisual('foliage-frame.webp')} alt=""/>
   <Txt id="honors-script" className="honors-script">{'Better\nA Brighter Tomorrow'}</Txt>
  </div>
  <div className="certificate-focus" data-current-certificate={current+1}>
   <img className="honor-focus-shell" src={honorsVisual('certificate-panel.webp')} alt="" aria-hidden="true"/>
   <div className="honor-focus-heading" aria-live={running ? 'off' : 'polite'} aria-atomic="true">
    <div className="archive-label"><Award size={21} aria-hidden="true"/><Txt id="honor-focus-label">荣誉聚焦</Txt><Txt id={`honor-focus-count-${item.file}`}>{`${String(current+1).padStart(2,'0')} / ${total}`}</Txt></div>
    <h3><Txt id={`honor-focus-name-${item.file}`} className="honor-focus-name">{item.name}</Txt>{item.award ? <Txt id={`honor-focus-award-${item.file}`} className="honor-focus-award">{item.award}</Txt> : null}</h3>
   </div>
   <div className="certificate-stage" style={{'--certificate-ratio':item.ratio} as CSSProperties}>
    <ImageFrame id={`cert-${current}`} file={item.file} alt={item.title}/>
   </div>
   <button type="button" className="honor-play-symbol" aria-label={autoplay ? '暂停证书自动轮播' : '开始证书自动轮播'} aria-pressed={autoplay} onClick={event => {const next=!autoplay;setAutoplay(next);if(next){setHovered(false);setFocused(false);event.currentTarget.blur();}}}>{autoplay ? <Pause size={21} aria-hidden="true"/> : <Play size={21} aria-hidden="true"/>}</button>
  </div>
  {honorNarrative}
 </div>;
}
