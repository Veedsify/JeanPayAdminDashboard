"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectContextType {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(
  undefined
); 
export const SelectBox = ({
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: React.ReactNode;
}) => (
  <div className="relative">
    <select
      className="h-10 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  </div>
);


const useSelectContext = () => {
  const context = React.useContext(SelectContext);
  if (!context) {
    throw new Error("Select components must be used within a Select");
  }
  return context;
};

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

const Select = ({ value, onValueChange, children }: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
};

const SelectGroup = ({ children }: { children: React.ReactNode }) => (
  <div>{children}</div>
);

interface SelectValueProps {
  placeholder?: string;
  className?: string;
}

const SelectValue = ({ placeholder, className }: SelectValueProps) => {
  const { value } = useSelectContext();
  return (
    <span className={cn("block truncate", className)}>
      {value || placeholder}
    </span>
  );
};

interface SelectTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = useSelectContext();

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg border border-gray-200/80 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

interface SelectContentProps {
  className?: string;
  children: React.ReactNode;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children }, ref) => {
    const { open, setOpen } = useSelectContext();

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          ref &&
          "current" in ref &&
          ref.current &&
          !ref.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [open, setOpen, ref]);

    if (!open) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "absolute top-full left-0 z-50 mt-1 min-w-full overflow-hidden rounded-md border bg-white shadow-md animate-in fade-in-0 zoom-in-95",
          className
        )}
      >
        <div className="p-1">{children}</div>
      </div>
    );
  }
);
SelectContent.displayName = "SelectContent";

interface SelectLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
      {...props}
    />
  )
);
SelectLabel.displayName = "SelectLabel";

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
  children: React.ReactNode;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen } = useSelectContext();
    const isSelected = selectedValue === value;

    const handleClick = () => {
      onValueChange?.(value);
      setOpen(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {isSelected && <Check className="h-4 w-4" />}
        </span>
        <span className="block truncate">{children}</span>
      </div>
    );
  }
);
SelectItem.displayName = "SelectItem";

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  )
);
SelectSeparator.displayName = "SelectSeparator";

export {
  Select,
  
  SelectValue,
  SelectTrigger,
  SelectContent,
  
  SelectItem,
  
};
