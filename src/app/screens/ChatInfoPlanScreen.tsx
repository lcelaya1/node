import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { IconButton } from "../components/IconButton";
import { AppIcon } from "../components/AppIcon";
import {
  getChatParticipants,
  loadDemoUsers,
  type DemoUser,
} from "../lib/demoUsers";
import { deletePlan } from "../lib/plans";
import { loadCatalogPlanById } from "../lib/planCatalog";
import { supabase } from "../lib/supabase";

type ChatInfoPlanState = {
  plan?: {
    budget?: string;
    creator?: DemoUser | null;
    description?: string;
    source?: "created" | "joined";
    id: number | string;
    title: string;
    date?: string;
    when?: string;
    location?: string;
    where?: string;
  };
  imageSrc?: string;
  isCreatedByUser?: boolean;
  participants?: DemoUser[];
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
  onClick?: () => void;
};

function MemberRow({ label, imageSrc = null, onClick }: MemberRowProps) {
  const rowContent = (
    <>
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

      {onClick ? (
        <div className="inline-flex items-center justify-center p-[4px] text-primary-token">
          <AppIcon name="Left" size={20} className="rotate-180" />
        </div>
      ) : null}
    </>
  );

  if (!onClick) {
    return <div className="flex w-full items-center justify-between">{rowContent}</div>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between"
      aria-label={`Open ${label} profile`}
    >
      {rowContent}
    </button>
  );
}

type ConfirmPlanActionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel: string;
  title: string;
  description: string;
  cancelLabel: string;
};

type ProfileBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  user: DemoUser | null;
};

