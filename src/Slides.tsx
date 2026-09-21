import { useReducedMotion } from 'motion/react';
import { BlurFade } from '../vendor/magicui/apps/www/registry/magicui/blur-fade';
import { BarChart3, BookmarkCheck, BriefcaseBusiness, ChevronRight, Clapperboard, Crown, ExternalLink, Layers, Lightbulb, Mail, FileText, ScanLine, TrendingUp, Trophy, Video, Wheat } from 'lucide-react';
import { Txt, ImageFrame, SectionHeader, BigStat, Tag } from './components';
import { courses, shangmeiResponsibilities, shangmeiAchievement, shangmeiAchievementHighlights, netjoyResponsibilities, netjoyAchievement, netjoyAchievementHighlights, guangdongDetails } from './content';
import PortfolioShowcase from './PortfolioShowcase';
import CompetitionResults from './CompetitionResults';
import HonorsShowcase from './HonorsShowcase';
import CampusWork from './CampusWork';
import assets from './assets.json';

const photos={portrait:'2120880cbe54ba3de4e372f8f170f528.jpg',stage:'08f6509fd47cda385fe49a20aaca2ec1.jpg',court:'b206ea0eebbdc9bc857c172c809ba940.jpg'};
const publicAssetBase = new URL(import.meta.env.BASE_URL, document.baseURI);
const coverVisual = (file:string) => new URL(`assets/cover-campus-v4/${file}`, publicAssetBase).href;
const academicVisual = (file:string) => new URL(`assets/academic-campus-v1/${file}`, publicAssetBase).href;
const interviewVisual = (file:string) => new URL(`assets/interview-campus-v2/${file}`, publicAssetBase).href;
const shangmeiVisual = (file:string) => new URL(`assets/shangmei-campus-v2/${file}`, publicAssetBase).href;
const netjoyVisual = (file:string) => new URL(`assets/netjoy-studio-v2/${file}`, publicAssetBase).href;
const ipVisual = (file:string) => new URL(`assets/ip-showcase-v2/${file}`, publicAssetBase).href;
const valuesVisual = (file:string) => new URL(`assets/values-campus-v1/${file}`, publicAssetBase).href;
const courtVisual = (file:string) => new URL(`assets/court-campus-v1/${file}`, publicAssetBase).href;
const innovationVisual = (file:string) => new URL(`assets/innovation-campus-v1/${file}`, publicAssetBase).href;
const endingVisual = (file:string) => new URL(`assets/ending-campus-v1/${file}`, publicAssetBase).href;
function Mount({file,alt,label,className='',id}:{file:string;alt:string;label?:string;className?:string;id?:string}){const identity=id??file;return <div className={`archive-mount ${className}`}><ImageFrame file={file} alt={alt} id={id}/>{label?<Txt id={`mount-label-${identity}`} as="div" className="mount-label">{label}</Txt>:null}</div>;}
const fileNames=Object.keys(assets);
const horseExpressions=fileNames.filter(f=>/^(法小骥_|数小骅_|法小骥与数小骅_)/.test(f));
const labExpressions=fileNames.filter(f=>f.startsWith('易小麟'));
const horseSheets=['博学小马精灵_三视图.png','博学小马精灵_动作姿态.jpg','博学小马精灵三视图.png','拼图独角兽三视图.jpg','拼图独角兽动作姿态.png','拼图小马三视图与动作延展.png'];


function Cover(){return <div className="cover-layout">
<div className="cover-scene" aria-hidden="true">
 <img className="cover-media" src={coverVisual('media-cards.webp')} alt=""/>
 <img className="cover-laptop" src={coverVisual('editing-laptop.webp')} alt=""/>
 <img className="cover-boy" src={coverVisual('photographer-boy.webp')} alt=""/>
 <img className="cover-film" src={coverVisual('film-ribbons.webp')} alt=""/>
 <img className="cover-cinema" src={coverVisual('cinema-books.webp')} alt=""/>
 <img className="cover-coffee" src={coverVisual('coffee-cup.webp')} alt=""/>
 <img className="cover-notebook" src={coverVisual('notebook.webp')} alt=""/>
 <img className="cover-robot" src={coverVisual('ai-robot.webp')} alt=""/>
 <img className="cover-sign" src={coverVisual('academy-sign.webp')} alt=""/>
 <img className="cover-foliage" src={coverVisual('foliage-frame.webp')} alt=""/>
 <Txt id="cover-future-note" className="cover-future-note">{'A Brighter\nFuture'}</Txt>
 <Txt id="cover-flight-note" className="cover-flight-note">{'Next\nTo a Brighter Future'}</Txt>
</div>
<div className="cover-copy"><div className="eyebrow"><span className="gold-rule"/><Txt id="cover-eyebrow">国家奖学金答辩</Txt></div><Txt id="cover-heading" as="h1">{'向新而行\n向上生长'}</Txt><Txt id="cover-subtitle" as="p" className="cover-subtitle">以影像为笔，以AI为翼</Txt><div className="cover-person"><Txt id="cover-name" as="h3">滕梓昊</Txt><Txt id="cover-school" as="p">上海纪录片学院（法治宣传教育学院）</Txt><Txt id="cover-major">广播电视编导 · 摄影摄像方向</Txt></div><div className="cover-thesis"><Txt id="cover-thesis-image">IMAGE</Txt><i>×</i><Txt id="cover-thesis-ai">AI</Txt><i>×</i><Txt id="cover-thesis-practice">PRACTICE</Txt><i>×</i><Txt id="cover-thesis-growth">GROWTH</Txt></div></div>
<div className="cover-bottom"><Txt id="cover-bottom-summary">一段从专业出发的成长纪录</Txt><Txt id="cover-bottom-year">2026 / NATIONAL SCHOLARSHIP</Txt></div></div>;}

