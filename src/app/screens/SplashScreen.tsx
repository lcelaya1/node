import logoNode from "../../assets/svg/Logo Node.svg";

export const SPLASH_DURATION_MS = 3000;

export default function SplashScreen() {
  return (
    <div
      className="flex size-full flex-col items-start bg-surface-primary pb-[32px]"
      style={{
        minHeight: "100%",
      }}
    >
      <div className="flex h-full w-full min-h-0 min-w-0 flex-1 flex-col items-center justify-center px-[24px] pt-[32px]">
        <div className="flex w-full items-center justify-center">
          <img
            alt="Node"
            className="h-[64.8px] w-[180px]"
            src={logoNode}
          />
        </div>
      </div>
    </div>
  );
}
