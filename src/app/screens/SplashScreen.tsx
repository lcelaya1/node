import { useEffect } from "react";
import { useNavigate } from "react-router";

const SPLASH_DURATION_MS = 30000;

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/home", { replace: true });
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className="bg-[#ededed] flex h-full items-center justify-center overflow-hidden">
      <div className="node-splash" aria-label="Node splash screen">
        <div className="node-splash__circle node-splash__circle--left">
          <span className="node-splash__circle-word node-splash__circle-word--left">no</span>
        </div>
        <div className="node-splash__circle node-splash__circle--right">
          <span className="node-splash__circle-word node-splash__circle-word--right">de</span>
        </div>
        <div className="node-splash__bridge" />
        <div className="node-splash__pill">
          <span className="node-splash__word node-splash__word--full">node</span>
        </div>
      </div>
    </div>
  );
}