function Academic(){
 const reduced=useReducedMotion();
 return <><div className="academic-scene" aria-hidden="true">
  <img className="academic-sign" src={academicVisual('academy-sign.webp')} alt=""/>
  <img className="academic-books" src={academicVisual('books-and-pen.webp')} alt=""/>
  <img className="academic-camera" src={academicVisual('camera.webp')} alt=""/>
  <img className="academic-pillar" src={academicVisual('motto-pillar.webp')} alt=""/>
  <Txt id="academic-script" className="academic-script">{'Document\nA Better World'}</Txt>
 </div>
 <div className="academic-header"><SectionHeader page={2} en="ACADEMIC FOUNDATION"/>
  <Txt id="academic-tagline" as="p" className="academic-tagline">以影像为笔，书写更有力量的未来</Txt>
 </div>
 {/* Opacity-only entrance: a filter on the grid would isolate backdrop blur. */}
 <BlurFade className="academic-grid" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="profile-column academic-glass" role="group" aria-label="个人简介">
   <div className="profile-identity"><ImageFrame file={photos.portrait} id="academic-portrait" alt="滕梓昊证件照" className="profile-photo" zoom={false}/><div><Txt id="academic-name" as="h3">滕梓昊</Txt><Txt id="academic-year" as="p" className="academic-year">大三</Txt></div><img className="profile-school-mark" src={academicVisual('academy-logo.webp')} alt="" aria-hidden="true"/></div>
   <Txt id="academic-school" as="p" className="academic-school" highlights={['上海纪录片学院']}>{'上海纪录片学院\n（法治宣传教育学院）'}</Txt>
   <Txt id="academic-major" as="p" className="academic-major" highlights={['广播电视编导']}>{'广播电视编导\n摄影摄像方向'}</Txt>
   <div className="profile-badges"><Tag id="academic-badge-youth">共青团员</Tag><Tag id="academic-badge-party">入党积极分子</Tag></div>
  </div>
  <div className="academic-metrics academic-glass" role="group" aria-label="学业成绩">
   <div className="rank-pair">{['学业排名','综合测评'].map((label,index)=><div className="rank" key={label}><Txt id={`academic-rank-${index}-label`}>{label}</Txt><Crown className="rank-crown" aria-hidden="true"/><div className="rank-emblem"><Wheat className="rank-wheat rank-wheat-left" aria-hidden="true"/><Txt id={`academic-rank-${index}-number`} className="rank-number">1</Txt><Wheat className="rank-wheat rank-wheat-right" aria-hidden="true"/></div><Txt id={`academic-rank-${index}-result`} as="p">专业第一</Txt></div>)}</div>
   <div className="academic-support"><div><Txt id="academic-gpa-label">GPA</Txt><Txt id="academic-gpa-value">3.59</Txt></div><div className="scholarship-copy"><Txt id="academic-scholarship-kicker">持续的专业积累</Txt><Txt id="academic-scholarship" as="p">{'连续两年获\n特等学业奖学金'}</Txt></div><Trophy className="academic-trophy" aria-hidden="true"/></div>
   <Txt id="academic-note" as="p" className="academic-note">{'扎实的专业基础，\n是走向更广阔实践的底气。'}</Txt>
  </div>
  <div className="courses-column academic-glass" role="group" aria-label="专业核心课程">
   <div className="courses-title"><Txt id="academic-courses-title" as="h3">核心课程</Txt><Txt id="academic-courses-en">CORE COURSES</Txt></div>
   <table><caption className="sr-only">专业核心课程绩点</caption><thead><tr><Txt id="academic-courses-course-header" as="th">课程</Txt><Txt id="academic-courses-score-header" as="th">绩点</Txt></tr></thead><tbody>{courses.map((c,index)=><tr key={c}><Txt id={`academic-course-${index}`} as="td">{c}</Txt><Txt id={`academic-course-score-${index}`} as="td">4.0</Txt></tr>)}</tbody></table>
   <p><BookmarkCheck aria-hidden="true"/><Txt id="academic-courses-note">多门专业核心课程满绩</Txt></p>
  </div>
 </BlurFade></>;
}

