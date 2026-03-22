import { useEffect } from "react";
import { useNavigate } from "react-router";
import Lottie from "lottie-react";
import animationData from "@/assets/animation.json";

const SPLASH_DURATION_MS = 4500;

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      navigate("/", { replace: true });
    }, SPLASH_DURATION_MS);

    return () => window.clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div
      className="flex h-full items-center justify-center overflow-hidden bg-surface-primary"
      style={{
        height: "calc(100% + env(safe-area-inset-bottom))",
        marginBottom: "calc(env(safe-area-inset-bottom) * -1)",
      }}
    >
      <div className="node-splash" aria-label="Node splash screen">
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={true}
          rendererSettings={{
            // slice fills the full screen; the canvas is already full-screen
            // sized (720×1603) so no content is cropped
            preserveAspectRatio: "xMidYMid slice",
            // Render at device pixel ratio so retina screens (2x/3x) stay sharp
            dpr: typeof window !== "undefined" ? window.devicePixelRatio : 2,
          }}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
