import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import sendIcon from "../../assets/svg/Send.svg";
import { IconButton } from "../components/IconButton";
import { formatWhenLineForDisplay } from "../lib/formatPlanWhen";
import { deleteGroup } from "../lib/groups";
import { loadRepeatGroupPlans, type RepeatGroupPlan } from "../lib/repeatGroupPlans";
import {
  getChatParticipants,
  loadDemoUsers,
  type DemoUser,
} from "../lib/demoUsers";
import {
  loadRandomCatalogPlan,
  proposalWhereLabel,
  type CatalogPlan,
} from "../lib/planCatalog";
import { resolveRsvpViewerInCircle, urlsLikelySameAvatar } from "../lib/resolveCircleViewer";
import { getRepeatGroupRsvp, setRepeatGroupRsvp } from "../lib/repeatGroupRsvp";
import { supabase } from "../lib/supabase";

const punteroPath =
  "M22.5439 18.9805H1.5C0.671573 18.9805 0 18.3089 0 17.4805V1.50274C0 0.262595 1.41935 -0.441857 2.40706 0.308072L23.4509 16.2858C24.5954 17.1548 23.9809 18.9805 22.5439 18.9805Z";

type ChatPlan = {
  budget?: string;
  creator?: DemoUser | null;
  description?: string;
  id?: string | number;
  picturePreview?: string;
  title?: string;
  date?: string;
  when?: string;
  location?: string;
  source?: "created" | "joined";
  where?: string;
};

type ChatState = {
  groupId?: string;
  imageSrc?: string;
  isRepeatGroup?: boolean;
  participants?: DemoUser[];
  plan?: ChatPlan;
  selectedIndex?: number;
  /** Quién es “tú” en el círculo (evita depender solo del perfil async). */
  viewerSeedUserId?: number;
};

type MessageBubbleProps = {
  text: string;
  time: string;
  who: "me" | "other";
  showTail?: boolean;
};

function measureTextWidth(text: string, font: string): number {
  if (typeof document === "undefined") return text.length * 8;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return text.length * 8;
  context.font = font;
  return context.measureText(text).width;
}

type BubblePointerProps = {
  fill: string;
  who: "me" | "other";
};

function BubblePointer({ fill, who }: BubblePointerProps) {
  if (who === "me") {
    return (
      <div className="absolute bottom-0 right-[-0.05px] h-[18.98px] w-[24.047px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0468 18.9805">
          <path d={punteroPath} fill={fill} />
        </svg>
      </div>
    );
  }

  return (
    <div className="absolute bottom-0 left-[-0.05px] flex h-[18.98px] w-[24.047px] items-center justify-center">
      <div className="-scale-y-100 rotate-180">
        <div className="relative h-[18.98px] w-[24.047px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24.0468 18.9805">
            <path d={punteroPath} fill={fill} />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  text,
  time,
  who,
  showTail = true,
}: MessageBubbleProps) {
  const isMe = who === "me";
  const textWidthEstimate = measureTextWidth(
    text,
    "400 16px 'ABC Monument Grotesk Unlicensed Trial', sans-serif",
  );
  const timeWidthEstimate = measureTextWidth(
    time,
    "400 10px 'ABC Monument Grotesk Unlicensed Trial', sans-serif",
  );
  const chromeWidth = 52; // paddings (40) + gap (12)
  const contentWidthEstimate = textWidthEstimate + timeWidthEstimate + chromeWidth;
  const singleLineTextLimit = 228 - chromeWidth - timeWidthEstimate;
  const wrapsToTwoLines = textWidthEstimate > singleLineTextLimit;
  const isBig = contentWidthEstimate > 228 || wrapsToTwoLines;
  const isSmall = !isBig;
  const bubbleBackground = isMe ? "#A1A1AA" : "#E4E4E7";
  const bubbleWidthClassName = isBig ? "w-[228px]" : "w-fit max-w-[228px]";
  const fillClassName = isBig
    ? showTail
      ? isMe
        ? "inset-[0_4px_0_0] rounded-[12px]"
        : "inset-[0_0_0_4px] rounded-[12px]"
      : "inset-0 rounded-[12px]"
    : "inset-0 rounded-[64px]";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div className={`relative ${bubbleWidthClassName}`}>
        <div className="relative flex items-end justify-end gap-[12px] px-[20px] py-[8px]">
          <div
            className={`absolute ${fillClassName}`}
            style={{ backgroundColor: bubbleBackground }}
          />
          {showTail ? <BubblePointer fill={bubbleBackground} who={who} /> : null}
          <p className="type-body-m relative z-[1] min-w-0 flex-1 break-words text-left text-primary-token">
            {text}
          </p>
          <span
            className={`shrink-0 text-[10px] leading-[12px] text-primary-token ${isSmall ? "mb-[1px]" : ""} relative z-[1]`}
          >
            {time}
          </span>
        </div>
      </div>
    </div>
  );
}

type ParticipantBlockProps = {
  avatarUrl?: string;
  messages: Array<{ text: string; time: string; showTail?: boolean }>;
  name: string;
  onAvatarClick?: () => void;
};

function ParticipantBlock({
  avatarUrl,
  messages,
  name,
  onAvatarClick,
}: ParticipantBlockProps) {
  return (
    <div className="flex items-end gap-[8px]">
      <button
        type="button"
        onClick={onAvatarClick}
        className="shrink-0"
        aria-label={`Open ${name} profile`}
      >
        <img
          alt={name}
          className="size-[28px] shrink-0 rounded-full object-cover"
          src={
            avatarUrl ||
            "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb"
          }
        />
      </button>
      <div className="flex flex-col items-start gap-[2px]">
        <p className="type-body-xs text-secondary-token">{name}</p>
        <div className="flex flex-col items-start gap-[4px]">
          {messages.map((message, index) => (
            <MessageBubble
              key={`${message.text}-${index}`}
              who="other"
              text={message.text}
              time={message.time}
              showTail={message.showTail ?? index === messages.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

type ConversationBlock =
  | {
      type: "other";
      name: string;
      messages: Array<{ text: string; time: string; showTail?: boolean }>;
    }
  | {
      type: "me";
      messages: Array<{ text: string; time: string; showTail?: boolean }>;
    }
  | {
      type: "plan_proposal";
      /** Quién “envía” la propuesta en el chat. */
      fromParticipant: DemoUser;
      /** Creador del plan: siempre “I'm in”. */
      planCreator: DemoUser;
      /** Tú (para añadirte al pasar a I'm in). */
      viewer: DemoUser | null;
      title: string;
      when: string;
      where: string;
      joinedParticipants: DemoUser[];
      /** Plan guardado desde AddSpecs como “You”: lo muestras tú y sin RSVP para el autor. */
      hideRsvpActions?: boolean;
    };

/**
 * Quién aparece como autor cuando la propuesta **no** es la tuya en persistencia (`createdByName !== "You"`
 * para planes en grupo ya resueltos en `groupPlanBlocks`).
 */
function resolveProposalAuthor(
  participants: DemoUser[],
  options: { createdByName?: string; treatAsMe?: DemoUser | null },
): DemoUser {
  const { createdByName, treatAsMe } = options;
  const trimmedName = createdByName?.trim();

  if (trimmedName) {
    const byName = participants.find((p) => p.name === trimmedName);
    if (byName) return byName;
    /**
     * Fallback raro (p. ej. “You” sin `rsvpViewerUser`). El caso normal lo resuelve `groupPlanBlocks` con `iCreated`.
     */
    if (trimmedName === "You" && treatAsMe?.seedUserId != null) {
      const notMe = participants.filter((p) => p.seedUserId !== treatAsMe.seedUserId);
      if (notMe[0]) return notMe[0];
    }
  }
  if (treatAsMe?.seedUserId != null) {
    const notMe = participants.filter((p) => p.seedUserId !== treatAsMe.seedUserId);
    if (notMe.length > 0) return notMe[0]!;
  }
  return participants[1] ?? participants[0];
}

function joinedStripForProposal(participants: DemoUser[], author: DemoUser): DemoUser[] {
  return participants.filter((p) => p.seedUserId !== author.seedUserId).slice(0, 6);
}

/** Quien creó el plan en UI / servidor (`createdByName` en repeat_group_plans). */
function resolvePlanCreator(
  participants: DemoUser[],
  createdByName: string | undefined,
  treatAsMe: DemoUser | null,
): DemoUser | null {
  const name = createdByName?.trim();
  if (name === "You") return treatAsMe;
  if (name) return participants.find((p) => p.name === name) ?? null;
  return null;
}

type ParticipantPlanProposalBlockProps = {
  title: string;
  when: string;
  where: string;
  joinedParticipants: DemoUser[];
  fromParticipant: DemoUser;
  /** Siempre cuenta como “I'm in” (creador del plan). */
  planCreator: DemoUser;
  /** Usuario actual del chat (tú); aparece al pulsar I'm in. */
  viewer: DemoUser | null;
  /** Avatar real del perfil (Supabase); se muestra al confirmar si no coincide ya con la fila demo. */
  joinedProfileAvatarUrl?: string | null;
  /** Miembros del círculo (para saber si han confirmado todos). */
  circleMembers: DemoUser[];
  /**
   * Tamaño real del repeat (otr@s + tú); evita fallar cuando `circleMembers` se queda corto por resolución de viewer.
   * Debe coincidir con «N people» en My circles (`participants.length + 1`).
   */
  repeatExpectedHeadcount?: number;
  /** Si está definido, persiste I'm in / Can't make it en localStorage por círculo. */
  persistRsvpGroupId?: string;
  hideRsvpActions?: boolean;
  onAvatarClick?: () => void;
};

/** Personas que van — hasta 6 slots solapados + opción de foto de perfil al confirmar RSVP. */
function PlanProposalPeopleGoing({
  participants,
  appendProfileAvatarUrl,
}: {
  participants: DemoUser[];
  appendProfileAvatarUrl?: string | null;
}) {
  const slice = participants.slice(0, 6);
  const appendUrl = appendProfileAvatarUrl?.trim() ?? "";
  const showAppend = Boolean(appendUrl);
  const slotStep = 15;
  const dotSize = 23.28;
  const totalSlots = slice.length + (showAppend ? 1 : 0);

  if (totalSlots === 0) {
    return (
      <div className="relative h-[24px] w-[39.375px] shrink-0" aria-hidden>
        <svg
          className="absolute inset-0 size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 39.375 24"
        >
          <g>
            <circle
              cx="12"
              cy="12"
              r="11.6406"
              fill="var(--primitive-neutral-400)"
              stroke="var(--primitive-neutral-200)"
              strokeWidth="0.71875"
            />
            <circle
              cx="27.375"
              cy="12"
              r="11.6406"
              fill="var(--primitive-neutral-400)"
              stroke="var(--primitive-neutral-200)"
              strokeWidth="0.71875"
            />
          </g>
        </svg>
      </div>
    );
  }

  const trackWidth = dotSize + Math.max(0, totalSlots - 1) * slotStep;

  return (
    <div
      className="relative h-[24px] shrink-0"
      style={{ width: trackWidth }}
      aria-hidden
    >
      {slice.map((p, i) => (
        <div
          key={`${p.seedUserId}-${i}`}
          className="absolute top-1/2 flex size-[23.28px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--primitive-neutral-400)] font-primary text-[10px] font-medium text-[var(--primitive-neutral-50)]"
          style={{
            left: i * slotStep,
            boxShadow: "0 0 0 0.72px var(--primitive-neutral-200)",
          }}
        >
          {p.avatarUrl ? (
            <img alt="" src={p.avatarUrl} className="size-full object-cover" />
          ) : (
            <span>{p.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
      ))}
      {showAppend ? (
        <div
          key="joined-profile-append"
          className="absolute top-1/2 flex size-[23.28px] -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-[var(--primitive-neutral-400)] font-primary text-[10px] font-medium text-[var(--primitive-neutral-50)]"
          style={{
            left: slice.length * slotStep,
            boxShadow: "0 0 0 0.72px var(--primitive-neutral-200)",
          }}
        >
          <img alt="" src={appendUrl} className="size-full object-cover" />
        </div>
      ) : null}
    </div>
  );
}

function ParticipantPlanProposalBlock({
  title,
  when,
  where,
  joinedParticipants,
  fromParticipant,
  planCreator,
  viewer,
  joinedProfileAvatarUrl,
  circleMembers,
  repeatExpectedHeadcount,
  persistRsvpGroupId,
  hideRsvpActions = false,
  onAvatarClick,
}: ParticipantPlanProposalBlockProps) {
  const persistId =
    hideRsvpActions || !persistRsvpGroupId?.trim() ? "" : persistRsvpGroupId.trim();

  const [response, setResponse] = useState<"in" | "out" | null>(() =>
    persistId ? getRepeatGroupRsvp(persistId) : null,
  );

  useEffect(() => {
    setResponse(persistId ? getRepeatGroupRsvp(persistId) : null);
  }, [persistId]);

  const commitResponse = (next: "in" | "out") => {
    setResponse(next);
    if (persistId) setRepeatGroupRsvp(persistId, next);
  };

  const declined = !hideRsvpActions && response === "out";
  const rsvpIn = hideRsvpActions || response === "in";

  /**
   * Fila de avatares: creador + autor + strip “joined”.
   * Tras I'm in se añade **tu** foto al final sin reordenar el resto.
   * Si el perfil te identifica mal con alguien que ya está en la fila pero falta otro miembro del círculo,
   * se usa ese miembro que falta (p. ej. el único que no está en list).
   */
  const goingUsers = useMemo(() => {
    const list: DemoUser[] = [];
    const push = (u: DemoUser | null | undefined) => {
      if (!u) return;
      if (list.some((x) => x.seedUserId === u.seedUserId)) return;
      list.push(u);
    };
    push(planCreator);
    push(fromParticipant);
    joinedParticipants.forEach((p) => push(p));

    if (rsvpIn) {
      const missing = circleMembers.filter((m) => !list.some((x) => x.seedUserId === m.seedUserId));
      let self: DemoUser | null = viewer;
      if (self != null && list.some((x) => x.seedUserId === self.seedUserId)) {
        self =
          missing.find((m) => m.seedUserId === self.seedUserId) ??
          (missing.length === 1 ? missing[0]! : null);
      }
      if (self == null && missing.length === 1) self = missing[0]!;
      if (self != null && !list.some((x) => x.seedUserId === self.seedUserId)) list.push(self);
    }

    return list;
  }, [
    circleMembers,
    fromParticipant,
    hideRsvpActions,
    joinedParticipants,
    planCreator,
    response,
    rsvpIn,
    viewer,
  ]);

  /** Tu plan: un solo avatar (perfil real si hay; sin “append” duplicado). */
  const peopleGoingDisplay = useMemo(() => {
    if (!hideRsvpActions) return goingUsers;
    const u = viewer ?? fromParticipant ?? planCreator;
    if (!u) return [];
    const profile = joinedProfileAvatarUrl?.trim() ?? "";
    if (profile && !urlsLikelySameAvatar(u.avatarUrl ?? "", profile)) {
      return [{ ...u, avatarUrl: profile }];
    }
    return [u];
  }, [
    fromParticipant,
    hideRsvpActions,
    goingUsers,
    joinedProfileAvatarUrl,
    planCreator,
    viewer,
  ]);

  /** Tu foto del perfil al final si es distinta de las URLs demo de la fila (si no, ya “estás” en un círculo). */
  const appendProfileAvatarUrl = useMemo(() => {
    if (!rsvpIn) return null;
    const raw = joinedProfileAvatarUrl?.trim() ?? "";
    if (!raw) return null;
    if (goingUsers.some((u) => urlsLikelySameAvatar(u.avatarUrl ?? "", raw))) return null;
    return raw;
  }, [goingUsers, joinedProfileAvatarUrl, rsvpIn]);

  /**
   * Solo cuando confirmas “I'm in”. Con 2 personas, a veces tú solo salías como foto extra
   * (`appendProfileAvatarUrl`) sin segundo `DemoUser` en la fila, y no se marcaba el círculo completo.
   */
  const wholeCircleIn = useMemo(() => {
    if (circleMembers.length === 0 || declined || !rsvpIn) return false;
    const ids = new Set<number>();
    for (const u of goingUsers) ids.add(u.seedUserId);
    if (viewer != null && Number.isFinite(viewer.seedUserId)) ids.add(viewer.seedUserId);
    if (appendProfileAvatarUrl) {
      const missing = circleMembers.filter((m) => !ids.has(m.seedUserId));
      if (missing.length === 1) ids.add(missing[0]!.seedUserId);
    }
    return circleMembers.every((m) => ids.has(m.seedUserId));
  }, [appendProfileAvatarUrl, circleMembers, declined, goingUsers, rsvpIn, viewer]);

  const statusLabel = useMemo(() => {
    if (hideRsvpActions && !declined) {
      return "Only you have joined";
    }
    if (goingUsers.length === 0 || declined) return "";
    const rowSlots =
      goingUsers.length + (appendProfileAvatarUrl ? 1 : 0);
    const expectTwoRepeat =
      typeof repeatExpectedHeadcount === "number" &&
      repeatExpectedHeadcount === 2;
    if (rsvpIn && expectTwoRepeat && rowSlots >= 2) {
      return "All the circle has joined";
    }
    if (wholeCircleIn && circleMembers.length >= 2) {
      return "All the circle has joined";
    }
    return `${goingUsers.map((p) => p.name.split(" ")[0]).join(", ")} joined`;
  }, [
    appendProfileAvatarUrl,
    circleMembers.length,
    declined,
    goingUsers,
    hideRsvpActions,
    repeatExpectedHeadcount,
    rsvpIn,
    wholeCircleIn,
  ]);

  const proposalAvatarFallback =
    "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb";

  const headerAvatarSrc = useMemo(() => {
    if (hideRsvpActions) {
      const profile = joinedProfileAvatarUrl?.trim();
      if (profile) return profile;
      const v = viewer?.avatarUrl?.trim();
      if (v) return v;
    }
    const u = fromParticipant.avatarUrl?.trim();
    return u || proposalAvatarFallback;
  }, [
    fromParticipant.avatarUrl,
    hideRsvpActions,
    joinedProfileAvatarUrl,
    viewer?.avatarUrl,
  ]);

  return (
    <div
      className={`flex w-full ${hideRsvpActions ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex min-w-0 w-full items-end gap-[8px] ${hideRsvpActions ? "flex-row-reverse" : ""}`}
      >
      <button
        type="button"
        onClick={onAvatarClick}
        className="shrink-0"
        aria-label={
          hideRsvpActions
            ? "Your profile"
            : `Open ${fromParticipant.name} profile`
        }
      >
        <img
          alt={hideRsvpActions ? "You" : fromParticipant.name}
          className="size-[28px] shrink-0 rounded-full object-cover"
          src={headerAvatarSrc}
        />
      </button>
      <div
        className={`flex min-w-0 flex-1 flex-col gap-[4px] ${hideRsvpActions ? "items-end" : "items-start"}`}
      >
        <p className="type-body-xs text-secondary-token">
          {hideRsvpActions ? "You" : fromParticipant.name}
        </p>
        {!hideRsvpActions && !declined ? (
          <p
            className="font-primary text-[13px] leading-[18px] font-medium"
            style={{ color: "var(--color-button-secondary)" }}
          >
            New plan proposal
          </p>
        ) : null}

        <div
          className={`relative w-[276px] max-w-[min(276px,100%)] shrink-0 rounded-[12px] border-[1px] border-solid border-card-token bg-surface-primary p-[16px] transition-opacity ${
            declined ? "pointer-events-none opacity-[0.42] saturate-0" : ""
          }`}
        >
          <div className="relative flex flex-col gap-[16px]">
          {/* Title + meta */}
          <div className="flex w-full flex-col gap-[6px] text-left">
            <p className="font-primary text-[20px] font-semibold leading-[26px] tracking-[-0.4px] text-primary-token">
              {title}
            </p>

            <div className="flex items-center gap-[6px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <rect x="1" y="2" width="12" height="11" rx="2" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
                <path d="M1 5H13" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
                <path d="M4 1V3M10 1V3" stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <p className="font-primary text-[13px] leading-[18px] text-secondary-token">
                {formatWhenLineForDisplay(when)}
              </p>
            </div>

            <div className="flex items-center gap-[6px]">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                <path d="M7 1C4.79 1 3 2.79 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.79 9.21 1 7 1Z" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
                <circle cx="7" cy="5" r="1.5" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
              </svg>
              <p className="font-primary text-[13px] leading-[18px] text-secondary-token">{where}</p>
            </div>
          </div>

          {/* Actions */}
          {!hideRsvpActions && !declined ? (
            <div className="flex gap-[12px]">
              <button
                type="button"
                disabled={declined}
                onClick={() => commitResponse("in")}
                className="type-body-s h-[34px] flex-1 rounded-[999px] border-0 transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--color-button-secondary)",
                  color: "var(--color-text-invert)",
                  opacity: declined ? 0.35 : response === "out" ? 0.4 : 1,
                }}
              >
                {response === "in" ? "You're in" : "I'm in"}
              </button>
              <button
                type="button"
                disabled={declined}
                onClick={() => commitResponse("out")}
                className="type-body-s box-border h-[34px] flex-1 rounded-[999px] border border-solid border-[var(--color-text-primary)] transition-colors disabled:cursor-not-allowed"
                style={{
                  backgroundColor: response === "out" ? "var(--color-surface-secondary)" : "transparent",
                  color: "var(--color-text-primary)",
                  opacity: declined ? 0.35 : response === "in" ? 0.4 : 1,
                }}
              >
                Can't make it
              </button>
            </div>
          ) : null}

          {!declined ? (
            <div className="relative mt-[12px] flex min-h-[24px] w-full items-center gap-[12px] text-left">
              <PlanProposalPeopleGoing
                participants={peopleGoingDisplay}
                appendProfileAvatarUrl={
                  hideRsvpActions ? null : appendProfileAvatarUrl
                }
              />
              <p className="min-w-0 flex-1 font-primary text-[12px] leading-[16px] text-primary-token">
                {statusLabel || "\u00a0"}
              </p>
            </div>
          ) : null}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

type ConfirmCircleActionModalProps = {
  cancelLabel: string;
  confirmLabel: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};


type ProfileBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  user: DemoUser | null;
};

function ProfileBottomSheet({
  isOpen,
  onClose,
  user,
}: ProfileBottomSheetProps) {
  if (!isOpen || !user) return null;

  const vibesByName: Record<string, string[]> = {
    Sofia: ["Adventure seeker", "Always up for plans", "Chill vibes"],
    Marcos: ["Super reliable", "Great energy", "Never cancels"],
    Lucía: ["Good listener", "Spontaneous", "Makes everyone laugh"],
  };
  const traitChips = vibesByName[user.name] ?? ["Funny", "Easy-going", "Always suggests great places"];
  const friendsCount = Number.isFinite(user.friendsCount) ? user.friendsCount : 0;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[rgba(0,0,0,0.26)]" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-[393px] max-w-full -translate-x-1/2 rounded-tl-[24px] rounded-tr-[24px] bg-[#fefefe]">
        <div className="relative flex size-full flex-col items-center gap-[40px] overflow-clip rounded-[inherit] px-[20px] pb-[32px] pt-[48px]">
          <div className="absolute left-1/2 top-[10px] h-[3px] w-[34px] -translate-x-1/2 rounded-[999px] bg-[#969696]" />

          <div className="flex w-full flex-col items-center gap-[12px]">
            <img
              alt={user.name}
              className="size-[102px] shrink-0 rounded-[51px] object-cover"
              src={
                user.avatarUrl ||
                "https://www.figma.com/api/mcp/asset/920565ce-048b-463b-b67c-d2fb3054dbdb"
              }
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
            <div className="flex flex-nowrap items-center justify-center gap-[6px]">
              {traitChips.map((interest) => (
                <span
                  key={interest}
                  className="whitespace-nowrap rounded-[50px] bg-[#f6f6f6] px-[12px] py-[8px] text-[12px] leading-[16px] text-black"
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

function ConfirmCircleActionModal({
  cancelLabel,
  confirmLabel,
  description,
  isOpen,
  onClose,
  onConfirm,
  title,
}: ConfirmCircleActionModalProps) {
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

export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ChatState | null) ?? null;
  const [draft, setDraft] = useState("");
  const [groupPlans, setGroupPlans] = useState<RepeatGroupPlan[]>([]);
  const [randomCatalogProposal, setRandomCatalogProposal] = useState<CatalogPlan | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<DemoUser | null>(null);
  const [participants, setParticipants] = useState<DemoUser[]>(state?.participants ?? []);
  const [viewerProfileAvatar, setViewerProfileAvatar] = useState<string | null>(null);
  const [viewerProfileFullName, setViewerProfileFullName] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRepeatGroup = state?.isRepeatGroup === true;

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan",
    when: "Today · 19:17h",
    where: "Azotea del Circulo, Madrid",
  };

  const dayLabel = plan.when ?? "Today · 19:17h";
  const displayTitle = plan.title ?? "Title of the plan";
  const confirmationImageSrc = state?.imageSrc ?? plan.picturePreview ?? "";

  useEffect(() => {
    let active = true;

    const run = async () => {
      const users = await loadDemoUsers();
      if (!active) return;
      if (state?.participants?.length) {
        const enriched = state.participants.map((sp) => {
          const fresh = users.find((u) => u.seedUserId === sp.seedUserId);
          return fresh ?? sp;
        });
        setParticipants(enriched);
      } else {
        setParticipants(getChatParticipants(users, plan.creator ?? users[0] ?? null));
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [plan.creator, state?.participants]);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!supabase) {
        if (!active) return;
        setViewerProfileAvatar(null);
        setViewerProfileFullName(null);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || !active) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url, full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (!active || error) return;

      const rawAvatar = typeof data?.avatar_url === "string" ? data.avatar_url.trim() : "";
      const rawName = typeof data?.full_name === "string" ? data.full_name.trim() : "";
      setViewerProfileAvatar(rawAvatar || null);
      setViewerProfileFullName(rawName || null);
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const groupId = typeof state?.groupId === "string" ? state.groupId.trim() : "";
    if (!isRepeatGroup || !groupId) return;

    const run = async () => {
      const plans = await loadRepeatGroupPlans(groupId);
      if (!active) return;
      setGroupPlans(plans);
    };

    void run();

    return () => {
      active = false;
    };
  }, [isRepeatGroup, state?.groupId]);

  useEffect(() => {
    if (!isRepeatGroup || groupPlans.length > 0) {
      setRandomCatalogProposal(null);
      return;
    }

    let cancelled = false;
    void loadRandomCatalogPlan().then((plan) => {
      if (!cancelled && plan) setRandomCatalogProposal(plan);
    });

    return () => {
      cancelled = true;
    };
  }, [isRepeatGroup, groupPlans.length]);

  const primaryParticipant = participants[0];
  const secondaryParticipant = participants[1];
  const tertiaryParticipant = participants[2];

  const rsvpViewerUser = useMemo(
    () =>
      resolveRsvpViewerInCircle(
        participants,
        plan.creator,
        viewerProfileAvatar,
        viewerProfileFullName,
        typeof state?.viewerSeedUserId === "number" ? state.viewerSeedUserId : null,
      ),
    [
      participants,
      plan.creator?.seedUserId,
      viewerProfileAvatar,
      viewerProfileFullName,
      state?.viewerSeedUserId,
    ],
  );

  /**
   * Círculo completo para cabecera y RSVP: mismos que `participants` más tú si no vienes en ese array (p. ej. 2 personas pero solo 1 fila guardada → podía impedir “All the circle has joined”).
   */
  const chatCircleMembers = useMemo(() => {
    const out: DemoUser[] = [];
    const seen = new Set<number>();
    const add = (u: DemoUser | null | undefined) => {
      if (u == null || !Number.isFinite(u.seedUserId)) return;
      if (seen.has(u.seedUserId)) return;
      seen.add(u.seedUserId);
      out.push(u);
    };
    participants.forEach(add);
    add(rsvpViewerUser);
    return out;
  }, [participants, rsvpViewerUser]);

  const headerSubtitle = `${chatCircleMembers.length} members active`;

  const conversation = useMemo<ConversationBlock[]>(() => {
    if (isRepeatGroup) {
      const baseConversation: ConversationBlock[] = [
        ...participants.flatMap((participant, index) => [
          {
            type: "other" as const,
            name: participant.name,
            messages: [
              {
                text:
                  index === 0
                    ? "Glad we kept the vibe going."
                    : "I’m happy we matched again.",
                time: `20:4${index}`,
                showTail: true,
              },
            ],
          },
          {
            type: "me" as const,
            messages: [
              {
                text:
                  index === 0
                    ? "Same here. Let’s keep this chat alive."
                    : "Let’s plan something soon.",
                time: `20:4${index}`,
                showTail: true,
              },
            ],
          },
        ]),
      ];

      const treatAsMe = plan.creator ?? null;

      /**
       * Planes persistidos en el grupo.
       * Solo si los guardaste **tú** desde Add Specs (`createdByName === "You"`): te mostramos a ti y sin RSVP.
       * Si `created_by_name` es otro miembro (“Marcos”, etc.) o llega desde otro contexto → autor + RSVP como antes (`resolveProposalAuthor`).
       */
      const groupPlanBlocks: ConversationBlock[] =
        participants.length === 0
          ? []
          : groupPlans.map((groupPlan) => {
              const createdBy = groupPlan.createdByName?.trim();
              /** Planteada por el usuario actual (solo este caso cambia UX; el resto = propuesta ajena). */
              const iCreated =
                createdBy === "You" &&
                rsvpViewerUser != null &&
                Number.isFinite(rsvpViewerUser.seedUserId);

              const author = iCreated
                ? rsvpViewerUser!
                : resolveProposalAuthor(participants, {
                    createdByName: groupPlan.createdByName,
                    treatAsMe: treatAsMe,
                  });
              const planCreator = iCreated
                ? rsvpViewerUser!
                : (resolvePlanCreator(participants, groupPlan.createdByName, treatAsMe) ??
                  treatAsMe ??
                  author);
              return {
                type: "plan_proposal" as const,
                fromParticipant: author,
                planCreator,
                viewer: rsvpViewerUser,
                title: groupPlan.title,
                when: groupPlan.when ?? "",
                where: groupPlan.where ?? "",
                joinedParticipants: joinedStripForProposal(participants, author),
                hideRsvpActions: iCreated,
              };
            });

      /** Demo/catálogo: siempre parece propuesta **de otro** en el hilo → RSVP como siempre (`hideRsvpActions` false). */
      const demoBlock: ConversationBlock[] =
        groupPlans.length === 0 && participants.length > 0
          ? [
              (() => {
                const author = resolveProposalAuthor(participants, { treatAsMe: treatAsMe });
                return {
                  type: "plan_proposal" as const,
                  fromParticipant: author,
                  planCreator: treatAsMe ?? author,
                  viewer: rsvpViewerUser,
                  title: randomCatalogProposal?.title ?? "Title of the plan",
                  when: randomCatalogProposal?.when ?? "May 12 · 6pm",
                  where: randomCatalogProposal
                    ? proposalWhereLabel(
                        randomCatalogProposal.placeName,
                        randomCatalogProposal.distance,
                      )
                    : "Location (1.2km)",
                  joinedParticipants: joinedStripForProposal(participants, author),
                  hideRsvpActions: false,
                };
              })(),
            ]
          : [];

      const planBlocks: ConversationBlock[] = [...demoBlock, ...groupPlanBlocks];
      /** Propuesta no arriba del todo: tras el primer par other+me (p. ej. Marcos + tú), luego el resto del hilo. */
      const splitAt = baseConversation.length >= 2 ? 2 : baseConversation.length;

      return [...baseConversation.slice(0, splitAt), ...planBlocks, ...baseConversation.slice(splitAt)];
    }

    return [
      {
        type: "other",
        name: primaryParticipant?.name ?? "Sofia",
        messages: [{ text: "Hey!", time: "19:41" }],
      },
      {
        type: "me",
        messages: [
          { text: "This is just a try", time: "19:41", showTail: false },
          { text: "Nice to hear from you!", time: "19:41", showTail: true },
        ],
      },
      {
        type: "other",
        name: primaryParticipant?.name ?? "Sofia",
        messages: [
          { text: "Yes", time: "19:42", showTail: false },
          { text: "What’s up?", time: "19:42", showTail: true },
        ],
      },
      {
        type: "me",
        messages: [
          { text: "I was thinking about the rooftop plan.", time: "19:43", showTail: false },
          { text: "Are we still on for tonight?", time: "19:43", showTail: true },
        ],
      },
      {
        type: "other",
        name: secondaryParticipant?.name ?? "Marcos",
        messages: [
          { text: "I’m in too, I can bring the speaker.", time: "19:43", showTail: true },
        ],
      },
      {
        type: "other",
        name: primaryParticipant?.name ?? "Sofia",
        messages: [
          { text: "Yes, absolutely.", time: "19:44", showTail: false },
          { text: "I already booked the table outside.", time: "19:44", showTail: false },
          { text: "The sunset is supposed to be amazing.", time: "19:44", showTail: true },
        ],
      },
      {
        type: "me",
        messages: [
          { text: "Perfect.", time: "19:45", showTail: false },
          { text: "I’ll get there around 8.", time: "19:45", showTail: false },
          { text: `Do you want me to invite ${secondaryParticipant?.name ?? "Lucía"} too?`, time: "19:45", showTail: true },
        ],
      },
      {
        type: "other",
        name: tertiaryParticipant?.name ?? "Lucía",
        messages: [
          { text: "I’m so up for this.", time: "19:46", showTail: false },
          { text: "I’ve been wanting a calmer plan this week.", time: "19:46", showTail: true },
        ],
      },
      {
        type: "me",
        messages: [
          { text: "Great, I’ll text her now.", time: "19:47", showTail: false },
          { text: "Should we eat there too or just drinks?", time: "19:47", showTail: true },
        ],
      },
      {
        type: "other",
        name: primaryParticipant?.name ?? "Sofia",
        messages: [
          { text: "Maybe just drinks first.", time: "19:48", showTail: false },
          { text: "If we’re hungry after, we can move somewhere nearby.", time: "19:48", showTail: true },
        ],
      },
      {
        type: "other",
        name: secondaryParticipant?.name ?? "Marcos",
        messages: [
          { text: "I can get there a bit earlier and save us a spot.", time: "19:48", showTail: true },
        ],
      },
      {
        type: "me",
        messages: [
          { text: "Sounds good to me.", time: "19:49", showTail: false },
          { text: "See you later then!", time: "19:49", showTail: true },
        ],
      },
      {
        type: "other",
        name: primaryParticipant?.name ?? "Sofia",
        messages: [
          { text: "See you!", time: "19:49", showTail: false },
          { text: "And bring a jacket just in case.", time: "19:50", showTail: true },
        ],
      },
    ];
  }, [
    groupPlans,
    isRepeatGroup,
    participants,
    plan.creator?.seedUserId,
    primaryParticipant?.name,
    randomCatalogProposal,
    rsvpViewerUser?.seedUserId,
    secondaryParticipant?.name,
    tertiaryParticipant?.name,
  ]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [conversation]);

  useEffect(() => {
    if (!state?.plan || !plan.source || isRepeatGroup) return;

    const timeoutId = window.setTimeout(() => {
      navigate("/plan-confirmation", {
        replace: true,
        state: {
          imageSrc: confirmationImageSrc,
          plan: {
            id: plan.id,
            title: displayTitle,
          },
          participants,
        },
      });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [confirmationImageSrc, displayTitle, isRepeatGroup, navigate, participants, plan.id, plan.source, state?.plan]);

  const handleLeaveCircle = async () => {
    if (typeof state?.groupId === "string" && state.groupId.trim()) {
      await deleteGroup(state.groupId);
    }

    navigate("/groups", { replace: true });
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-surface-primary">
      <div className="flex items-center justify-between border-b border-card-token px-[20px] py-[12px] pt-[32px]">
        <IconButton
          icon="Left"
          hierarchy="Link"
          size="Mid"
          onClick={() => navigate(-1)}
          aria-label="Back"
        />

        <div className="flex w-[240px] flex-col items-center text-center">
          <p className="type-body-m text-primary-token">{displayTitle}</p>
          <p className="type-body-xs text-secondary-token">{headerSubtitle}</p>
        </div>

        {isRepeatGroup ? <div className="size-[40px]" /> : (
          <IconButton
            icon="Info"
            hierarchy="Link"
            size="Mid"
            onClick={() =>
              navigate("/chat-info", {
                state: {
                  imageSrc: state?.imageSrc,
                  plan: {
                    ...plan,
                    creator: plan.creator ?? primaryParticipant ?? null,
                    id: plan.id ?? 1,
                    title: displayTitle,
                  },
                  participants,
                  selectedIndex: state?.selectedIndex ?? 0,
                },
              })
            }
            aria-label="Plan info"
          />
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-[20px] pt-[24px]"
        style={{
          paddingBottom: isRepeatGroup
            ? "calc(154px + env(safe-area-inset-bottom))"
            : "calc(100px + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex min-h-full flex-col justify-end">
          <p className="type-body-xs text-center text-secondary-token">{dayLabel}</p>

          <div className="mt-[24px] flex flex-col gap-[24px]">
            {conversation.map((block, blockIndex) =>
              block.type === "plan_proposal" ? (
                <ParticipantPlanProposalBlock
                  key={`proposal-${blockIndex}`}
                  fromParticipant={block.fromParticipant}
                  planCreator={block.planCreator}
                  viewer={block.viewer}
                  joinedProfileAvatarUrl={viewerProfileAvatar}
                  circleMembers={chatCircleMembers}
                  repeatExpectedHeadcount={
                    isRepeatGroup ? participants.length + 1 : undefined
                  }
                  persistRsvpGroupId={
                    isRepeatGroup &&
                    !(block.hideRsvpActions ?? false) &&
                    typeof state?.groupId === "string" &&
                    state.groupId.trim()
                      ? state.groupId.trim()
                      : undefined
                  }
                  hideRsvpActions={block.hideRsvpActions ?? false}
                  title={block.title}
                  when={block.when}
                  where={block.where}
                  joinedParticipants={block.joinedParticipants}
                  onAvatarClick={() => {
                    setSelectedParticipant(block.fromParticipant);
                    setIsProfileSheetOpen(true);
                  }}
                />
              ) : block.type === "other" ? (
                <ParticipantBlock
                  key={`${block.name}-${blockIndex}`}
                  avatarUrl={
                    participants.find((participant) => participant.name === block.name)
                      ?.avatarUrl
                  }
                  name={block.name}
                  messages={block.messages}
                  onAvatarClick={() => {
                    const participant = participants.find(
                      (entry) => entry.name === block.name,
                    );
                    if (!participant) return;
                    setSelectedParticipant(participant);
                    setIsProfileSheetOpen(true);
                  }}
                />
              ) : (
                <div key={`me-${blockIndex}`} className="flex flex-col items-end gap-[4px]">
                  {block.messages.map((message, index) => (
                    <MessageBubble
                      key={`${message.text}-${index}`}
                      who="me"
                      text={message.text}
                      time={message.time}
                      showTail={message.showTail}
                    />
                  ))}
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 z-10 bg-surface-primary px-[20px] pt-[12px] pb-[32px]"
        style={{ paddingBottom: "calc(32px + env(safe-area-inset-bottom))" }}
      >
        <div className="flex flex-col gap-[12px]">
          {isRepeatGroup ? (
            <div className="flex w-full items-start gap-[12px]">
              <button
                type="button"
                className="flex shrink-0 items-center justify-center rounded-[999px] bg-[#09090b] p-[10px]"
                aria-label="Add"
                onClick={() =>
                  navigate("/add-specs", {
                    state: {
                      groupPlanContext: {
                        groupId: state?.groupId,
                        imageSrc: state?.imageSrc,
                        participants,
                        plan,
                        selectedIndex: state?.selectedIndex ?? 0,
                      },
                    },
                  })
                }
              >
                <span aria-hidden="true" className="relative block size-[24px]">
                  <span className="absolute left-1/2 top-1/2 h-[12px] w-[1.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fefefe]" />
                  <span className="absolute left-1/2 top-1/2 h-[1.5px] w-[12px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fefefe]" />
                </span>
              </button>

              <div className="min-w-0 flex-1 rounded-[999px] border border-card-token bg-surface-primary px-[17px] py-[11px]">
                <div className="flex items-center gap-[8px]">
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message..."
                    className="type-body-m min-w-0 flex-1 bg-transparent text-primary-token outline-none placeholder:text-tertiary-token"
                  />
                  <button
                    type="button"
                    className="inline-flex size-[21px] items-center justify-center text-primary-token"
                    aria-label="Send message"
                  >
                    <img alt="" aria-hidden="true" className="size-[21px]" src={sendIcon} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[999px] border border-card-token bg-surface-primary px-[17px] py-[11px]">
              <div className="flex items-center gap-[8px]">
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message..."
                  className="type-body-m min-w-0 flex-1 bg-transparent text-primary-token outline-none placeholder:text-tertiary-token"
                />
                <button
                  type="button"
                  className="inline-flex size-[21px] items-center justify-center text-primary-token"
                  aria-label="Send message"
                >
                  <img alt="" aria-hidden="true" className="size-[21px]" src={sendIcon} />
                </button>
              </div>
            </div>
          )}

          {isRepeatGroup ? (
            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="type-body-s self-center text-secondary-token underline underline-offset-[6px]"
            >
              Leave circle
            </button>
          ) : null}
        </div>
      </div>

      <ConfirmCircleActionModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => void handleLeaveCircle()}
        confirmLabel="Leave circle"
        title="Leave this circle?"
        description="You’ll leave this circle and it will disappear from your circles list."
        cancelLabel="Keep circle"
      />

      <ProfileBottomSheet
        isOpen={isProfileSheetOpen}
        onClose={() => setIsProfileSheetOpen(false)}
        user={selectedParticipant}
      />
    </div>
  );
}
