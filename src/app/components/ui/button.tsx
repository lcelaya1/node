import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";
import { AppIcon, type IconName } from "../AppIcon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[4px] whitespace-nowrap rounded-[999px] font-primary text-[16px] leading-[21px] disabled:pointer-events-none outline-none shrink-0",
  {
    variants: {
      variant: {
        // Primary — black pill
        default:
          "bg-button-primary text-invert-token disabled:bg-surface-fill disabled:text-secondary-token",
        // Secondary — red pill
        secondary:
          "bg-button-secondary text-invert-token disabled:bg-surface-fill disabled:text-secondary-token",
        // Tertiary — outlined pill
        outline:
          "border border-selected-token bg-transparent text-primary-token disabled:border-[var(--color-surface-fill)] disabled:text-secondary-token",
        // Link — underline style, no pill
        link: "rounded-none text-[14px] leading-[18px] text-secondary-token border-b border-[var(--color-text-secondary)] px-0 py-0",
        // Ghost for internal flexibility
        ghost:
          "bg-transparent text-primary-token",
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
