import { useEffect, useState } from "react";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import GlyphPortal, { type GlyphPortalStyle } from "@/components/ui/glyph-portal";

const portalStyle: GlyphPortalStyle = {
  "--gp-paper": "#f5f2eb",
  "--gp-ink": "#20221e",
  "--gp-field": "#163b2a",
  "--gp-foreground": "#f5f2eb",
  fontFamily: "Arial, sans-serif",
};

export default function SmartCartPortal() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return (
    <GlyphPortal
      className="smartcart-glyph-portal"
      id="scan-portal"
      word="SCAN"
      focusChar="A"
      scrollLength={2.25}
      interactive
      annotations={false}
      fontFamily="Arial, sans-serif"
      fontWeight={900}
      motionOverride={motionOverride}
      enterLabel="Step into SmartCart"
      style={portalStyle}
      background={
        <div className="smartcart-glyph-background">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=85&w=1800"
            alt=""
            loading="lazy"
          />
          <div className="smartcart-glyph-wash" />
        </div>
      }
      front={
        <>
          <div data-smartcart-portal-header>
            <span data-smartcart-portal-brand><span><ShoppingBasket size={17} /></span> smartcart</span>
            <span data-smartcart-portal-label>THE QUICKER WAY THROUGH THE STORE</span>
          </div>
          <p data-smartcart-portal-eyebrow>A better shopping experience starts small.</p>
          <p data-smartcart-portal-support>One scan opens a smoother shop.</p>
          {reducedMotion ? (
            <button
              data-smartcart-motion
              type="button"
              aria-pressed={motionOverride}
              onClick={() => setMotionOverride((enabled) => !enabled)}
            >
              {motionOverride ? "Scroll reveal enabled" : "Play the scroll reveal"}
            </button>
          ) : (
            <span data-smartcart-portal-scroll>Scroll to see what changes ↓</span>
          )}
        </>
      }
    >
      <div data-smartcart-portal-content>
        <p data-smartcart-portal-kicker>THE WHOLE SHOP. IN ONE SIMPLE FLOW.</p>
        <h2>From your first scan to the walk out, checkout moves at your pace.</h2>
        <div data-smartcart-portal-features>
          <article>
            <span>01</span>
            <h3>Scan to get started</h3>
            <p>Scan the trolley QR to open the store on your phone. No download queue, no extra steps.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Shop with a running total</h3>
            <p>Build your digital basket as you browse, with trolley checks keeping the shop in sync.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Pay, then head out</h3>
            <p>Pay on your phone, show your exit pass, and leave the checkout line behind.</p>
          </article>
        </div>
        <a data-smartcart-portal-cta href="#contact">Bring SmartCart to your store <ArrowRight size={16} /></a>
      </div>
    </GlyphPortal>
  );
}
