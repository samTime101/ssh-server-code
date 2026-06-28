import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Ban, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CATEGORY_ICON_OPTIONS } from "@/constants/categoryIcons";
import { cn } from "@/lib/utils";

const NONE_ICON_VALUE = "";

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const IconPicker = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select icon",
  className,
}: IconPickerProps) => {
  const [open, setOpen] = useState(false);

  const selectedOption = useMemo(
    () => CATEGORY_ICON_OPTIONS.find((option) => option.key === value),
    [value]
  );

  const isNoneSelected = value === NONE_ICON_VALUE;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="flex items-center gap-2 truncate">
            {isNoneSelected ? (
              <>
                <Ban className="h-4 w-4 shrink-0" />
                <span className="truncate">None</span>
              </>
            ) : selectedOption ? (
              <>
                <FontAwesomeIcon icon={selectedOption.icon} className="h-4 w-4 shrink-0" />
                <span className="truncate">{selectedOption.label}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="none"
                onSelect={() => {
                  onChange(NONE_ICON_VALUE);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn("h-4 w-4 shrink-0", isNoneSelected ? "opacity-100" : "opacity-0")}
                />
                <Ban className="h-4 w-4 shrink-0" />
                <span className="truncate">None</span>
              </CommandItem>
              {CATEGORY_ICON_OPTIONS.map((option) => (
                <CommandItem
                  key={option.key}
                  value={`${option.label} ${option.key}`}
                  onSelect={() => {
                    onChange(option.key);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === option.key ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <FontAwesomeIcon icon={option.icon} className="h-4 w-4 shrink-0" />
                  <span className="truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
