import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import sendIcon from "../../assets/svg/Send.svg";
import { IconButton } from "../components/IconButton";
import { BubbleChip } from "../components/SpeechBubbleChip";
import {
  getChatParticipants,
  loadDemoUsers,
  type DemoUser,
} from "../lib/demoUsers";

type ChatPlan = {
  budget?: string;
  creator?: DemoUser | null;
  description?: string;
  id?: string | number;
  title?: string;
  date?: string;
  when?: string;
  location?: string;
  source?: "created" | "joined";
  where?: string;
};

type ChatState = {
  imageSrc?: string;
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

function MessageBubble({
  text,
  time,
  who,
  showTail = true,
}: MessageBubbleProps) {
  const isMe = who === "me";
  const bubbleBackground = isMe
    ? "var(--color-surface-fill)"
    : "var(--color-surface-bg-secondary)";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <BubbleChip
        direction={isMe ? "Right" : "Left"}
        backgroundColor={bubbleBackground}
        horizontalPaddingClassName="px-[12px]"
        multiline
        showPointer={showTail}
        className="relative"
        textClassName="text-primary-token"
      >
        <div className="relative z-[1] flex max-w-[260px] items-end gap-[12px]">
          <p className="type-body-m min-w-0 flex-1 break-words text-left text-primary-token">
            {text}
          </p>
          <span className="shrink-0 text-[10px] leading-[12px] text-primary-token">
            {time}
          </span>
        </div>
      </BubbleChip>
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
    };

export default function ChatScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as ChatState | null) ?? null;
  const [draft, setDraft] = useState("");
  const [participants, setParticipants] = useState<DemoUser[]>(state?.participants ?? []);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const plan = state?.plan ?? {
    id: 1,
    title: "Title of the plan",
    when: "Today · 19:17h",
    where: "Azotea del Circulo, Madrid",
  };

  const headerSubtitle = `${participants.length + 1} members active`;
  const dayLabel = plan.when ?? "Today · 19:17h";
  const displayTitle = plan.title ?? "Title of the plan";

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

  const primaryParticipant = participants[0];
  const secondaryParticipant = participants[1];
  const tertiaryParticipant = participants[2];

  const conversation = useMemo<ConversationBlock[]>(
    () => [
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
    ],
    [primaryParticipant?.name, secondaryParticipant?.name, tertiaryParticipant?.name],
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, []);

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
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-[20px] pt-[24px]"
        style={{ paddingBottom: "calc(100px + env(safe-area-inset-bottom))" }}
      >
        <p className="type-body-xs text-center text-secondary-token">{dayLabel}</p>

        <div className="mt-[24px] flex flex-col gap-[20px]">
          {conversation.map((block, blockIndex) =>
            block.type === "other" ? (
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
                  navigate("/profile", {
                    state: {
                      demoProfile: participant,
                    },
                  });
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
      </div>
    </div>
  );
}