function InterviewOpportunity(){
 const reduced=useReducedMotion();
 return <><div className="interview-scene" aria-hidden="true">
  <img className="interview-canopy" src={interviewVisual('sunlit-canopy.webp')} alt=""/>
  <img className="interview-books" src={interviewVisual('books-and-pen.webp')} alt=""/>
  <img className="interview-laptop" src={interviewVisual('interview-laptop.webp')} alt=""/>
  <img className="interview-pillar" src={interviewVisual('open-world-pillar.webp')} alt=""/>
 </div>
 <div className="interview-top">
  <div className="interview-heading"><SectionHeader page={3} en="BYTEDANCE INTERVIEW INVITATION"/><Txt id="interview-tagline" as="p" className="interview-tagline">新的探索，遇见更大的可能</Txt></div>
  <img className="interview-invitation-art" src={interviewVisual('invitation-envelope.webp')} alt="" aria-hidden="true"/>
  <img className="interview-brand-art" src={interviewVisual('bytedance-wordmark.webp')} alt="ByteDance 字节跳动"/>
 </div>
 <BlurFade className="interview-layout" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="interview-evidence interview-glass" role="group" aria-label="真实面试邀请邮件">
   <div className="interview-evidence-heading"><h3><Mail aria-hidden="true"/><Txt id="interview-email-heading">面试邀请邮件</Txt></h3><span><Txt id="interview-email-action">点击邮件查看完整原图</Txt> <ExternalLink aria-hidden="true"/></span></div>
   <ImageFrame file="bytedance-interview-email.png" previewFile="bytedance-interview-email-body.png" id="interview-email" alt="字节跳动AIGC产品运营实习生面试邀请邮件，正文局部展示，放大查看完整原图" className="interview-email"/>
   <Txt id="interview-source-note" as="p" className="interview-source-note">邮件原始截图 · 本页展示正文局部</Txt>
  </div>
  <div className="interview-role interview-glass" role="group" aria-label="受邀岗位与面试阶段">
   <div className="interview-role-heading"><h3><BriefcaseBusiness aria-hidden="true"/><Txt id="interview-role-heading">受邀实习岗位</Txt></h3><Tag id="interview-invitation-tag">面试邀请</Tag></div>
   <Txt id="interview-position" as="h3" className="interview-position">AIGC产品运营</Txt><Txt id="interview-position-kind" as="p" className="interview-position-kind">实习生</Txt>
   <dl className="interview-details"><div><dt><Layers aria-hidden="true"/><Txt id="interview-direction-label">业务方向</Txt></dt><Txt id="interview-direction-value" as="dd">广告业务</Txt></div><div><dt><Video aria-hidden="true"/><Txt id="interview-format-label">面试形式</Txt></dt><Txt id="interview-format-value" as="dd">视频面试</Txt></div></dl>
   <Txt id="interview-next" as="p" className="interview-next">{'新的探索，仍在继续。\n当前阶段：受邀参加面试'}</Txt>
  </div>
 </BlurFade></>;
}