function ProfileBottomSheet({ isOpen, onClose, user }: ProfileBottomSheetProps) {
  if (!isOpen || !user) return null;

  const traitChips =
    user.interests.slice(0, 3).length > 0
      ? user.interests.slice(0, 3)
      : ["Good listener", "Punctual", "Funny"];
  const friendsCount = Number.isFinite(user.friendsCount) ? user.friendsCount : 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.26)]" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-[393px] max-w-full -translate-x-1/2 rounded-tl-[24px] rounded-tr-[24px] bg-[#fefefe]">
        <div className="relative flex size-full flex-col items-center gap-[40px] overflow-clip rounded-[inherit] px-[20px] pb-[32px] pt-[48px]">
          <div className="absolute left-1/2 top-[10px] h-[3px] w-[34px] -translate-x-1/2 rounded-[999px] bg-[#969696]" />

          <div className="flex w-full flex-col items-center gap-[12px] px-[20px]">
            <img
              alt={user.name}
              className="size-[102px] shrink-0 rounded-[51px] object-cover"
              src={user.avatarUrl || memberAvatarImage}
            />
            <div className="flex w-full flex-col items-center gap-[4px]">
              <p className="text-[28px] leading-[36px] text-[#09090b]">
                {user.name}
                {user.age > 0 ? `, ${user.age}` : ""}
              </p>
              <div className="flex items-center gap-[8px] text-[14px] leading-[18px] text-[#71717a]">
                <span>{friendsCount} friends</span>
                <span>·</span>
                <span>{user.plansCreated} plans created</span>
                <span>·</span>
                <span>{user.plansDone} plans done</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-[6px]">
              {traitChips.map((interest) => (
                <span
                  key={interest}
                  className="rounded-[50px] bg-[#f6f6f6] px-[16px] py-[8px] text-[12px] leading-[16px] text-black"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-tl-[24px] rounded-tr-[24px] border border-card-token"
        />
      </div>
    </>
  );
}

function ConfirmPlanActionModal({
  isOpen,
  onClose,
  onConfirm,
  confirmLabel,
  title,
  description,
  cancelLabel,
}: ConfirmPlanActionModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ backgroundColor: "var(--color-overlay-scrim)" }}
        onClick={onClose}
      />
      <div className="fixed inset-x-[20px] bottom-[32px] z-50 mx-auto flex max-w-[353px] flex-col gap-[20px] rounded-[16px] bg-surface-primary p-[20px] shadow-[0px_12px_32px_rgba(9,9,11,0.16)]">
        <div className="flex flex-col gap-[8px]">
          <p className="type-heading-l text-primary-token">{title}</p>
          <p className="type-body-m text-secondary-token">{description}</p>
        </div>

        <div className="flex flex-col gap-[12px]">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[45px] w-full items-center justify-center rounded-[999px] bg-button-secondary"
          >
            <span className="type-body-m text-invert-token">{confirmLabel}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[45px] w-full items-center justify-center rounded-[999px] border border-card-token bg-surface-primary"
          >
            <span className="type-body-m text-primary-token">{cancelLabel}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default function ChatInfoPlanScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ChatInfoPlanState | null) ?? null;
  const [participants, setParticipants] = useState<DemoUser[]>(
    state?.participants ?? [],
  );
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<DemoUser | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [catalogLocation, setCatalogLocation] = useState<string | null>(null);

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan will be displayed like this",
    description: "This plan looks like a strong match for what you selected.",
    date: "May 12 · 6pm",
    location: "Here will be the location (1.2km)",
  };

  const planDate = (plan.date ?? plan.when ?? "May 12 · 6pm").replace("·", "-");
  const rawPlanLocation = plan.location ?? plan.where ?? "";
  const planLocation =
    catalogLocation ||
    rawPlanLocation ||
    "Here will be the location (1.2km)";
  const imageSrc = state?.imageSrc ?? FALLBACK_IMAGE;
  const mapQuery = encodeURIComponent(planLocation);
  const isJoinedPlan =
    state?.isCreatedByUser === true
      ? false
      : plan.source === "created"
        ? false
        : true;
  const isCreatedPlan = state?.isCreatedByUser === true || plan.source === "created";
  const displayParticipants =
    participants.length > 0
      ? participants
      : [
          {
            age: null,
            avatarUrl: avatarImage,
            bio: null,
            city: null,
            name: "Sofia",
            plansCreated: null,
            plansDone: null,
            seedUserId: "demo-1",
          },
          {
            age: null,
            avatarUrl: null,
            bio: null,
            city: null,
            name: "Lucía",
            plansCreated: null,
            plansDone: null,
            seedUserId: "demo-2",
          },
        ];

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (state?.participants?.length) return;
      const users = await loadDemoUsers();
      if (!active) return;
      setParticipants(getChatParticipants(users, plan.creator ?? users[0] ?? null));
    };

    void run();

    return () => {
      active = false;
    };
  }, [plan.creator, state?.participants]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!supabase) return;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (!active || error) return;

      setCurrentUserAvatar(
        typeof data?.avatar_url === "string" && data.avatar_url.trim()
          ? data.avatar_url
          : null,
      );
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      const needsCatalogLocation =
        !rawPlanLocation ||
        rawPlanLocation === "Location (1.2km)" ||
        rawPlanLocation === "Here will be the location (1.2km)";

      if (!isJoinedPlan || !needsCatalogLocation || !plan.id) return;

      try {
        const catalogPlan = await loadCatalogPlanById(plan.id);
        if (!active || !catalogPlan?.location) return;
        setCatalogLocation(catalogPlan.location);
      } catch {
        if (!active) return;
        setCatalogLocation(null);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [isJoinedPlan, plan.id, rawPlanLocation]);

  const handleConfirmCancel = async () => {
    await deletePlan(String(plan.id));
    navigate("/", { replace: true });
  };
  return (
    <>
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
            {plan.description ?? "This plan looks like a strong match for what you selected."}
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
                  {plan.budget ?? "€"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Who?</p>
          <MemberRow
            label="You"
            imageSrc={currentUserAvatar ?? memberAvatarImage}
          />
          {displayParticipants.map((participant) => (
            <div key={participant.seedUserId} className="flex w-full flex-col gap-[8px]">
              <MemberDivider />
              <MemberRow
                label={participant.name}
                imageSrc={participant.avatarUrl}
                onClick={() => {
                  setSelectedParticipant(participant);
                  setIsProfileSheetOpen(true);
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-m-medium text-primary-token">Where?</p>
          <div className="flex items-start gap-[4px] text-primary-token">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="mt-[2px] shrink-0"
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
              className="pointer-events-none h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {isJoinedPlan || isCreatedPlan ? (
          <div className="flex w-full justify-center pt-[8px]">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="type-body-s text-secondary-token underline underline-offset-[4px]"
            >
              {isCreatedPlan ? "Delete plan" : "Cancel plan"}
            </button>
          </div>
        ) : null}
      </div>
      </div>

      <ConfirmPlanActionModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => void handleConfirmCancel()}
        title={isCreatedPlan ? "Delete this plan?" : "Cancel this plan?"}
        description={
          isCreatedPlan
            ? "This plan will be removed from your home and can’t be recovered."
            : "You will leave this plan and it will disappear from your home."
        }
        confirmLabel={isCreatedPlan ? "Yes, delete" : "Yes, cancel"}
        cancelLabel={isCreatedPlan ? "Keep plan" : "Keep plan"}
      />
      <ProfileBottomSheet
        isOpen={isProfileSheetOpen}
        onClose={() => {
          setIsProfileSheetOpen(false);
          setSelectedParticipant(null);
        }}
        user={selectedParticipant}
      />
    </>
  );
}
