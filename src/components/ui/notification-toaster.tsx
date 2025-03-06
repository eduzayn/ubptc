import * as React from "react";
import { X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const notificationVariants = cva(
  "group fixed flex w-full max-w-sm items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-green-500 bg-green-50 text-green-700",
        warning: "border-yellow-500 bg-yellow-50 text-yellow-700",
        info: "border-blue-500 bg-blue-50 text-blue-700",
      },
      position: {
        topRight: "top-4 right-4",
        topLeft: "top-4 left-4",
        bottomRight: "bottom-4 right-4",
        bottomLeft: "bottom-4 left-4",
      },
    },
    defaultVariants: {
      variant: "default",
      position: "topRight",
    },
  },
);

export interface NotificationToasterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof notificationVariants> {
  title?: string;
  description?: string;
  onClose?: () => void;
  open?: boolean;
}

const NotificationToaster = React.forwardRef<
  HTMLDivElement,
  NotificationToasterProps
>(
  (
    {
      className,
      variant,
      position,
      title,
      description,
      onClose,
      open = true,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(open);

    React.useEffect(() => {
      if (open) {
        setIsVisible(true);
        const timer = setTimeout(() => {
          setIsVisible(false);
          onClose?.();
        }, 5000);
        return () => clearTimeout(timer);
      }
    }, [open, onClose]);

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(notificationVariants({ variant, position, className }))}
        {...props}
      >
        <div className="grid gap-1">
          {title && <h4 className="font-medium">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  },
);

NotificationToaster.displayName = "NotificationToaster";

export { NotificationToaster };
