import { useLocation, useNavigate } from "react-router";
import { IconButton } from "../components/IconButton";
import { AppIcon } from "../components/AppIcon";

type ChatInfoPlanState = {
  plan?: {
    id: number | string;
    title: string;
    date?: string;
    when?: string;
    location?: string;
    where?: string;
  };
  imageSrc?: string;
  selectedIndex?: number;
};

const FALLBACK_IMAGE =
  "https://www.figma.com/api/mcp/asset/cfc93208-7871-4ba9-b2ac-70ad12a5380f";
const avatarImage =
  "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";
const memberAvatarImage =
  "https://www.figma.com/api/mcp/asset/3427220d-ce13-4d46-ba86-8b64004386b7";

function MemberDivider() {
  return (
    <div
      className="h-px w-full"
      style={{ backgroundColor: "var(--color-border-card)" }}
    />
  );
}

type MemberRowProps = {
  label: string;
  imageSrc?: string | null;
};

function MemberRow({ label, imageSrc = null }: MemberRowProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[8px]">
        {imageSrc ? (
          <img
            alt={label}
            className="size-[44px] rounded-full object-cover"
            src={imageSrc}
          />
        ) : (
          <div className="size-[44px] rounded-full bg-surface-secondary" />
        )}
        <p className="type-body-s text-primary-token">{label}</p>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center p-[4px] text-primary-token"
        aria-label={`Open ${label} profile`}
      >
        <AppIcon name="Left" size={20} className="rotate-180" />
      </button>
    </div>
  );
}

export default function ChatInfoPlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ChatInfoPlanState | null) ?? null;

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan will be displayed like this",
    date: "May 12 · 6pm",
    location: "Here will be the location (1.2km)",
  };

  const planDate = (plan.date ?? plan.when ?? "May 12 · 6pm").replace("·", "-");
  const planLocation =
    plan.location ?? plan.where ?? "Here will be the location (1.2km)";
  const imageSrc = state?.imageSrc ?? FALLBACK_IMAGE;
  const mapQuery = encodeURIComponent(planLocation);

  return (
    <div className="relative size-full overflow-y-auto bg-surface-primary">
      <div className="relative h-[380px] overflow-hidden rounded-bl-[16px] rounded-br-[16px]">
        <img
          alt={plan.title}
          className="absolute inset-0 size-full object-cover"
          src={imageSrc}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--primitive-neutral-black) 50%, transparent) 18.37%, transparent 39.173%)",
          }}
        />

        <div className="absolute left-[20px] right-[20px] top-[32px] flex items-start justify-between">
          <IconButton
            aria-label="Back"
            hierarchy="Primary Light"
            icon="Left"
            onClick={() => navigate(-1)}
            size="Mid"
          />
        </div>

        <div className="absolute bottom-[16px] left-[20px] right-[20px]">
          <p className="type-heading-xl text-invert-token">{plan.title}</p>
        </div>
      </div>

      <div
        className="flex flex-col items-start gap-[24px] px-[20px]"
        style={{ paddingTop: "32px", paddingBottom: "40px" }}
      >
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">What?</p>
          <p className="type-body-m text-primary-token">
            Aqui va la descripcion del plan asi como un poco mas larga para que
            parezca que me interesa el plan.
          </p>
          <div className="flex items-center gap-[12px]">
            <div className="flex items-center gap-[4px] text-primary-token">
              <AppIcon name="Calendar" size={16} />
              <span className="type-body-s">{planDate}</span>
            </div>
            <div className="h-[10px] w-px rounded-full bg-surface-secondary" />
            <div className="flex items-center">
              <p className="type-body-s text-primary-token">
                {"Budget  "}
                <span className="text-[12px] leading-[16px] text-primary-token">
                  €
                </span>
                <span className="text-[12px] leading-[16px] text-tertiary-token">
                  €€
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Who?</p>
          <MemberRow label="You" imageSrc={memberAvatarImage} />
          <MemberDivider />
          <MemberRow label="Maria" imageSrc={avatarImage} />
          <MemberDivider />
          <MemberRow label="Laura" />
        </div>

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Where?</p>
          <div className="flex items-center gap-[4px] text-primary-token">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="shrink-0"
              aria-hidden="true"
            >
              <path
                d="M6 10.5C7.8 8.7 9.5 7.15 9.5 5C9.5 3.07 7.93 1.5 6 1.5C4.07 1.5 2.5 3.07 2.5 5C2.5 7.15 4.2 8.7 6 10.5Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="5" r="1.25" stroke="currentColor" />
            </svg>
            <span className="type-body-s">{planLocation}</span>
          </div>
          <div className="h-[185px] w-full overflow-hidden rounded-[16px] border border-card-token bg-surface-secondary">
            <iframe
              title={`Map for ${planLocation}`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
