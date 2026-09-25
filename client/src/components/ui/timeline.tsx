"use client";

import { type CSSProperties, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollDuration?: number;
};

type Milestone = {
  year: string;
  month: string;
  title: string;
  content: string;
};

const milestones: Milestone[] = [
  {
    year: "2024",
    month: "March",
    title: "The checkout rethink",
    content: "Long queues and paper-heavy billing point to a better last step for grocery shopping.",
  },
  {
    year: "2024",
    month: "November",
    title: "Scan. Add. Keep moving.",
    content: "A trolley QR opens the store experience, so shoppers can build a bill as they browse.",
  },
  {
    year: "2025",
    month: "April",
    title: "The weight makes sense",
    content: "Load-cell verification checks what enters the trolley against what was scanned.",
  },
  {
    year: "2025",
    month: "October",
    title: "A smarter exit check",
    content: "RFID at the gate adds another layer of confidence for stores and their teams.",
  },
  {
    year: "2026",
    month: "February",
    title: "Pay from the basket",
    content: "A digital bill and in-app payment remove the need to queue at a checkout counter.",
  },
  {
    year: "2026",
    month: "May",
    title: "One pass to head out",
    content: "A QR exit pass connects payment and the final walk-out in one clear flow.",
  },
  {
    year: "2026",
    month: "September",
    title: "Remember the regulars",
    content: "Thoughtful reminders can help shoppers catch a staple before they leave the store.",
  },
];

export default function Timeline({
  title = "Development Storyline",
  periodLabel = "2024 — 2026",
  textColor = "#f5f1e9",
  mutedTextColor = "#aaa69e",
  activeColor = "#ff5f00",
  backgroundColor = "#151715",
  imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000",
  imageAlt = "Fresh produce in a modern supermarket",
  duration = 0.85,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !stage || !viewport || !track || !progress) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const context = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(track, { clearProps: "transform" });
        gsap.set(progress, { scaleX: 1 });
        return;
      }

      const revealDuration = Math.min(0.9, Math.max(0.72, duration));
      const tail = { complete: 0 };
      const motion = gsap.timeline({ paused: true })
        .to(track, {
          x: () => -getDistance(),
          ease: "none",
          duration: revealDuration,
        })
        .to(tail, { complete: 1, duration: 1 - revealDuration });

      ScrollTrigger.create({
        trigger: section,
        animation: motion,
        pin: stage,
        start: "top top",
        end: () => `+=${Math.max(getDistance() / revealDuration, window.innerHeight * 1.2)}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
      });

      gsap.set(progress, { transformOrigin: "left center", scaleX: 0 });
      requestAnimationFrame(() => ScrollTrigger.refresh());

    }, section);

    return () => context.revert();
  }, [duration]);

  const sectionStyle = {
    color: textColor,
    backgroundColor,
    "--timeline-accent": activeColor,
    "--timeline-muted": mutedTextColor,
  } as CSSProperties;

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="sc-timeline"
      style={sectionStyle}
      aria-label={`${title}, ${periodLabel}`}
    >
      <div ref={stageRef} className="sc-timeline-stage">
        <div className="sc-timeline-heading">
          <div>
            <p className="sc-timeline-eyebrow"><span /> THE SMARTCART STORY</p>
            <h2>{title}</h2>
          </div>
          <span className="sc-timeline-period">{periodLabel}</span>
        </div>

        <div ref={viewportRef} className="sc-timeline-track-clip">
          <div ref={trackRef} className="sc-timeline-track">
            <article className="sc-timeline-cover">
              <img src={imageUrl} alt={imageAlt} loading="lazy" />
              <div className="sc-timeline-cover-shade" />
              <div className="sc-timeline-cover-copy">
                <span>FROM FIRST SCAN TO EXIT PASS</span>
                <strong>A better way<br />through the store.</strong>
              </div>
            </article>

            {milestones.map((milestone, index) => (
              <article className="sc-milestone" key={`${milestone.year}-${milestone.month}`}>
                <div className="sc-milestone-rail">
                  <span className="sc-milestone-dot" />
                  <span className="sc-milestone-line" />
                </div>
                <div className="sc-milestone-copy">
                  <p className="sc-milestone-date"><span>{String(index + 1).padStart(2, "0")}</span>{milestone.month} {milestone.year}</p>
                  <h3>{milestone.title}</h3>
                  <p className="sc-milestone-description">{milestone.content}</p>
                </div>
                <span className="sc-milestone-index">0{index + 1}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="sc-timeline-footer">
          <span className="sc-timeline-progress"><span ref={progressRef} /></span>
          <span>SCROLL TO FOLLOW THE STORY <span aria-hidden="true">↓</span></span>
        </div>
      </div>
    </section>
  );
}
