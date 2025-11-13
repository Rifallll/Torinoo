"use client";

import * as React from "react";
import * as TooltipPrimitives from "@radix-ui/react-tooltip";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitives.Provider;

const Tooltip = TooltipPrimitives.Root;

const TooltipTrigger = TooltipPrimitives.Trigger;

const tooltipVariants = cva(
  "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      variant: {
        default: "",
        destructive: "border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitives.Content>,
    VariantProps<typeof tooltipVariants> {}

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitives.Content>,
  TooltipContentProps
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitives.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipVariants({ variant }), className)}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitives.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };