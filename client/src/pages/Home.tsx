import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  Clock3,
  CreditCard,
  Leaf,
  LockKeyhole,
  Menu,
  QrCode,
  ReceiptText,
  ScanLine,
  ShieldCheck,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Store,
  Weight,
  X,
  Zap,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SmartCartPortal from "@/components/SmartCartPortal";
import Timeline from "@/components/ui/timeline";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: QrCode,
    title: "Scan the trolley",
    description: "Scan its QR code. The store opens instantly on your phone—no app download, no signup queue.",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Shop as you go",
    description: "Scan each product before it goes in. Your digital basket and running total stay up to date.",
  },
  {
    number: "03",
    icon: Weight,
    title: "Every item checks out",
    description: "A discreet load cell verifies the trolley's weight against the items you've scanned.",
  },
  {
    number: "04",
    icon: CreditCard,
    title: "Pay on your phone",
    description: "When you're done, pay in the store's web app. Your receipt is already digital.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "Show your exit pass",
    description: "A QR exit pass confirms your shop. Then walk out—without a checkout stop.",
  },
];

export default function Home() {
  const pageRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.from(".hero-kicker", { y: 12, autoAlpha: 0, duration: 0.55, ease: "power3.out", delay: 0.08 });
      gsap.from(".hero-title", { y: 34, autoAlpha: 0, duration: 0.85, ease: "power3.out", delay: 0.12 });
      gsap.from(".hero-copy-in", { y: 20, autoAlpha: 0, duration: 0.68, stagger: 0.11, ease: "power3.out", delay: 0.38 });
      gsap.from(".hero-visual", { y: 22, scale: 0.985, autoAlpha: 0, duration: 0.9, ease: "power3.out", delay: 0.18 });
      gsap.from(".hero-cart-wrap", { y: 34, rotate: 5, scale: 0.94, autoAlpha: 0, duration: 1.05, ease: "power3.out", delay: 0.42 });
      gsap.to(".hero-cart-wrap", {
        yPercent: -13,
        rotate: -3,
        ease: "none",
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 0.85 },
      });
      gsap.to(".hero-image", {
        scale: 1.055,
        ease: "none",
        scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: 0.9 },
      });

      gsap.utils.toArray<HTMLElement>(".rise-in").forEach((element) => {
        gsap.fromTo(
          element,
          { y: 28, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.72,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main ref={pageRef} className="site-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="SmartCart home" onClick={closeMenu}>
          <span className="brand-mark"><ShoppingBasket size={21} strokeWidth={2.2} /></span>
          <span>smart<span>cart</span></span>
        </a>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#for-stores" onClick={closeMenu}>For stores</a>
          <a href="#scan-portal" onClick={closeMenu}>The scan</a>
          <a href="#journey-intro" onClick={closeMenu}>Our journey</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Book a demo <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="live-dot" /> A smarter way to shop, built for real stores</div>
          <h1 className="hero-title">Queue-free, <em>paperless</em> supermarket checkout.</h1>
          <p className="hero-lede hero-copy-in">Scan the trolley QR. Shop. Pay in the app. <strong>Walk out.</strong></p>
          <p className="hero-support hero-copy-in">The basket keeps up with you, the bill builds as you shop, and checkout becomes the part you skip.</p>
          <div className="hero-actions hero-copy-in">
            <a className="button button-primary" href="#contact">Book a demo <ArrowRight size={17} /></a>
            <a className="button button-quiet" href="#how-it-works"><span className="play-mark"><ArrowDown size={14} /></span> See how it works</a>
          </div>
          <div className="hero-proof hero-copy-in">
            <div className="proof-avatars" aria-hidden="true"><span>S</span><span>G</span><span>+</span></div>
            <p><strong>For the whole shop floor.</strong><br />Easy for shoppers. Built for operators.</p>
          </div>
        </div>

        <div className="hero-visual">
          <img
            className="hero-image"
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=85&w=1800"
            alt="Fresh produce aisle in a modern supermarket"
            fetchPriority="high"
          />
          <div className="hero-image-shade" />
          <div className="hero-cart-wrap" aria-hidden="true">
            <img className="hero-cart-image" src="/manus-storage/cart-3d-photoreal_2fd7d9ba.webp" alt="" loading="eager" />
          </div>
          <div className="image-caption"><span className="caption-pulse" /> THE CHECKOUT THAT MOVES WITH YOU</div>
          <div className="shopper-card">
            <div className="phone-topline"><span>smartcart</span><span className="phone-signal"><span /><span /><span /></span></div>
            <div className="phone-store"><span className="store-icon"><Store size={16} /></span><span><small>SHOPPING AT</small><strong>Northside Market</strong></span><ChevronRight size={16} /></div>
            <div className="phone-divider" />
            <div className="scan-success"><span><Check size={14} /></span><span>Item scanned</span><small>just now</small></div>
            <div className="phone-item"><span className="produce-thumb">🥑</span><span><strong>Ripe avocados</strong><small>Organic · 2 pieces</small></span><b>₹120</b></div>
            <div className="phone-item"><span className="produce-thumb tomato">🍅</span><span><strong>Vine tomatoes</strong><small>Farm fresh · 500 g</small></span><b>₹84</b></div>
            <div className="phone-total"><span>Basket total</span><strong>₹204</strong></div>
            <div className="phone-weight"><Weight size={14} /><span>Weight verified</span><span className="weight-check"><CircleCheck size={14} /> matched</span></div>
          </div>
          <div className="floating-tag"><span className="tag-icon"><ReceiptText size={16} /></span><span><strong>Bill as you shop</strong><small>No surprises at the end</small></span></div>
          <div className="hero-note"><Sparkles size={14} /> A better kind of last mile.</div>
        </div>
      </section>

      <div className="signal-strip" aria-label="SmartCart benefits">
        <div><span className="signal-icon"><Zap size={16} /></span> No queues</div><span className="signal-separator" />
        <div><span className="signal-icon"><ReceiptText size={16} /></span> No paper bills</div><span className="signal-separator" />
        <div><span className="signal-icon"><ShieldCheck size={16} /></span> Built-in verification</div><span className="signal-separator" />
        <div><span className="signal-icon"><Leaf size={16} /></span> Less waste</div>
      </div>

      <section className="contrast-section" id="for-stores">
        <div className="section-heading contrast-heading rise-in">
          <p className="eyebrow eyebrow-light"><span /> THE OLD WAY, RECONSIDERED</p>
          <h2>The line isn’t a feature.<br /><em>It’s the problem.</em></h2>
          <p className="section-intro">A better exit shouldn’t mean more work for shoppers or store teams. SmartCart connects the trolley, the phone, and the store in one simple flow.</p>
        </div>
        <div className="contrast-grid">
          <article className="contrast-card problem-card rise-in">
            <div className="card-topline"><span className="small-label">THE EVERYDAY FRICTION</span><span className="card-symbol problem-symbol">–</span></div>
            <h3>Checkout gets in the way.</h3>
            <ul className="contrast-list problem-list">
              <li><span className="list-marker">01</span><span>Long billing queues at the busiest hours.</span></li>
              <li><span className="list-marker">02</span><span>Forgotten items—and missed scans—at the trolley.</span></li>
              <li><span className="list-marker">03</span><span>Paper bills that are discarded after one look.</span></li>
            </ul>
            <div className="card-footnote"><Clock3 size={15} /> More time spent waiting than shopping.</div>
          </article>
          <article className="contrast-card solution-card rise-in">
            <div className="card-topline"><span className="small-label">A MORE THOUGHTFUL FLOW</span><span className="card-symbol solution-symbol"><Check size={18} /></span></div>
            <h3>Shopping, uninterrupted.</h3>
            <ul className="contrast-list solution-list">
              <li><span className="solution-check"><Check size={13} /></span><span>Build your bill as you shop, on your own phone.</span></li>
              <li><span className="solution-check"><Check size={13} /></span><span>Verify the trolley load against every scanned item.</span></li>
              <li><span className="solution-check"><Check size={13} /></span><span>Use a digital bill and QR pass to leave with confidence.</span></li>
            </ul>
            <a href="#how-it-works" className="text-link">See the flow <ArrowRight size={16} /></a>
          </article>
        </div>
      </section>

      <section className="steps-section" id="how-it-works">
        <div className="section-heading steps-heading rise-in">
          <p className="eyebrow"><span /> FIVE SMALL STEPS. ONE BIG DIFFERENCE.</p>
          <h2>From trolley to <em>ta-da.</em></h2>
          <p className="section-intro">No new habits to learn. Just a smoother version of the shop you already know.</p>
        </div>
        <div className="steps-track">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article className="step-card rise-in" key={step.number}>
                <div className="step-top"><span className="step-number">{step.number}</span><span className="step-icon"><Icon size={19} strokeWidth={1.8} /></span></div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {index < steps.length - 1 && <span className="step-connector" aria-hidden="true"><ArrowRight size={14} /></span>}
              </article>
            );
          })}
        </div>
        <div className="steps-foot rise-in"><span className="soft-check"><Check size={14} /></span> That's it. Your receipt is in the app, and your evening is yours again.</div>
      </section>

      <section className="hardware-section">
        <div className="hardware-intro rise-in">
          <p className="eyebrow eyebrow-light"><span /> SIMPLE HARDWARE. THOUGHTFUL SECURITY.</p>
          <h2>Smart at the base.<br /><em>Secure at the exit.</em></h2>
          <p>One small retrofit makes every trolley part of a smarter checkout—without asking shoppers to do anything differently.</p>
          <div className="hardware-specs">
            <div><span className="spec-icon"><Weight size={17} /></span><strong>Load cells + HX711</strong><small>Weight checked in real time</small></div>
            <div><span className="spec-icon"><Smartphone size={17} /></span><strong>Phone-connected</strong><small>Microcontroller streams to the app</small></div>
            <div><span className="spec-icon"><Zap size={17} /></span><strong>~6 month battery</strong><small>Rechargeable, no trolley wiring</small></div>
          </div>
        </div>
        <div className="security-panel rise-in">
          <div className="security-panel-head"><span className="security-pulse" /><span>LIVE TROLLEY CHECK</span><span className="security-state">ACTIVE</span></div>
          <div className="security-example">
            <div className="security-product"><span className="milk-icon">🥛</span><div><small>JUST SCANNED</small><strong>Milk · 1 litre</strong><span>Expected weight +1.0 kg</span></div><CheckCircle2 size={18} className="expected-check" /></div>
            <div className="weight-meter"><div className="meter-label"><span>TROLLEY WEIGHT</span><b>+1.2 kg</b></div><div className="meter-track"><span /></div><div className="meter-scale"><span>expected +1.0 kg</span><span>verified</span></div></div>
            <div className="security-alert"><span><ShieldCheck size={17} /></span><div><strong>Let's check one more item.</strong><small>That extra 0.2 kg? Identify it before checkout continues.</small></div></div>
          </div>
          <div className="security-panel-foot"><LockKeyhole size={14} /> Extra weight is resolved before a bill can be generated.</div>
        </div>
      </section>

      <section className="reminder-section">
        <div className="reminder-copy rise-in">
          <p className="eyebrow"><span /> A LITTLE HELP BEFORE YOU HEAD HOME</p>
          <h2>Remember the one thing you <em>came for.</em></h2>
          <p>Your past bills can help the store remind you about the staples your household usually needs. Useful for shoppers. A little more complete for stores.</p>
          <div className="reminder-benefits"><span><Check size={14} /> Fewer forgotten staples</span><span><Check size={14} /> More complete baskets</span></div>
        </div>
        <div className="reminder-visual rise-in">
          <div className="reminder-orbit orbit-one" /><div className="reminder-orbit orbit-two" />
          <div className="reminder-widget">
            <div className="widget-header"><span className="widget-brand"><span className="brand-mark mini"><ShoppingBasket size={14} /></span> smartcart</span><span className="widget-more">•••</span></div>
            <div className="widget-greeting"><small>BEFORE YOU CHECK OUT</small><strong>One little reminder</strong></div>
            <div className="atta-reminder"><span className="atta-bag">🌾</span><div><small>YOU USUALLY BUY</small><strong>Atta</strong><span>Looks like it might be missing from your basket.</span></div></div>
            <div className="widget-actions"><button type="button" className="widget-button">Add to basket <ArrowRight size={14} /></button><button type="button" className="widget-dismiss">Not today</button></div>
            <div className="widget-private"><LockKeyhole size={12} /> Based on your past bills</div>
          </div>
          <div className="reminder-sticker"><Sparkles size={15} /> Thought of that, too.</div>
        </div>
      </section>

      <SmartCartPortal />

      <section className="journey-intro" id="journey-intro">
        <div className="journey-intro-inner rise-in">
          <p className="eyebrow eyebrow-light"><span /> BUILT AROUND A BETTER EVERYDAY</p>
          <h2>The SmartCart Journey:<br /><em>Redefining checkout, step by step.</em></h2>
          <p>From the first scan to the final exit pass, every detail is designed to make the store work better for everyone.</p>
          <span className="scroll-hint"><span className="scroll-line" /> KEEP SCROLLING TO EXPLORE</span>
        </div>
      </section>
      <div className="timeline-frame">
        <Timeline
          title="Development Storyline"
          periodLabel="2024 — 2026"
          activeColor="#ff5f00"
          textColor="#f5f1e9"
          mutedTextColor="#aaa69e"
          backgroundColor="#151715"
          imageUrl="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
          imageAlt="Fresh produce at the start of a smarter shopping journey"
        />
      </div>
      <section className="journey-outro">
        <div className="outro-stamp"><ShoppingBasket size={20} /></div>
        <p>THE BEST CHECKOUT IS THE ONE YOU DON’T HAVE TO THINK ABOUT.</p>
        <a href="#contact">Let’s make that the norm <ArrowRight size={16} /></a>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy rise-in">
          <p className="eyebrow"><span /> FOR STORES READY TO MOVE FORWARD</p>
          <h2>Let’s make the<br /><em>last mile</em> feel easy.</h2>
          <p>Bring a quicker exit to your store—with the trolley hardware, digital checkout, and verification working as one.</p>
          <a className="button button-light" href="mailto:hello@smartcart.com?subject=SmartCart%20demo">Book a demo <ArrowUpRight size={17} /></a>
        </div>
        <div className="contact-card rise-in">
          <span className="contact-card-icon"><Store size={20} /></span>
          <p>WHY SMARTCART WINS</p>
          <h3>One system.<br />A better shop.</h3>
          <div className="contact-points"><span><Check size={14} /> No queues</span><span><Check size={14} /> No paper waste</span><span><Check size={14} /> Fewer thefts</span><span><Check size={14} /> Personal reminders</span></div>
          <span className="contact-card-note">For shoppers and store teams alike.</span>
        </div>
      </section>

      <footer className="site-footer" id="privacy">
        <a href="#top" className="brand footer-brand"><span className="brand-mark"><ShoppingBasket size={20} /></span><span>smart<span>cart</span></span></a>
        <p>Good shopping should end at the door, not in a queue.</p>
        <div className="footer-links"><a href="mailto:hello@smartcart.com?subject=Privacy%20question">Privacy</a><a href="mailto:hello@smartcart.com">Contact</a><span>© {new Date().getFullYear()} SmartCart</span></div>
      </footer>
    </main>
  );
}