const shangmeiProducts = [
 ['image 5.png','brand-product-377-cleanser.png','韩束377洁面产品，透明底陈列'],
 ['image 1.png','brand-product-377-toner.png','韩束377精华水产品，透明底陈列'],
 ['image.png','brand-product-cleanser.png','韩束黑色洁面产品，透明底陈列'],
 ['image 3.png','brand-product-kit.png','韩束377套装，透明底陈列'],
 ['image 8.png','brand-product-device-black.png','项目产品图：黑色手持美容仪，原图主体抠像'],
 ['image 9.png','brand-product-device-gold.png','项目产品图：金色手持美容仪，原图主体抠像'],
] as const;
const shangmeiDutyIcons = [Clapperboard, BarChart3, Lightbulb] as const;
function Shangmei(){
 const reduced=useReducedMotion();
 return <><div className="shangmei-scene" aria-hidden="true"><img className="shangmei-leaf-frame" src={shangmeiVisual('leaf-frame.webp')} alt=""/></div>
 <div className="shangmei-header"><SectionHeader page={4} en="AI BRAND CREATIVE" subtitle="上海上美化妆品股份有限公司｜韩束事业部"/>
  <img className="shangmei-wordmark" src={shangmeiVisual('chicmax-kans-wordmark-cropped.webp')} alt="CHICMAX上美与KANS韩束品牌标识"/>
 </div><BlurFade className="shangmei-layout" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="shangmei-responsibilities">{shangmeiResponsibilities.map((item,index)=>{const Icon=shangmeiDutyIcons[index];return <article key={item.id} className="shangmei-duty shangmei-glass" aria-label={item.title}><span className="shangmei-duty-icon" aria-hidden="true"><Icon/></span><div><Txt id={`${item.id}-title`} as="h3" className="duty-title">{item.title}</Txt><Txt id={item.id} as="p" className="shangmei-copy" highlights={item.highlights}>{item.text}</Txt></div></article>;})}</div>
  <article className="shangmei-achievements shangmei-glass" aria-labelledby="shangmei-achievements-heading"><h3 id="shangmei-achievements-heading"><TrendingUp aria-hidden="true"/><Txt id="shangmei-achievements-title">杰出成果</Txt></h3>
   <div className="shangmei-results" aria-label="参与内容的投放成果"><BigStat value="> 2" label="平均投放ROI"/><BigStat value="7" label="最佳爆款ROI"/><BigStat value="千万" suffix="+" label="转化销售额"/></div>
   <Txt id="shangmei-achievement" as="p" className="shangmei-copy" highlights={shangmeiAchievementHighlights}>{shangmeiAchievement}</Txt>
  </article>
 </BlurFade><div className="shangmei-product-stage" role="group" aria-label="六张真实项目产品素材"><img className="shangmei-mascot" src={shangmeiVisual('brand-mascot.webp')} alt="" aria-hidden="true"/><img className="shangmei-acrylic" src={shangmeiVisual('acrylic-stage.webp')} alt="" aria-hidden="true"/><div className="shangmei-product-label shangmei-glass"><Txt id="shangmei-product-label" as="h3">{'参与产品\n素材陈列'}</Txt><ChevronRight aria-hidden="true"/></div><div className="shangmei-product-row">{shangmeiProducts.map(([file,previewFile,alt])=><ImageFrame key={file} file={file} previewFile={previewFile} alt={alt}/>)}</div></div></>;
}

const netjoyEvidence = [
 {file:'203b1b113b56e50c5804e1486c43bd60.jpg',alt:'《裴总他假戏真做》官方主视觉',caption:'《裴总他\n假戏真做》',detail:'短剧主视觉',kind:'poster'},
 {file:'426dff6eeec9ef78df38d6b598531a02.jpg',alt:'原始抖音短剧榜排名完整截图',caption:'抖音\n喜剧榜',detail:'NO.4',kind:'rank'},
 {file:'86bf0821d1c89ac7f200281beaa5c8af.jpg',alt:'原始AI剧新剧榜排名完整截图',caption:'红果\n新剧榜',detail:'TOP70',kind:'rank'},
 {file:'裴总他假戏真做-第一集.jpg',alt:'《裴总他假戏真做》第一集制作样片',caption:'制作样片\n全网热度',detail:'2980万+',kind:'samples'},
] as const;
const netjoyDutyIcons = [Mail, ScanLine, TrendingUp] as const;
const netjoyProcessSteps = ['剧本','分镜','素材','AI生成','剪辑','审核','修改','验收'] as const;
function Netjoy(){
 const reduced=useReducedMotion();
 return <><div className="netjoy-scene" aria-hidden="true"><img className="netjoy-film-ribbons" src={netjoyVisual('film-ribbons.webp')} alt=""/><img className="netjoy-checklist-art" src={netjoyVisual('production-checklist.webp')} alt=""/><img className="netjoy-producer" src={netjoyVisual('producer-cutout.webp')} alt=""/><img className="netjoy-camera-art" src={netjoyVisual('camera-kit.webp')} alt=""/><img className="netjoy-desk-books" src={netjoyVisual('desk-books.webp')} alt=""/><img className="netjoy-desk-notes" src={netjoyVisual('desk-notes.webp')} alt=""/></div>
 <div className="netjoy-header"><div className="netjoy-heading"><SectionHeader page={5} en="AIGC PRODUCTION MANAGEMENT" subtitle="从“生成内容”到“管理AIGC生产”"/><Txt id="netjoy-tagline" as="p" className="netjoy-tagline">用AI，让好故事被看见</Txt></div>
  <div className="netjoy-identity"><ImageFrame file="image 4.png" previewFile="netjoy-logo-transparent.png" alt="云想科技netjoy Logo，原始透明底" className="netjoy-logo" zoom={false}/><Txt id="netjoy-identity-role" as="p">云想科技集团 · AIGC导演</Txt><Txt id="netjoy-identity-slogan">技术连接创意，AI放大热爱</Txt></div>
 </div><BlurFade className="netjoy-layout" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="netjoy-responsibilities">{netjoyResponsibilities.map((item,index)=>{const Icon=netjoyDutyIcons[index];return <article key={item.id} className="netjoy-duty netjoy-glass" aria-label={item.title}><span className="netjoy-duty-icon" aria-hidden="true"><Icon/></span><div><Txt id={`${item.id}-title`} as="h3" className="duty-title">{item.title}</Txt><Txt id={item.id} as="p" className="netjoy-copy" highlights={item.highlights}>{item.text}</Txt></div><span className="netjoy-duty-number" aria-hidden="true">0{index+1}</span></article>;})}</div>
  <div className="netjoy-work netjoy-glass" role="group" aria-label="短剧成果与真实榜单证据"><article className="netjoy-achievement" aria-labelledby="netjoy-achievement-heading"><h3 id="netjoy-achievement-heading"><Trophy aria-hidden="true"/><Txt id="netjoy-achievement-title">杰出成果</Txt></h3><Txt id="netjoy-achievement" as="p" className="netjoy-copy" highlights={netjoyAchievementHighlights}>{netjoyAchievement}</Txt></article>
   <div className="netjoy-evidence" role="group" aria-label="短剧主视觉、榜单与制作样片">{netjoyEvidence.map((item,index)=><article key={item.file} className={`netjoy-media netjoy-media-${item.kind}`}><ImageFrame file={item.file} alt={item.alt}/><div className="netjoy-media-caption"><Txt id={`netjoy-evidence-${index}-caption`} as="h3">{item.caption}</Txt><Txt id={`netjoy-evidence-${index}-detail`} as="p">{item.detail}</Txt></div></article>)}</div>
  </div>
 </BlurFade><div className="netjoy-process netjoy-glass" role="group" aria-label="AIGC短剧生产闭环"><h3><Clapperboard aria-hidden="true"/><Txt id="netjoy-process-title">生产闭环</Txt></h3><ol>{netjoyProcessSteps.map((step,index)=><Txt id={`netjoy-process-${index}`} as="li" key={step}>{step}</Txt>)}</ol></div></>;
}

