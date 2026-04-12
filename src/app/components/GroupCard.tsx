import type { SavedGroup } from "../lib/groups";

const collageSlotsByCount: Record<number, Array<{ left: string; rotation: number; top: string }>> = {
  2: [
    { left: "24px", rotation: -10, top: "37px" },
    { left: "80px", rotation: 2, top: "40.87px" },
  ],
  3: [
    { left: "24px", rotation: -10, top: "18px" },
    { left: "82.87px", rotation: 2, top: "21.87px" },
    { left: "56.98px", rotation: -4, top: "61.98px" },
  ],
  4: [
    { left: "23px", rotation: -10, top: "16px" },
    { left: "81.87px", rotation: 2, top: "19.87px" },
    { left: "80px", rotation: -4, top: "60px" },
    { left: "25px", rotation: 8, top: "60px" },
  ],
};

type GroupCardProps = {
  currentUserAvatar?: string;
  group: SavedGroup;
  onClick: () => void;
};

export function GroupCard({
  currentUserAvatar,
  group,
  onClick,
}: GroupCardProps) {
  const peopleCount = group.participants.length + 1;
  const collageParticipants = [
    ...group.participants.map((participant) => ({
      imageUrl: participant.avatarUrl || undefined,
      name: participant.name,
    })),
    {
      imageUrl: currentUserAvatar,
      name: "You",
    },
  ].slice(0, 4);
  const collageSlots = collageSlotsByCount[peopleCount] ?? collageSlotsByCount[4];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[168px] shrink-0 flex-col rounded-[8px] border border-card-token bg-surface-primary text-left"
    >
      <div className="relative h-[144px] w-full rounded-[8px] bg-surface-secondary">
        {collageParticipants.map((participant, index) => {
          const slot = collageSlots[index];

          return (
            <div
              key={`${group.id}-${participant.name}`}
              className="absolute"
              style={{
                height: "60px",
                left: slot.left,
                top: slot.top,
                width: "60px",
              }}
            >
              <div style={{ transform: `rotate(${slot.rotation}deg)` }}>
                {participant.imageUrl ? (
                  <img
                    alt={participant.name}
                    className="size-[60px] rounded-full border object-cover"
                    style={{ borderColor: "var(--color-surface-bg-primary, #FEFEFE)" }}
                    src={participant.imageUrl}
                  />
                ) : (
                  <div className="flex size-[60px] items-center justify-center rounded-full bg-[#d9d9d9]">
                    <span className="type-body-m text-primary-token">
                      {participant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full p-[12px]">
        <div className="flex flex-col gap-[4px]">
          <p className="type-body-m-medium truncate text-primary-token">{group.title}</p>
          <p className="type-body-xs text-primary-token">{peopleCount} people</p>
        </div>
      </div>
    </button>
  );
}
