import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import gsap from "gsap";

const SPLASH_DURATION_MS = 4500;

export default function SplashScreen() {
  const navigate = useNavigate();
  const splashRef = useRef<HTMLDivElement>(null);
  const blobLeft = useRef<HTMLDivElement>(null);
  const blobRight = useRef<HTMLDivElement>(null);
  const textLeft = useRef<HTMLDivElement>(null);
  const textRight = useRef<HTMLDivElement>(null);
  const textNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Position blobs off-screen. CSS already sets opacity: 0, so no flash
      // on first paint before this useEffect runs.
      gsap.set([blobLeft.current, textLeft.current], { x: -220 });
      gsap.set([blobRight.current, textRight.current], { x: 220 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        // Fade in + fly in together so there's no abrupt pop
        .to(
          [blobLeft.current, textLeft.current],
          { opacity: 1, x: -24, duration: 1.15, ease: "power2.out" },
          0,
        )
        .to(
          [blobRight.current, textRight.current],
          { opacity: 1, x: 24, duration: 1.15, ease: "power2.out" },
          0,
        )
        // Squish on landing
        .to(
          [blobLeft.current, blobRight.current],
          { scaleX: 1.02, scaleY: 0.98, duration: 0.28, yoyo: true, repeat: 1, ease: "sine.inOut" },
          1.02,
        );
    }, splashRef);

    const timeoutId = window.setTimeout(() => {
      navigate("/home", { replace: true });
    }, SPLASH_DURATION_MS);

    return () => {
      ctx.revert();
      window.clearTimeout(timeoutId);
    };
  }, [navigate]);

  return (
    <div className="bg-[#ededed] flex h-full items-center justify-center overflow-hidden">
      <div ref={splashRef} className="node-splash" aria-label="Node splash screen">
        <svg className="node-splash__filter" aria-hidden="true" width="0" height="0">
          {/*
           * x/y/width/height expand the filter region far beyond the element
           * bounds so the Gaussian blur is never clipped while the blobs are
           * flying in from ±220 px outside the container.
           * colorInterpolationFilters="sRGB" keeps colours consistent across
           * Chrome, Safari, and Firefox on both desktop and mobile.
           */}
          <filter
            id="node-goo"
            x="-150%"
            y="-100%"
            width="400%"
            height="300%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </svg>

        <div className="node-splash__goo" aria-hidden="true">
          <div ref={blobLeft} className="node-splash__blob" />
          <div ref={blobRight} className="node-splash__blob" />
        </div>

        <div ref={textLeft} className="node-splash__text-l">no</div>
        <div ref={textRight} className="node-splash__text-r">de</div>
        <div ref={textNode} className="node-splash__text-node">node</div>
      </div>
    </div>
  );
}
