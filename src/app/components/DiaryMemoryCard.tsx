import type { PlanMemoryImage } from "../lib/planMemories";

export type DiaryMemoryGroup = {
  createdAt: string;
  description?: string;
  images: PlanMemoryImage[];
  planId: string;
  title: string;
};

function ImageTile({
  image,
  className,
}: {
  image: PlanMemoryImage;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-[10px] ${className ?? ""}`}>
      <img alt={image.name} className="size-full object-cover" src={image.url} />
    </div>
  );
}

function MoreTile({
  count,
  image,
}: {
  count: number;
  image: PlanMemoryImage;
}) {
  return (
    <div className="relative overflow-hidden rounded-[10px]">
      <img alt={image.name} className="size-full object-cover" src={image.url} />
      <div className="absolute inset-0 bg-[rgba(9,9,11,0.7)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-primary text-[16px] leading-[21px] text-invert-token">
          +{count}
        </span>
      </div>
    </div>
  );
}

function MemoryCollage({ images }: { images: PlanMemoryImage[] }) {
  const previewImages = images.slice(0, 5);
  const extraCount = Math.max(images.length - 4, 0);

  if (previewImages.length === 1) {
    return (
      <div className="h-[168px] w-full overflow-hidden rounded-[8px]">
        <img alt={previewImages[0].name} className="size-full object-cover" src={previewImages[0].url} />
      </div>
    );
  }

  if (previewImages.length === 2) {
    return (
      <div className="grid h-[168px] grid-cols-2 gap-[8px]">
        <ImageTile image={previewImages[0]} className="h-full" />
        <ImageTile image={previewImages[1]} className="h-full" />
      </div>
    );
  }

  if (previewImages.length === 3) {
    return (
      <div className="flex h-[168px] gap-[8px]">
        <div className="h-full w-[177px] overflow-hidden rounded-[8px]">
          <img alt={previewImages[0].name} className="size-full object-cover" src={previewImages[0].url} />
        </div>
        <div className="grid h-full w-[168px] grid-rows-2 gap-[8px]">
          <ImageTile image={previewImages[1]} className="h-[80px]" />
          <ImageTile image={previewImages[2]} className="h-[80px]" />
        </div>
      </div>
    );
  }

  if (previewImages.length === 4) {
    return (
      <div className="grid h-[168px] grid-cols-2 grid-rows-2 gap-[8px]">
        {previewImages.map((image) => (
          <ImageTile key={image.id} image={image} className="h-[80px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-[168px] gap-[8px]">
      <div className="h-full w-[177px] overflow-hidden rounded-[8px]">
        <img alt={previewImages[0].name} className="size-full object-cover" src={previewImages[0].url} />
      </div>
      <div className="grid h-full w-[168px] grid-cols-[80px_80px] grid-rows-[80px_80px] gap-[8px]">
        <ImageTile image={previewImages[1]} className="h-[80px]" />
        <ImageTile image={previewImages[2]} className="h-[80px]" />
        <ImageTile image={previewImages[3]} className="h-[80px]" />
        <MoreTile count={extraCount} image={previewImages[4]} />
      </div>
    </div>
  );
}

function formatMemoryDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date of memory registered";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function DiaryMemoryCard({ group }: { group: DiaryMemoryGroup }) {
  return (
    <div className="overflow-hidden rounded-[8px] bg-surface-primary px-[12px] py-[16px] shadow-[0px_4px_28px_0px_rgba(0,0,0,0.15)]">
      <div className="flex flex-col gap-[16px]">
        <p className="type-body-m-medium text-primary-token">{group.title}</p>

        <MemoryCollage images={group.images} />

        <div className="flex w-full flex-col items-start gap-[8px]">
          <p className="type-body-xs text-secondary-token">
            {formatMemoryDate(group.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
