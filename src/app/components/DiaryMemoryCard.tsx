import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import type { PlanMemoryImage } from "../lib/planMemories";

export type DiaryMemoryGroup = {
  createdAt: string;
  description?: string;
  images: PlanMemoryImage[];
  planId: string;
  title: string;
};

function MemoryCarousel({ images }: { images: PlanMemoryImage[] }) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    // Always start from the beginning when feed mounts/remounts.
    node.scrollLeft = 0;
  }, [images]);

  return (
    <div
      ref={scrollRef}
      className="-mx-[12px] flex w-auto gap-[12px] overflow-x-auto px-[12px] pb-[2px]"
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="h-[168px] w-[150px] shrink-0 overflow-hidden rounded-[16px] bg-surface-secondary"
        >
          <img alt={image.name} className="size-full object-cover" src={image.url} />
        </div>
      ))}
    </div>
  );
}

function formatMemoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date of Memory Registered";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function MemoryCaptionBlock({
  createdAt,
  description,
}: {
  createdAt: string;
  description?: string;
}) {
  const body = description?.trim();

  return (
    <div className="relative flex w-full max-w-[329px] shrink-0 flex-col items-start justify-center gap-[8px]">
      {body ? (
        <div className="flex min-w-0 w-full shrink-0 flex-col justify-center text-primary-token">
          <p className="type-body-m line-clamp-2 break-words">{body}</p>
        </div>
      ) : null}
      <div className="flex shrink-0 flex-col justify-center text-secondary-token">
        <p className="type-body-s whitespace-nowrap">{formatMemoryDate(createdAt)}</p>
      </div>
    </div>
  );
}

export function DiaryMemoryCard({
  calendarReturnDayKey,
  group,
  routerState,
}: {
  group: DiaryMemoryGroup;
  /** Datos completos para `location.state` al abrir el detalle (p. ej. modal del calendario con fotos solo de ese día). */
  routerState?: DiaryMemoryGroup;
  /** `YYYY-MM-DD` — si viene del modal del calendario, el detalle puede volver y reabrir ese día. */
  calendarReturnDayKey?: string;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="block w-full shrink-0 cursor-pointer overflow-hidden rounded-[16px] border border-card-token bg-surface-primary p-[16px] text-left outline-none transition-opacity active:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      onClick={() =>
        navigate(`/diary/memory/${encodeURIComponent(group.planId)}`, {
          state: {
            group: routerState ?? group,
            ...(calendarReturnDayKey ? { diaryReopenCalendarDay: calendarReturnDayKey } : {}),
          },
        })
      }
    >
      <div className="flex flex-col gap-[20px]">
        <p className="type-heading-m text-primary-token">{group.title}</p>

        <MemoryCarousel images={group.images} />

        <MemoryCaptionBlock createdAt={group.createdAt} description={group.description} />
      </div>
    </button>
  );
}
