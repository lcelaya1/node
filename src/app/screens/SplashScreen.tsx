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
      gsap.set([blobLeft.current, textLeft.current], { x: -220, opacity: 1 });
      gsap.set([blobRight.current, textRight.current], { x: 220, opacity: 1 });
      gsap.set(textNode.current, { opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(
        blobLeft.current,
        { x: -24, duration: 1.15, ease: "power2.out" },
        0,
      )
        .to(
          blobRight.current,
          { x: 24, duration: 1.15, ease: "power2.out" },
          0,
        )
        .to(
          textLeft.current,
          { x: -16, duration: 1.15, ease: "power2.out" },
          0,
        )
        .to(
          textRight.current,
          { x: 16, duration: 1.15, ease: "power2.out" },
          0,
        )
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
          <filter id="node-goo">
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