const guangdongMaterials = [
 {file:'86cff1e11dcc13523d7843ada07f18cb.jpg',previewFile:'guangdong-company-account-board.png',alt:'公司IP账号视频内容完整截图',caption:'公司IP账号运营',kind:'account'},
 {file:'ca2af9b7f8de49713dc79c3695d67b9e.jpg',previewFile:'guangdong-content-account-board.png',alt:'运营账号与宣传内容完整截图',caption:'宣传内容运营',kind:'account'},
 {file:'image 2.png',previewFile:'guangdong-graphics-board.png',alt:'宣传图文作品完整样片墙',caption:'宣传图文作品',kind:'graphics'},
 {file:'0a95786efe60570049f090102461f1fe.jpg',previewFile:'guangdong-partnership-board.png',alt:'项目商务活动真实工作证',caption:'商务协同现场',kind:'partnership'},
] as const;
const guangdongCapabilities = [
 ['内容生产',Video],['AIGC应用',Layers],['商务协同',BriefcaseBusiness],['项目统筹',BarChart3],
] as const;
const guangdongDutyIcons = [Video, BriefcaseBusiness, BarChart3] as const;
function Guangdong(){
 const reduced=useReducedMotion();
 return <><div className="guangdong-scene" aria-hidden="true"/>
 <div className="guangdong-header"><div className="guangdong-heading"><SectionHeader page={6} en="CONTENT & PROJECT COORDINATION" subtitle="广东省教育服务有限公司上海运营中心"/><Txt id="guangdong-handwriting" as="p" className="guangdong-handwriting">{'用优质内容\n连接更多可能'}</Txt></div><ul className="guangdong-keywords guangdong-glass" aria-label="实践能力分区">{guangdongCapabilities.map(([word,Icon],index)=><li key={word}><Icon aria-hidden="true"/><Txt id={`guangdong-capability-${index}`}>{word}</Txt></li>)}</ul></div>
 <BlurFade className="guangdong-layout" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="guangdong-details">{guangdongDetails.map((item,index)=>{const Icon=guangdongDutyIcons[index];return <article key={item.id} className={`guangdong-card guangdong-glass ${item.id}`} aria-label={item.title}><span className="guangdong-card-icon" aria-hidden="true"><Icon/></span><div className="guangdong-card-body"><div className="guangdong-card-heading"><Txt id={`${item.id}-title`} as="h3">{item.title}</Txt>{item.metric?<Txt id={`${item.id}-metric`} className="guangdong-metric">{item.metric}</Txt>:null}</div><Txt id={item.id} as="p" className="guangdong-copy" highlights={item.highlights}>{item.text}</Txt></div></article>;})}</div>
  <div className="guangdong-evidence" role="group" aria-label="内容运营、图文成果与商务协同真实素材">{guangdongMaterials.map(item=><article key={item.file} className={`guangdong-media guangdong-media-${item.kind}`}><ImageFrame file={item.file} previewFile={item.previewFile} alt={item.alt}/><span className="sr-only">{item.caption}</span></article>)}</div>
 </BlurFade></>;
}

