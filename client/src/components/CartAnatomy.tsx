import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Cpu,
  Weight,
  Smartphone,
  BatteryCharging,
  ShoppingBag,
  Radio,
  ScanLine,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HARDWARE_STAGES = [
  {
    id: "trolley",
    number: "01",
    tag: "Commercial Chassis",
    title: "Standard outside. Industrial inside.",
    body: "Retaining the classic supermarket trolley ergonomics that millions already trust, reinforced with a heavy-duty powder-coated structural steel frame and high-durability polyurethane silent-roll wheels.",
    specs: [
      { label: "Max Load Rating", value: "80 kg" },
      { label: "Wheel Bearings", value: "Double Polyurethane" },
      { label: "Frame Finish", value: "Matte Black Coat" },
    ],
    telemetry: {
      status: "CHASSIS NOMINAL",
      metric: "80 KG MAX LOAD",
      sub: "Structural frame calibrated for store aisles",
    },
    icon: ShoppingBag,
    color: "#ff5f00",
    timeStart: 0,
    timeEnd: 2.0,
  },
  {
    id: "interface",
    number: "02",
    tag: "Smart Interface",
    title: "Your smartphone becomes the register.",
    body: "An ergonomic spring-loaded cradle positions the shopper's phone at eye level. Directly below, an industrial omnidirectional barcode scanner reads product barcodes instantaneously as items pass the handle.",
    specs: [
      { label: "Scan Engine", value: "Omnidirectional CMOS" },
      { label: "Scan Velocity", value: "60 scans / sec" },
      { label: "Cradle Grip", value: "Universal Lock" },
    ],
    telemetry: {
      status: "SCANNER ONLINE",
      metric: "60 FPS DECODE",
      sub: "Instant optical barcode recognition",
    },
    icon: Smartphone,
    color: "#a855f7",
    timeStart: 2.0,
    timeEnd: 4.0,
  },
  {
    id: "load-cells",
    number: "03",
    tag: "Weight Verification",
    title: "Four load cells. Absolute loss prevention.",
    body: "Four hermetically sealed shear-beam load cells are integrated between the basket and base chassis. Every item added is instantly weighed against catalog weights, detecting unverified items before checkout.",
    specs: [
      { label: "Sensors", value: "4x Corner Strain Gauges" },
      { label: "Weight Accuracy", value: "±5 grams" },
      { label: "Latency", value: "< 80 ms" },
    ],
    telemetry: {
      status: "DIFFERENTIAL ACTIVE",
      metric: "±5G PRECISION",
      sub: "Live tare & dual-plane center of mass",
    },
    icon: Weight,
    color: "#06b6d4",
    timeStart: 4.0,
    timeEnd: 6.0,
  },
  {
    id: "compute",
    number: "04",
    tag: "Compute & Signal Core",
    title: "Precision analog frontend meets IoT cloud.",
    body: "The HX711 24-bit analog-to-digital converter amplifies minuscule microvolt load signals with studio-grade signal-to-noise ratio. The onboard microcontroller securely syncs with the store portal over Wi-Fi and RFID.",
    specs: [
      { label: "ADC Resolution", value: "24-Bit Ultra Low Noise" },
      { label: "Processor", value: "Dual-Core ESP32 240MHz" },
      { label: "Telemetry Protocol", value: "Secure WebSocket / RFID" },
    ],
    telemetry: {
      status: "CORE CONNECTED",
      metric: "24-BIT HX711 ADC",
      sub: "Real-time shopper session broadcast",
    },
    icon: Cpu,
    color: "#f59e0b",
    timeStart: 6.0,
    timeEnd: 8.0,
  },
  {
    id: "power",
    number: "05",
    tag: "Power Architecture",
    title: "Six months between charges. Zero downtime.",
    body: "A high-capacity lithium iron polymer battery pack nests flush within the chassis belly. Recharged automatically via magnetic induction floor pads inside the trolley bay overnight, with zero cords or operator handling.",
    specs: [
      { label: "Battery Cell", value: "4000 mAh Industrial LiPo" },
      { label: "Operational Life", value: "180 Days Typical" },
      { label: "Charging Standard", value: "Inductive Floor Dock" },
    ],
    telemetry: {
      status: "BATTERY OPTIMAL",
      metric: "99% SOC · 180 DAYS",
      sub: "Wireless bay induction dock charging",
    },
    icon: BatteryCharging,
    color: "#10b981",
    timeStart: 8.0,
    timeEnd: 10.0,
  },
];

