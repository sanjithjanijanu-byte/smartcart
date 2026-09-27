"use client";

import { type CSSProperties, useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  tag: string;
  phase: string;
};

const milestones: Milestone[] = [
  {
    year: "2024",
    month: "March",
    title: "The checkout rethink",
    content: "Long queues and paper-heavy billing point to a better last step for grocery shopping.",
    tag: "Concept & Architecture",
    phase: "Phase 01",
  },
  {
    year: "2024",
    month: "November",
    title: "Scan. Add. Keep moving.",
    content: "A trolley QR opens the store experience, so shoppers can build a bill as they browse.",
    tag: "Hardware BLE & QR Flow",
    phase: "Phase 02",
  },
  {
    year: "2025",
    month: "April",
    title: "The weight makes sense",
    content: "Load-cell verification checks what enters the trolley against what was scanned.",
    tag: "Dynamic Load-Cell Sensors",
    phase: "Phase 03",
  },
  {
    year: "2025",
    month: "October",
    title: "A smarter exit check",
    content: "RFID at the gate adds another layer of confidence for stores and their teams.",
    tag: "RFID Security Gate",
    phase: "Phase 04",
  },
  {
    year: "2026",
    month: "February",
    title: "Pay from the basket",
    content: "A digital bill and in-app payment remove the need to queue at a checkout counter.",
    tag: "Integrated Mobile Settlement",
    phase: "Phase 05",
  },
  {
    year: "2026",
    month: "May",
    title: "One pass to head out",
    content: "A QR exit pass connects payment and the final walk-out in one clear flow.",
    tag: "Dynamic QR Exit Pass",
    phase: "Phase 06",
  },
  {
    year: "2026",
    month: "September",
    title: "Remember the regulars",
    content: "Thoughtful reminders can help shoppers catch a staple before they leave the store.",
    tag: "Predictive Cart Intelligence",
    phase: "Phase 07",
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
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const stRef = useRef<ScrollTrigger | null>(null);

  // Check mobile mode on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 860);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP ScrollTrigger setup for desktop
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !stage || !viewport || !track || !progress) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduceMotion) {
      gsap.set(track, { clearProps: "all" });
      gsap.set(progress, { scaleX: 1 });
      if (stRef.current) {
        stRef.current.kill();
        stRef.current = null;
      }
      return;
    }

    const ctx = gsap.context(() => {
      const getDistance = () => {
        return Math.max(0, track.scrollWidth - viewport.clientWidth + 64);
      };

      gsap.set(progress, { transformOrigin: "left center", scaleX: 0 });

      const st = ScrollTrigger.create({
        trigger: section,
        pin: stage,
        start: "top top",
        end: () => `+=${Math.max(getDistance() * 1.1, window.innerHeight * 1.4)}`,
        scrub: 0.6,
        anticipatePin: 1,
        pinSpacing: true,
        invalidateOnRefresh: true,
        refreshPriority: -1,
        onUpdate: (self) => {
          const distance = getDistance();
          const currentX = -self.progress * distance;
          gsap.set(track, { x: currentX });
          gsap.set(progress, { scaleX: self.progress });

          const totalItems = milestones.length + 1;
          const rawIdx = Math.floor(self.progress * totalItems);
          const currentIdx = Math.min(milestones.length, Math.max(0, rawIdx));
          setActiveIndex(currentIdx);
        },
      });

      stRef.current = st;

      const refresh = () => ScrollTrigger.refresh();
      if (document.fonts?.ready) {
        document.fonts.ready.then(refresh);
      }
      const coverImg = section.querySelector("img");
      if (coverImg && !coverImg.complete) {
        coverImg.addEventListener("load", refresh);
      }

      const settleTimer = setTimeout(refresh, 250);

      return () => {
        clearTimeout(settleTimer);
        if (coverImg) coverImg.removeEventListener("load", refresh);
        if (stRef.current) {
          stRef.current.kill();
          stRef.current = null;
        }
      };
    }, section);

    return () => ctx.revert();
  }, [isMobile]);

  // Navigate to specific card index (0: cover, 1..7: milestones)
  const goToCard = useCallback((targetIndex: number) => {
    const totalItems = milestones.length + 1;
    const clamped = Math.max(0, Math.min(totalItems - 1, targetIndex));
    setActiveIndex(clamped);

    if (isMobile) {
      const targetEl = cardRefs.current[clamped];
      if (targetEl && viewportRef.current) {
        targetEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    } else {
      const st = stRef.current;
      if (st) {
        const targetProgress = clamped / (totalItems - 1);
        const targetScroll = st.start + targetProgress * (st.end - st.start);
        window.scrollTo({ top: targetScroll, behavior: "smooth" });
      }
    }
  }, [isMobile]);

  // Mobile horizontal swipe observer to update activeIndex
  useEffect(() => {
    if (!isMobile || !viewportRef.current) return;
    const viewport = viewportRef.current;

    const handleScroll = () => {
      const scrollLeft = viewport.scrollLeft;
      const cardWidth = viewport.clientWidth * 0.85;
      const index = Math.round(scrollLeft / cardWidth);
      const clamped = Math.max(0, Math.min(milestones.length, index));
      setActiveIndex(clamped);
      if (progressRef.current) {
        const progressVal = clamped / milestones.length;
        progressRef.current.style.transform = `scaleX(${progressVal})`;
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  const handlePrev = () => goToCard(activeIndex - 1);
  const handleNext = () => goToCard(activeIndex + 1);

  const sectionStyle = {
    color: textColor,
    backgroundColor,
    "--timeline-accent": activeColor,
    "--timeline-muted": mutedTextColor,
  } as CSSProperties;

  const totalItems = milestones.length + 1;

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
            <p className="sc-timeline-eyebrow">
              <span /> THE SMARTCART STORY
            </p>
            <h2>{title}</h2>
          </div>

          <div className="sc-timeline-controls">
            <span className="sc-timeline-period">{periodLabel}</span>
            <div className="sc-timeline-nav-buttons">
              <button
                type="button"
                className="sc-timeline-nav-btn"
                onClick={handlePrev}
                disabled={activeIndex === 0}
                aria-label="Previous milestone"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="sc-timeline-nav-btn"
                onClick={handleNext}
                disabled={activeIndex >= totalItems - 1}
                aria-label="Next milestone"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div ref={viewportRef} className="sc-timeline-track-clip">
          <div ref={trackRef} className="sc-timeline-track">
            <article
              ref={(el) => { cardRefs.current[0] = el; }}
              className={`sc-timeline-cover ${activeIndex === 0 ? "is-active" : ""}`}
              onClick={() => goToCard(0)}
            >
              <img src={imageUrl} alt={imageAlt} loading="lazy" />
              <div className="sc-timeline-cover-shade" />
              <div className="sc-timeline-cover-copy">
                <span>FROM FIRST SCAN TO EXIT PASS</span>
                <strong>A better way<br />through the store.</strong>
              </div>
            </article>

            {milestones.map((milestone, index) => {
              const cardIndex = index + 1;
              const isActive = activeIndex === cardIndex;
              return (
                <article
                  ref={(el) => { cardRefs.current[cardIndex] = el; }}
                  className={`sc-milestone ${isActive ? "is-active" : ""}`}
                  key={`${milestone.year}-${milestone.month}`}
                  onClick={() => goToCard(cardIndex)}
                >
                  <div className="sc-milestone-top">
                    <div className="sc-milestone-date-chip">
                      <span />
                      {milestone.month} {milestone.year}
                    </div>
                    <span className="sc-milestone-index-chip">
                      0{index + 1} / 0{milestones.length}
                    </span>
                  </div>

                  <div className="sc-milestone-rail">
                    <div
                      className="sc-milestone-rail-fill"
                      style={{ width: activeIndex >= cardIndex ? "100%" : "0%" }}
                    />
                    <span className="sc-milestone-dot" />
                  </div>

                  <div className="sc-milestone-content">
                    <span className="sc-milestone-tag">{milestone.tag}</span>
                    <h3>{milestone.title}</h3>
                    <p className="sc-milestone-description">{milestone.content}</p>
                  </div>

                  <div className="sc-milestone-footer-row">
                    <span className="sc-milestone-phase">{milestone.phase}</span>
                    <span
                      className="sc-milestone-phase"
                      style={{ color: isActive ? "var(--timeline-accent)" : undefined }}
                    >
                      {isActive ? "Active Stage" : "Explore →"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="sc-timeline-footer">
          <div className="sc-timeline-dots" role="tablist" aria-label="Milestone selector">
            <button
              type="button"
              className={`sc-timeline-dot-pill ${activeIndex === 0 ? "is-active" : ""}`}
              onClick={() => goToCard(0)}
              aria-label="Overview cover"
              role="tab"
              aria-selected={activeIndex === 0}
            />
            {milestones.map((m, idx) => (
              <button
                type="button"
                key={`dot-${m.year}-${m.month}`}
                className={`sc-timeline-dot-pill ${activeIndex === idx + 1 ? "is-active" : ""}`}
                onClick={() => goToCard(idx + 1)}
                aria-label={`${m.month} ${m.year}: ${m.title}`}
                role="tab"
                aria-selected={activeIndex === idx + 1}
              />
            ))}
          </div>

          <div className="sc-timeline-progress-wrap">
            <div className="sc-timeline-progress" aria-hidden="true">
              <span ref={progressRef} />
            </div>
            <span>{activeIndex === 0 ? "OVERVIEW" : `0${activeIndex} / 0${milestones.length}`}</span>
          </div>

          <span>
            {isMobile ? "SWIPE HORIZONTALLY TO EXPLORE" : "SCROLL OR CLICK TO EXPLORE"}{" "}
            <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </section>
  );
}
