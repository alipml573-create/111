import { type CSSProperties } from 'react';
import { ImageFrame, SectionHeader, Txt } from './components';
import { campusEvidence, campusRoles } from './content';
import assets from './assets.json';

const assetMap = assets as Record<string,{width:number;height:number}>;
const campusAsset = (file:string) => `${import.meta.env.BASE_URL}assets/campus-action-v1/${file}`;

function CampusRoleCard({role}:{role:(typeof campusRoles)[number]}){
 return <article className={`campus-work-card campus-work-${role.key}`} role="listitem" aria-label={role.title}>
  <div className="campus-card-heading">
   <img src={campusAsset(`icon-${role.key}.png`)} alt="" aria-hidden="true"/>
   <Txt id={`campus-${role.key}-title`} as="h3">{role.title}</Txt>
  </div>
  <Txt id={`campus-${role.key}-body`} as="p" highlights={role.highlights}>{role.text}</Txt>
 </article>;
}

const campusBoard = <div className="campus-work-layout">
 <div className="campus-work-board" role="list" aria-label="六项校园实践与学生工作">
  <div className="campus-work-row campus-work-row-top">
   {campusRoles.slice(0,3).map(role => <CampusRoleCard key={role.key} role={role}/>)}
  </div>
  <div className="campus-work-row campus-work-row-bottom">
   {campusRoles.slice(3,6).map(role => <CampusRoleCard key={role.key} role={role}/>)}
  </div>
 </div>
 <div className="campus-proof-strip" role="group" aria-label="四张AI禁毒漫画推文的真实发布记录">
  {campusEvidence.map(item => <article key={item.file} className="campus-proof-item" style={{'--campus-proof-ratio':assetMap[item.file].width/assetMap[item.file].height} as CSSProperties}>
   <ImageFrame file={item.file} alt={`AI禁毒漫画推文真实发布记录 · ${item.date}`}/>
   <Txt id={`campus-evidence-${item.date}`} as="p">{`${item.date} · 推文发布`}</Txt>
  </article>)}
 </div>
</div>;

export default function CampusWork(){
 return <>
  <div className="campus-scene" aria-hidden="true">
   <img className="campus-scene-ribbon" src={campusAsset('light-ribbon.webp')} alt=""/>
   <img className="campus-scene-left" src={campusAsset('planning-camera.webp')} alt=""/>
   <img className="campus-scene-right" src={campusAsset('action-clipboard.webp')} alt=""/>
  </div>
  <SectionHeader page={12} en="CAMPUS & COMMUNITY" subtitle="以热爱回应校园 · 用行动创造价值"/>
  {campusBoard}
 </>;
}