export default function CartAnatomy() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const hudTimeRef = useRef<HTMLDivElement>(null);
  const hudStatusRef = useRef<HTMLSpanElement>(null);
  const hudMetricRef = useRef<HTMLSpanElement>(null);
  const activeDotRef = useRef<HTMLSpanElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const targetTime = useRef(0);
  const rafId = useRef<number | null>(null);

  // Smooth video playback & scroll-scrub interpolation loop
  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // 1. PIN the video stage
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: leftRef.current,
        pinSpacing: false,
      });

      // 2. Video frame scrub linked to section scroll progress
      const duration = video.duration || 10;
      const scrubProxy = { progress: 0 };

      const bindScrollScrubber = () => {
        const vidDuration = video.duration || 10;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            if (!video.paused && isPlaying) return;
            targetTime.current = self.progress * (vidDuration - 0.05);

            // Update top progress rail fill
            if (progressTrackRef.current) {
              progressTrackRef.current.style.transform = `scaleX(${self.progress})`;
            }

            // Update HUD timecode
            if (hudTimeRef.current) {
              const curSec = (self.progress * vidDuration).toFixed(2);
              hudTimeRef.current.textContent = `00:${curSec.padStart(5, "0")} / 00:${vidDuration.toFixed(2)}`;
            }
          },
        });
      };

      if (video.readyState >= 1) {
        bindScrollScrubber();
      } else {
        video.addEventListener("loadedmetadata", bindScrollScrubber, { once: true });
      }

      // RAF loop for buttery smooth sub-frame seeking without stutter
      const renderLoop = () => {
        if (video && video.readyState >= 2 && !video.seeking && video.paused) {
          const delta = targetTime.current - video.currentTime;
          if (Math.abs(delta) > 0.02) {
            video.currentTime += delta * 0.45;
          }
        }
        rafId.current = requestAnimationFrame(renderLoop);
      };
      rafId.current = requestAnimationFrame(renderLoop);

      // 3. Card reveals & chapter transitions
      HARDWARE_STAGES.forEach((stage, i) => {
        const card = cardRefs.current[i];
        if (!card) return;

        if (!reduce) {
          gsap.fromTo(
            card,
            { y: 70, opacity: 0, rotateX: 12, transformPerspective: 900 },
            {
              y: 0,
              opacity: 1,
              rotateX: 0,
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 45%",
          onEnter: () => activateChapter(i),
          onEnterBack: () => activateChapter(i),
        });
      });

      function activateChapter(idx: number) {
        setActiveIdx(idx);
        const stage = HARDWARE_STAGES[idx];

        // Update HUD readouts with smooth micro-animation
        if (hudStatusRef.current) {
          hudStatusRef.current.textContent = stage.telemetry.status;
          hudStatusRef.current.style.color = stage.color;
        }
        if (hudMetricRef.current) {
          hudMetricRef.current.textContent = stage.telemetry.metric;
        }
        if (activeDotRef.current) {
          activeDotRef.current.style.backgroundColor = stage.color;
          activeDotRef.current.style.boxShadow = `0 0 14px ${stage.color}`;
        }
        if (videoContainerRef.current) {
          videoContainerRef.current.style.boxShadow = `0 0 60px ${stage.color}25, 0 25px 60px rgba(0,0,0,0.8)`;
        }
      }

      activateChapter(0);
    },
    { scope: sectionRef }
  );

  // Jump to specific chapter smoothly on pill click
  const jumpToChapter = (idx: number) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const sectionTop = rect.top + scrollTop;
    const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
    const targetScroll = sectionTop + (idx / (HARDWARE_STAGES.length - 1)) * totalScrollable;
    window.scrollTo({ top: targetScroll + 10, behavior: "smooth" });
  };

  // Toggle video tour mode
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const activeStage = HARDWARE_STAGES[activeIdx];

  return (
    <section ref={sectionRef} className="premium-anatomy-section" id="anatomy">
      {/* Dynamic ambient backdrop light */}
      <div
        className="premium-ambient-glow"
        style={{
          background: `radial-gradient(ellipse at 35% 50%, ${activeStage.color}20 0%, transparent 65%)`,
        }}
        aria-hidden="true"
      />

      {/* LEFT: Pinned Cinema Visual Stage */}
      <div ref={leftRef} className="premium-stage-pinned">
        <div className="premium-stage-shell">
          {/* Header Eyebrow & Brand */}
          <div className="premium-stage-topbar">
            <div className="stage-chip">
              <span ref={activeDotRef} className="stage-chip-pulse" />
              <span className="stage-chip-label">SMARTCART HARDWARE ARCHITECTURE</span>
            </div>
            <div className="stage-timecode" ref={hudTimeRef}>
              00:00.00 / 00:10.00
            </div>
          </div>

          {/* Interactive Chapter Selector Pills */}
          <div className="premium-chapter-nav" role="tablist" aria-label="Hardware chapters">
            {HARDWARE_STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const isActive = i === activeIdx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => jumpToChapter(i)}
                  className={`premium-chapter-pill ${isActive ? "is-active" : ""}`}
                  style={
                    isActive
                      ? ({
                          borderColor: `${stage.color}70`,
                          color: "#fff",
                          boxShadow: `0 0 20px ${stage.color}35`,
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Icon size={13} strokeWidth={2} style={isActive ? { color: stage.color } : undefined} />
                  <span>{stage.number}</span>
                  <span className="pill-name">{stage.tag.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Video Display Viewport with Blueprint HUD */}
          <div ref={videoContainerRef} className="premium-video-card">
            {/* Corner Blueprint Markers */}
            <span className="reticle top-left" aria-hidden="true" />
            <span className="reticle top-right" aria-hidden="true" />
            <span className="reticle bottom-left" aria-hidden="true" />
            <span className="reticle bottom-right" aria-hidden="true" />

            {/* Video element */}
            <video
              ref={videoRef}
              src="/cart-scroll.mp4"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              className="premium-scrub-video"
              aria-label="SmartCart 3D hardware breakdown interactive animation"
            />

            {/* Floating Live Telemetry HUD */}
            <div className="premium-hud-overlay" aria-hidden="true">
              <div className="hud-metric-pill">
                <Activity size={14} style={{ color: activeStage.color }} />
                <span ref={hudStatusRef} className="hud-status">
                  {activeStage.telemetry.status}
                </span>
                <span className="hud-divider">|</span>
                <span ref={hudMetricRef} className="hud-value">
                  {activeStage.telemetry.metric}
                </span>
              </div>

              {/* Play / Pause Interactive Tour Mode Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="hud-control-btn"
                title={isPlaying ? "Pause autoplay (return to scroll scrub)" : "Autoplay 3D tour"}
                aria-label={isPlaying ? "Pause autoplay" : "Autoplay 3D tour"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                <span>{isPlaying ? "PAUSE" : "AUTOPLAY"}</span>
              </button>
            </div>
          </div>

          {/* Bottom Rail Scrub Indicator */}
          <div className="premium-scrub-rail" aria-hidden="true">
            <div ref={progressTrackRef} className="rail-fill" style={{ background: activeStage.color }} />
          </div>

          {/* Quick Subtitle / Active Layer Info */}
          <div className="premium-stage-caption">
            <span className="caption-subhead">{activeStage.telemetry.sub}</span>
            <span className="caption-counter">
              PHASE <b>{activeStage.number}</b> OF 05
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: High-Density Editorial Hardware Cards */}
      <div className="premium-cards-scroller">
        {HARDWARE_STAGES.map((stage, i) => {
          const Icon = stage.icon;
          const isActive = i === activeIdx;

          return (
            <div
              key={stage.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className={`premium-hw-card ${isActive ? "is-focused" : ""}`}
              style={{ "--stage-accent": stage.color } as React.CSSProperties}
            >
              {/* Giant background numeral */}
              <div className="card-ambient-numeral" aria-hidden="true">
                {stage.number}
              </div>

              {/* Eyebrow badge */}
              <div className="card-kicker">
                <span className="card-kicker-dot" />
                <Icon size={14} className="card-kicker-icon" />
                <span>{stage.tag}</span>
              </div>

              {/* Main Heading */}
              <h3 className="card-title">{stage.title}</h3>

              {/* Body narrative */}
              <p className="card-description">{stage.body}</p>

              {/* Hardware Micro-Specs Table */}
              <div className="card-specs-grid">
                {stage.specs.map((spec) => (
                  <div key={spec.label} className="spec-cell">
                    <span className="spec-cell-label">{spec.label}</span>
                    <strong className="spec-cell-value">{spec.value}</strong>
                  </div>
                ))}
              </div>

              {/* Bottom Interactive Jump Link */}
              <div className="card-footer-cta">
                <button
                  type="button"
                  onClick={() => jumpToChapter(i)}
                  className="card-scrub-anchor"
                >
                  <span>Focus {stage.tag}</span>
                  <ArrowRight size={14} />
                </button>
                <div className="card-badge-secure">
                  <ShieldCheck size={14} />
                  <span>Hardware verified</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
