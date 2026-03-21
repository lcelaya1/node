import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./ui/utils";
import { AppIcon, type IconName } from "./AppIcon";

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-[999px] disabled:pointer-events-none outline-none shrink-0",
  {
    variants: {
      hierarchy: {
        Primary:         "bg-[#09090b] text-[#fefefe] disabled:bg-[#a1a1aa]",
        "Primary Light": "bg-[#fefefe] text-[#09090b] disabled:bg-[#e4e4e7]",
        Secondary:       "bg-[#fc312e] text-[#fefefe] disabled:bg-[#a1a1aa]",
        Link:            "bg-transparent text-[#09090b] disabled:text-[#a1a1aa]",
      },
      size: {
        Large: "p-[10px]",
        Mid:   "p-[8px]",
        Small: "p-[6px]",
      },
    },
    defaultVariants: {
      hierarchy: "Primary",
      size: "Large",
    },
  },
);

const iconSize: Record<"Large" | "Mid" | "Small", number> = {
  Large: 24,
  Mid:   20,
  Small: 16,
};

type IconButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof iconButtonVariants> & {
    icon: IconName;
  };

export function IconButton({
  className,
  hierarchy,
  size,
  icon,
  ...props
}: IconButtonProps) {
  const resolvedSize = (size ?? "Large") as "Large" | "Mid" | "Small";

  return (
    <button
      type="button"
      className={cn(iconButtonVariants({ hierarchy, size }), className)}
      {...props}
    >
      <AppIcon name={icon} size={iconSize[resolvedSize]} />
    </button>
  );
}
