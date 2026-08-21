"use client";

import Image from "next/image";
import { useState } from "react";
import { Arrow } from "../SiteShell";
import { projects } from "../../data/site";
import { TrackedLink } from "../TrackedLink";

export function ProjectStage() {
  const [projectIndex, setProjectIndex] = useState(0);
  const [scene, setScene] = useState(0);
  const project = projects[projectIndex];
  const lumen = project.slug === "lumen-dental-studio";
  const sceneMeta = [
    { label: "Concept project", title: project.title, note: project.industry },
    { label: "Art direction", title: lumen ? "Calm by design" : "Editorial by design", note: lumen ? "Clarity / Trust" : "Typography / Atmosphere" },
    { label: "Responsive experience", title: "Built for every screen", note: "375 → 1920" },
  ];

  const selectProject = (index: number) => { setProjectIndex(index); setScene(0); };

  return <section id="work" className={`project-scroll-stage scene-${scene + 1} ${lumen ? "lumen-project-stage" : ""}`} data-home-section="02" data-nav="work">
    <div className="project-sticky">
      <div className="project-stage-meta" aria-live="polite">
        <div className="featured-project-switch" aria-label="Selected projects">{projects.map((item,index)=><button type="button" className={index===projectIndex?"active":""} onClick={()=>selectProject(index)} key={item.slug}><span>{item.number}</span>{item.title}</button>)}</div>
        <span className="project-stage-count">0{scene + 1} / 03</span>
        <p>{sceneMeta[scene].label}</p>
        <h2>{sceneMeta[scene].title}</h2>
        <small>{sceneMeta[scene].note}</small>
        <div className="project-stage-dots" aria-label="Project views">{sceneMeta.map((item,index)=><button type="button" className={index<=scene?"active":""} aria-label={`Show ${item.title}`} aria-pressed={index===scene} onClick={()=>setScene(index)} key={`${project.slug}-${item.label}`}/>)}</div>
        <div className="project-stage-links"><TrackedLink eventName="case_study_clicked" eventDetail={{project:project.slug,source:"home_stage"}} href={`/work/${project.slug}`}>View case study <Arrow /></TrackedLink>{project.liveUrl&&<TrackedLink eventName="live_demo_clicked" eventDetail={{project:project.slug,source:"home_stage"}} href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live website <Arrow /></TrackedLink>}</div>
      </div>
      <div className="vanta-stage-canvas">
        <button type="button" className="project-stage-arrow previous" onClick={()=>setScene(current=>Math.max(0,current-1))} disabled={scene===0} aria-label="Previous project view"><span aria-hidden="true">‹</span></button>
        <div className="vanta-scene vanta-scene-one"><div className="stage-browser-shell"><div className="browser-bar"><i/><i/><i/><span>{project.title.split(" ")[0].toUpperCase()} / HOME</span></div><Image src={project.desktopImages[0]} alt={`${project.title} homepage`} width={1440} height={1000} sizes="(max-width:768px) 92vw,62vw" /></div></div>
        <div className="vanta-scene vanta-scene-two"><div className="stage-browser-shell alternate"><div className="browser-bar"><i/><i/><i/><span>{project.title.split(" ")[0].toUpperCase()} / ART DIRECTION</span></div><Image src={project.desktopImages[1]} alt={`${project.title} art direction`} width={1440} height={1000} sizes="(max-width:768px) 92vw,58vw" /></div></div>
        <div className="vanta-scene vanta-scene-three"><div className="stage-mobile-pair"><div><Image src={project.mobileImages[0]} alt={`${project.title} mobile homepage`} width={390} height={844} sizes="(max-width:768px) 44vw,16vw" /></div><div><Image src={project.mobileImages[1]} alt={`${project.title} mobile detail`} width={390} height={844} sizes="(max-width:768px) 44vw,16vw" /></div></div></div>
        <button type="button" className="project-stage-arrow next" onClick={()=>setScene(current=>Math.min(2,current+1))} disabled={scene===2} aria-label="Next project view"><span aria-hidden="true">›</span></button>
        <span className="stage-coordinate">Project {project.number} / X 0768 / Y 0430</span>
      </div>
    </div>
    <div className="project-mobile-scenes">{projects.map(item=><article className="mobile-featured-project" key={item.slug}><span>{item.number} / {item.title}</span><div className="mobile-stage-browser"><Image src={item.desktopImages[0]} alt={`${item.title} desktop homepage`} width={1440} height={1000}/></div><div className="mobile-vanta-pair"><Image src={item.mobileImages[0]} alt={`${item.title} mobile homepage`} width={390} height={844}/><Image src={item.mobileImages[1]} alt={`${item.title} mobile detail`} width={390} height={844}/></div><div className="mobile-stage-links"><TrackedLink eventName="case_study_clicked" eventDetail={{project:item.slug,source:"home_mobile_stage"}} href={`/work/${item.slug}`}>View case study <Arrow/></TrackedLink>{item.liveUrl&&<TrackedLink eventName="live_demo_clicked" eventDetail={{project:item.slug,source:"home_mobile_stage"}} href={item.liveUrl} target="_blank" rel="noopener noreferrer">Live website <Arrow/></TrackedLink>}</div></article>)}</div>
  </section>;
}
