import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { AppIcon, type IconName } from "../AppIcon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[4px] whitespace-nowrap rounded-[999px] font-['Milling_Trial:Duplex_1mm',sans-serif] text-[16px] leading-[21px] disabled:pointer-events-none outline-none shrink-0",
  {
    variants: {
      variant: {
        // Primary — black pill
        default:
          "bg-[#09090b] text-[#fefefe] disabled:bg-[#a1a1aa] disabled:text-[#e4e4e7]",
        // Secondary — red pill
        secondary:
          "bg-[#fc312e] text-[#fefefe] disabled:bg-[#a1a1aa] disabled:text-[#e4e4e7]",
        // Tertiary — outlined pill
        outline:
          "border border-[#09090b] bg-transparent text-[#09090b] disabled:border-[#a1a1aa] disabled:text-[#a1a1aa]",
        // Link — underline style, no pill
        link: "rounded-none text-[14px] leading-[18px] text-[#71717a] border-b border-[#71717a] px-0 py-0",
        // Ghost for internal flexibility
        ghost:
          "bg-transparent text-[#09090b]",
      },
      size: {
        default: "px-[32px] py-[12px]",
        sm: "px-[24px] py-[8px] text-[14px]",
        lg: "px-[40px] py-[16px]",
        icon: "size-[45px]",
        link: "px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconLeft?: IconName;
    iconRight?: IconName;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size: variant === "link" ? "link" : size, className }))}
      {...props}
    >
      {iconLeft && <AppIcon name={iconLeft} size={20} />}
      {children}
      {iconRight && <AppIcon name={iconRight} size={20} />}
    </Comp>
  );
}

export { Button, buttonVariants };