function IPProjects(){
 const reduced=useReducedMotion();
 return <><div className="ip-scene" aria-hidden="true"><img className="ip-planet" src={ipVisual('planet-dome.webp')} alt=""/><img className="ip-orbit" src={ipVisual('crystal-orbit.webp')} alt=""/><img className="ip-stage" src={ipVisual('acrylic-stage.webp')} alt=""/><img className="ip-plinth ip-plinth-left" src={ipVisual('aigc-plinth.webp')} alt=""/><img className="ip-plinth ip-plinth-right" src={ipVisual('ai-ip-badge.webp')} alt=""/></div>
 <div className="ip-header"><SectionHeader page={7} en="AIGC IP DESIGN"/><Txt id="ip-handwriting" as="p" className="ip-handwriting">{'Technology creates\nwarmer characters'}</Txt></div>
 <BlurFade className="ip-dossier" blur="0px" offset={0} duration={reduced?0:.3} initial={reduced?false:{opacity:0}} animate={{opacity:1}}>
  <div className="horse-dossier ip-glass"><div className="dossier-heading"><h3><Txt id="ip-horse-name-law">法小骥</Txt> <Txt id="ip-horse-cross" className="ip-title-cross">×</Txt> <Txt id="ip-horse-name-data">数小骅</Txt></h3><Txt id="ip-horse-subtitle" as="p">上海政法学院国际教育学院 · 马年形象IP</Txt></div><div className="character-sheets">{horseSheets.map((f,i)=><ImageFrame key={f} file={f} alt={'角色三视图与动作延展 '+(i+1)}/>)}</div><div className="expression-wall horse-expressions">{horseExpressions.map(f=><ImageFrame key={f} file={f} alt={f.replace(/\.(jpg|png)$/,'').replaceAll('_',' · ')} small/>)}</div></div>
  <div className="lab-dossier ip-glass"><div className="dossier-heading"><Txt id="ip-lab-title" as="h3">易麟麟</Txt><Txt id="ip-lab-subtitle" as="p">易米实验室IP形象</Txt></div><div className="lab-feature"><ImageFrame file="jimeng-2026-02-04-9724-参考图1生成易小麟的3D立体形象，保持金色系配色和所有设计元素，包括星空眼睛、米....png" alt="易麟麟主形象"/><ImageFrame file="Image (6).png" alt="易米实验室马年IP设计应用海报"/><ImageFrame file="易米实验室丙午马年新年贺卡_调整版.png" alt="易米实验室新年贺卡完整设计"/></div><div className="expression-wall lab-expressions">{labExpressions.map(f=><ImageFrame key={f} file={f} alt={f.replace(/\.png$/,'')} small/>)}</div></div>
 </BlurFade><Txt id="ip-statement" as="div" className="page-statement ip-statement">让 AI 创造更有温度的世界</Txt></>;
}

function Portfolio(){return <PortfolioShowcase/>;}

function Competition(){return <CompetitionResults/>;}

function Ideological(){
 const awards=[
  ['上海政法学院第八届微视频大赛','特等奖 / 第一名','32de8551681256ca4f9004197cd1e5c3.jpg'],
  ['习思想概论课程实践调研大赛','一等奖','9b839e0182bc5d1145a4e351d5d61a26.jpg'],
  ['“感悟历史”实践调研大赛','一等奖','b82fa20664e34226d3aa0ee9e3f53ae5.jpg'],
  ['马克思主义基本原理虚拟实践作品大赛','一等奖','d6f5ab96a2d6175e9fc1be12e04f1cf3.jpg'],
  ['毛概大学生讲思政课大赛','一等奖','b4f8c2f08ff888900018e3a3a649dafa.jpg'],
 ];
 return <>
  <div className="values-scene" aria-hidden="true">
   <img className="values-gold-vignette" src={valuesVisual('gold-vignette.webp')} alt=""/>
   <img className="values-gold-ribbon" src={valuesVisual('gold-ribbon.webp')} alt=""/>
   <img className="values-foliage" src={valuesVisual('foliage-frame.webp')} alt=""/>
  </div>
  <SectionHeader page={10} en="PROFESSION & VALUES"/>
  <div className="values-intro">
   <div className="values-accolade"><Txt id="values-accolade-kicker">思政类赛事</Txt><Txt id="ideology-heading" as="h3">“大满贯”</Txt><Txt id="values-accolade-note" as="small">个人答辩概括</Txt></div>
   <Txt id="ideology-description" as="p" className="values-principle">{'以青年视角讲好时代故事，\n让专业学习与价值表达同频。'}</Txt>
  </div>
  <div className="values-wall">
   {awards.map(([title,award,file],i)=><article key={title} aria-label={title+' · '+award}>
    <img className="values-card-shell" src={valuesVisual('honor-card.webp')} alt="" aria-hidden="true"/>
    <ImageFrame file={file} alt={title+' · '+award+'完整证书'} className="values-certificate"/>
    <div className="values-card-copy">
     <Txt id={`values-award-${i}-index`} className="values-card-index">{`${String(i+1).padStart(2,'0')} / ${award}`}</Txt>
     <Txt id={`values-award-${i}-title`} as="h3">{title}</Txt>
     <p><i aria-hidden="true">❧</i><Txt id={`values-award-${i}-award`}>{award}</Txt><i aria-hidden="true">❧</i></p>
    </div>
   </article>)}
  </div>
  <div className="page-statement"><Txt id="values-page-statement">让专业学习与价值表达同频</Txt><Txt id="values-page-statement-en" as="small">YOUTH CREATES A BRIGHTER TOMORROW</Txt></div>
 </>;
}

function Honors(){return <><SectionHeader page={11} en="HONORS & SCHOLARSHIPS"/><HonorsShowcase/></>;}

function Campus(){return <CampusWork/>;}

function Court(){return <>
 <div className="court-scene" aria-hidden="true">
  <img className="court-camera-books" src={courtVisual('camera-law-books.webp')} alt=""/>
  <img className="court-film-ribbon" src={courtVisual('film-ribbon.webp')} alt=""/>
  <Txt id="court-script-top" className="court-script court-script-top">{'用影像\n记录法治的温度'}</Txt>
  <Txt id="court-script-bottom" className="court-script court-script-bottom">{'影像连接社会\n专业服务人民'}</Txt>
 </div>
 <SectionHeader page={13} en="DOCUMENTING THE RULE OF LAW" subtitle="组织团队走进上海浦东法院，以影像传递法治力量，让更多人看见真实的法治中国。"/>
 <div className="court-dossier" role="group" aria-label="法院合作项目真实发布与报道证据">
  <Mount file={photos.court} alt="《离世界最近的法庭》在天平阳光网发布的完整真实截图" label="01 / 天平阳光网 · 本人作品" className="court-proof court-proof-primary"/>
  <Mount file="20b1729167aee5fa8d56740ddcb054e8.jpg" alt="上海浦东法院发布《离世界最近的法庭》的真实截图" label="02 / 上海浦东法院 · 本人作品" className="court-proof court-proof-publisher"/>
  <Mount file="0c3af48e0e18d91fea9da24d229bf8e7.jpg" alt="学院法院合作相关新闻报道原始素材" label="03 / 合作项目新闻报道" className="court-proof court-proof-report"/>
  <Mount file="18668b0e453ebccedddff2e6dd27084e.jpg" alt="法院合作背景素材《法暖工友》，不是《离世界最近的法庭》，不作为本人导演作品证明" label="合作背景 /《法暖工友》非本片" className="court-proof court-proof-context"/>
 </div>
 <div className="court-summary" role="group" aria-label="项目职责与传播成果">
  <div className="court-summary-card"><span className="court-summary-icon"><BriefcaseBusiness aria-hidden="true"/></span><div><Txt id="court-coordinator-kicker" as="small">上海纪录片学院 × 浦东法院</Txt><Txt id="court-coordinator" as="h3">学生总联络员</Txt><Txt id="court-coordinator-detail" as="p">统筹各组项目进度 · 对接法院老师 · 协助摄制任务落地</Txt></div></div>
  <div className="court-summary-card"><span className="court-summary-icon"><Clapperboard aria-hidden="true"/></span><div><Txt id="court-director-kicker" as="small">《离世界最近的法庭》 / 南汇新城人民法庭</Txt><Txt id="court-director" as="h3">总制片 / 总导演</Txt><Txt id="court-director-detail" as="p">中国法院网、最高院天平阳光网等权威媒体转发</Txt></div></div>
  <div className="court-summary-card court-impact-card"><span className="court-summary-icon"><Video aria-hidden="true"/></span><BigStat id="court-impact" value="10000" suffix="+" label="全平台点播"/></div>
 </div>
 </>;}

