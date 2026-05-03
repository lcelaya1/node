import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import sendIcon from "../../assets/svg/Send.svg";
import { IconButton } from "../components/IconButton";
import { deleteGroup } from "../lib/groups";
import {
  loadRepeatGroupPlans,
  type RepeatGroupPlan,
} from "../lib/repeatGroupPlans";
import {
  getChatParticipants,
  loadDemoUsers,
  type DemoUser,
} from "../lib/demoUsers";

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
      title: string;
      when: string;
      where: string;
      joinedParticipants: DemoUser[];
    };

type PlanProposalCardProps = {
  title: string;
  when: string;
  where: string;
  joinedParticipants: DemoUser[];
};

function PlanProposalCard({ title, when, where, joinedParticipants }: PlanProposalCardProps) {
  const [response, setResponse] = useState<"in" | "out" | null>(null);

  const joined = joinedParticipants.slice(0, 3);
  const joinedLabel = joined.map((p) => p.name.split(" ")[0]).join(", ");

  return (
    <div className="flex flex-col items-center gap-[10px] w-full">
      <p
        className="font-primary text-[13px] leading-[18px] font-medium"
        style={{ color: "var(--color-button-secondary)" }}
      >
        New plan proposal
      </p>

      <div
        className="w-full rounded-[16px] p-[16px] flex flex-col gap-[16px]"
        style={{ border: "1px solid var(--color-card-token)", backgroundColor: "var(--color-surface-primary)" }}
      >
        {/* Plan info */}
        <div className="flex flex-col gap-[6px]">
          <p className="font-primary text-[20px] leading-[26px] font-semibold tracking-[-0.4px] text-primary-token">
            {title}
          </p>

          <div className="flex items-center gap-[6px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2" width="12" height="11" rx="2" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
              <path d="M1 5H13" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
              <path d="M4 1V3M10 1V3" stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="font-primary text-[13px] leading-[18px] text-secondary-token">{when}</p>
          </div>

          <div className="flex items-center gap-[6px]">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1C4.79 1 3 2.79 3 5C3 8 7 13 7 13C7 13 11 8 11 5C11 2.79 9.21 1 7 1Z" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
              <circle cx="7" cy="5" r="1.5" stroke="var(--color-text-secondary)" strokeWidth="1.2" />
            </svg>
            <p className="font-primary text-[13px] leading-[18px] text-secondary-token">{where}</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-[8px]">
          <button
            type="button"
            onClick={() => setResponse("in")}
            className="flex-1 h-[40px] rounded-[999px] font-primary text-[14px] leading-[20px] font-medium transition-colors"
            style={{
              backgroundColor: response === "in" ? "var(--color-button-secondary)" : "var(--color-button-secondary)",
              color: "var(--color-text-invert)",
              opacity: response === "out" ? 0.4 : 1,
            }}
          >
            I'm in
          </button>
          <button
            type="button"
            onClick={() => setResponse("out")}
            className="flex-1 h-[40px] rounded-[999px] font-primary text-[14px] leading-[20px] font-medium transition-colors"
            style={{
              border: "1.5px solid var(--color-text-primary)",
              backgroundColor: response === "out" ? "var(--color-surface-secondary)" : "transparent",
              color: "var(--color-text-primary)",
              opacity: response === "in" ? 0.4 : 1,
            }}
          >
            Can't make it
          </button>
        </div>

        {/* Joined participants */}
        {joined.length > 0 && (
          <div className="flex items-center gap-[8px]">
            <div className="flex">
              {joined.map((p, i) => (
                <img
                  key={p.seedUserId}
                  src={p.avatarUrl || ""}
                  alt={p.name}
                  className="size-[24px] rounded-full object-cover ring-2 ring-surface-primary"
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                />
              ))}
            </div>
            <p className="font-primary text-[12px] leading-[16px] text-secondary-token">
              {joinedLabel} joined
            </p>
          </div>
        )}
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
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<DemoUser | null>(null);
  const [participants, setParticipants] = useState<DemoUser[]>(state?.participants ?? []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isRepeatGroup = state?.isRepeatGroup === true;

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan",
    when: "Today · 19:17h",
    where: "Azotea del Circulo, Madrid",
  };

  const headerSubtitle = `${participants.length + 1} members active`;
  const dayLabel = plan.when ?? "Today · 19:17h";
  const displayTitle = plan.title ?? "Title of the plan";
  const confirmationImageSrc = state?.imageSrc ?? plan.picturePreview ?? "";

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

  const primaryParticipant = participants[0];
  const secondaryParticipant = participants[1];
  const tertiaryParticipant = participants[2];

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

      // Real group plans → proposal cards
      const groupPlanBlocks: ConversationBlock[] = groupPlans.map((groupPlan) => ({
        type: "plan_proposal",
        title: groupPlan.title,
        when: groupPlan.when ?? "",
        where: groupPlan.where ?? "",
        joinedParticipants: participants.slice(0, 2),
      }));

      // No real plans yet → inject a demo proposal so the first group shows an example
      const demoBlock: ConversationBlock[] =
        groupPlans.length === 0
          ? [
              {
                type: "plan_proposal",
                title: "Title of the plan",
                when: "May 12 · 6pm",
                where: "Location (1.2km)",
                joinedParticipants: participants.slice(0, 2),
              },
            ]
          : [];

      return [...demoBlock, ...baseConversation, ...groupPlanBlocks];
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
  }, [groupPlans, isRepeatGroup, participants, primaryParticipant?.name, secondaryParticipant?.name, tertiaryParticipant?.name]);

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
        className="flex-1 overflow-y-auto px-[20px] pt-[24px]"
        style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
      >
        <p className="type-body-xs text-center text-secondary-token">{dayLabel}</p>

        <div className="mt-[24px] flex flex-col gap-[24px]">
          {conversation.map((block, blockIndex) =>
            block.type === "plan_proposal" ? (
              <PlanProposalCard
                key={`proposal-${blockIndex}`}
                title={block.title}
                when={block.when}
                where={block.where}
                joinedParticipants={block.joinedParticipants}
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
