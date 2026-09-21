import { useReducedMotion } from 'motion/react';
import { BlurFade } from '../vendor/magicui/apps/www/registry/magicui/blur-fade';
import { ImageFrame, SectionHeader, Txt } from './components';
import { competitionEvidence } from './content';

const publicAssetBase = new URL(import.meta.env.BASE_URL, document.baseURI);
const competitionVisual = (file:string) => new URL(`assets/competition-campus-v1/${file}`, publicAssetBase).href;

export default function CompetitionResults(){
 const reduced=useReducedMotion();
 return <>
  <div className="competition-scene" aria-hidden="true">
   <img className="competition-marble-stage" src={competitionVisual('marble-stage.webp')} alt=""/>
   <img className="competition-golden-light" src={competitionVisual('golden-light.webp')} alt=""/>
   <img className="competition-foliage" src={competitionVisual('foliage-frame.webp')} alt=""/>
   <img className="competition-right-plinth" src={competitionVisual('right-plinth.webp')} alt=""/>
   <img className="competition-slogan competition-slogan-blue" src={competitionVisual('blue-slogan.webp')} alt=""/>
   <img className="competition-slogan competition-slogan-left" src={competitionVisual('left-slogan.webp')} alt=""/>
   <img className="competition-slogan competition-slogan-gold" src={competitionVisual('gold-slogan.webp')} alt=""/>
  </div>
  <div className="competition-header">
   <SectionHeader page={9} en="RECOGNITION THROUGH PRACTICE"/>
   <span className="competition-level" role="img" aria-label="市级竞赛"><img src={competitionVisual('city-badge.webp')} alt=""/></span>
  </div>
  {/* Only opacity changes: transformed/filtered parents would isolate the glass blur. */}
  <BlurFade className="competition-results-grid" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
   {competitionEvidence.map(competition=><article key={competition.key} className={`competition-card competition-${competition.key}`} aria-label={competition.title}>
    <div className="competition-copy">
     <Txt id={`competition-${competition.key}-title`} as="h3" className="competition-title">{competition.title.replace('职业规划大赛','\n职业规划大赛').replace('广告艺术大赛','\n广告艺术大赛')}</Txt>
     {competition.key==='career'?<>
      <div className="competition-awards" role="group" aria-label="职业规划大赛奖项">
       <div><Txt id="competition-career-city-label">上海赛区</Txt><Txt id="competition-career-city-award" className="competition-award">铜奖 第一名</Txt></div>
       <div><Txt id="competition-career-school-label">校赛</Txt><Txt id="competition-career-school-award" className="competition-award">金奖 第一名</Txt></div>
      </div>
      <Txt id="competition-career-direction" as="p" className="competition-description" highlights={['AIGC技术','视听叙事编导']}>以AIGC技术赋能故事电商的视听叙事编导</Txt>
     </>:<>
      <Txt id="competition-advertising-city" as="p" className="competition-city">上海赛区</Txt>
      <Txt id="competition-advertising-award" as="p" className="competition-advertising-award">科技类优秀奖</Txt>
      <Txt id="competition-advertising-work" as="p" className="competition-work">《灵犀》IP设计</Txt>
     </>}
    </div>
    <div className="competition-gallery" role="group" aria-label={`${competition.title}：图片与注释`}>
     {competition.images.map(image=><ImageFrame key={image.file} file={image.file} alt={`${competition.title} · ${image.caption}`} caption={image.caption==='校赛金奖（第一名）证书'?'校赛金奖\n（第一名）证书':image.caption} className="competition-media"/>)}
    </div>
   </article>)}
  </BlurFade>
 </>;
}