function Innovation(){return <>
 <div className="innovation-scene" aria-hidden="true">
  <img className="innovation-floor" src={innovationVisual('floor-ribbon.webp')} alt=""/>
  <Txt id="innovation-script" className="innovation-script">{'Ideas Create\na Better Tomorrow'}</Txt>
 </div>
 <SectionHeader page={14} en="FROM CREATION TO INNOVATION" subtitle="以热爱为起点 · 用技术拓展可能 · 让创意创造价值"/>
 <div className="innovation-grid" role="group" aria-label="创新创业项目">
  <article className="venture venture-film">
   <Txt id="venture-film-kind" className="venture-kind">创业实践项目</Txt>
   <div className="venture-main">
    <ImageFrame file="13a657538261eb62b398f464a769034a.jpg" alt="有戏AIGC视听叙事工作室项目封面" className="venture-cover"/>
    <div className="venture-copy"><Txt id="venture-youxi" as="h3">有戏</Txt><Txt id="venture-youxi-subtitle" as="p" className="venture-subtitle">AIGC视听叙事工作室</Txt><div className="venture-tags">{['AIGC','影视创作','商业内容','视听叙事'].map((tag,index)=><Txt id={`venture-youxi-tag-${index}`} key={tag}>{tag}</Txt>)}</div><Txt id="venture-youxi-description" as="p" className="venture-description">用AI激发影像的想象力，让好故事被更多人看见。</Txt></div>
    <img className="venture-art venture-film-art" src={innovationVisual('film-ai-kit.webp')} alt="" aria-hidden="true"/>
   </div>
   <div className="venture-foot"><Layers aria-hidden="true"/><Txt id="venture-youxi-foot">把创作能力，组织成持续的实践。</Txt></div>
  </article>
  <article className="venture venture-ai">
   <Txt id="venture-ai-kind" className="venture-kind">创业训练项目</Txt>
   <div className="venture-main">
    <ImageFrame file="91f461f9ed9c86aea354d8420e388fef.jpg" alt="简对齐智能求职简历优化系统项目封面" className="venture-cover"/>
    <div className="venture-copy"><Txt id="venture-jianduiqi" as="h3">简对齐</Txt><Txt id="venture-jianduiqi-subtitle" as="p" className="venture-subtitle">智能求职简历优化系统</Txt><div className="venture-tags">{['AI','Agent','简历优化','产品实践'].map((tag,index)=><Txt id={`venture-jianduiqi-tag-${index}`} key={tag}>{tag}</Txt>)}</div><Txt id="venture-jianduiqi-description" as="p" className="venture-description">用AI对齐人与机会，让更合适的你，被更好的世界看见。</Txt></div>
    <img className="venture-art venture-career-art" src={innovationVisual('career-ai-kit.webp')} alt="" aria-hidden="true"/>
   </div>
   <div className="venture-foot"><FileText aria-hidden="true"/><Txt id="venture-jianduiqi-foot">把AI能力，转化为解决问题的工具。</Txt></div>
  </article>
 </div>
 <Txt id="innovation-thesis" as="p" className="innovation-thesis">{'从“用AI创作内容”，\n到“用AI解决问题”。'}</Txt>
 </>;}

function Ending(){return <div className="ending-layout ending-campus-layout">
 <div className="ending-scene" aria-hidden="true">
  <img className="ending-trail" src={endingVisual('paper-plane-trail.webp')} alt=""/>
  <img className="ending-growth-path" src={endingVisual('growth-path-cards.webp')} alt=""/>
  <img className="ending-script ending-script-future" src={endingVisual('future-together.webp')} alt=""/>
  <img className="ending-script ending-script-world" src={endingVisual('wider-world.webp')} alt=""/>
  <img className="ending-script ending-script-image" src={endingVisual('image-connects.webp')} alt=""/>
  <img className="ending-script ending-script-next" src={endingVisual('next-journey.webp')} alt=""/>
  <img className="ending-academy-stone" src={endingVisual('academy-stone.webp')} alt=""/>
  <img className="ending-memory-film" src={endingVisual('memory-film.webp')} alt=""/>
  <img className="ending-lead" src={endingVisual('student-lead.webp')} alt=""/>
  <img className="ending-students" src={endingVisual('students-reaching.webp')} alt=""/>
  <img className="ending-handoff-plane" src={endingVisual('handoff-plane.webp')} alt=""/>
 </div>
 <div className="ending-copy">
  <div className="eyebrow"><span className="gold-rule"/><Txt id="ending-eyebrow">FUTURE PATH &amp; LEGACY</Txt></div>
  <Txt id="ending-title" as="h2">让火炬继续传递</Txt>
  <Txt id="ending-subtitle" as="p" className="ending-subtitle">从被帮助者，到连接更多机会的人</Txt>
 </div>
 <Txt id="ending-credit" as="div" className="ending-credit">2026 / NATIONAL SCHOLARSHIP</Txt>
 </div>;}

const layouts=[Cover,Academic,InterviewOpportunity,Shangmei,Netjoy,Guangdong,IPProjects,Portfolio,Competition,Ideological,Honors,Campus,Court,Innovation,Ending];
export default function SlideContent({index}:{index:number}){const Layout=layouts[index];return <Layout/>;}
