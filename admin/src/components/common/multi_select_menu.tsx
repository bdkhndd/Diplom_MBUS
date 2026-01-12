import React from 'react';
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Badge } from "../ui/badge";

interface ItemType {
  label: string;
  value: string;
}

interface MultiSelectProps {
  items: ItemType[];
  selectedValues: string[];
  onValueChange: (values: string[]) => void;
  placeholder?: string;
}

const MultiSelectMenu: React.FC<MultiSelectProps> = ({
  items,
  selectedValues = [],
  onValueChange,
  placeholder = "Мэргэжил сонгох..."
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleValue = (val: string) => {
    const isSelected = selectedValues.includes(val);
    const newValues = isSelected
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];
    
    onValueChange(newValues);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-12 rounded-xl border-slate-200 bg-white"
            type="button"
          >
            <span className="truncate text-slate-500 font-medium">
              {selectedValues.length > 0 
                ? `Сонгогдсон (${selectedValues.length})` 
                : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popover-trigger-width)] p-0 bg-white shadow-xl rounded-xl border border-slate-200" 
          align="start"
          onPointerDownOutside={(e) => {
             if (e.target instanceof Element && e.target.closest('[data-radix-popper-content-wrapper]')) {
               e.preventDefault();
             }
          }}
        >
          <Command className="w-full overflow-hidden" shouldFilter={true}>
            <CommandInput placeholder="Хайх..." className="h-10 border-none focus:ring-0" />
            <CommandList className="max-h-64 overflow-y-auto">
              <CommandEmpty className="p-4 text-sm text-slate-500 text-center">Илэрц олдсонгүй.</CommandEmpty>
              <CommandGroup className="p-1">
                {items.map((item) => {
                  const isSelected = selectedValues.includes(item.value);
                  return (
                    <div
                      key={item.value}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleValue(item.value);
                      }}
                      className={cn(
                        "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none transition-colors",
                        "hover:bg-slate-100 hover:text-slate-900",
                        isSelected ? "bg-slate-50 text-purple-700 font-medium" : "text-slate-700"
                      )}
                    >
                      <div className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded border border-slate-300 transition-all",
                        isSelected ? "bg-purple-600 border-purple-600 text-white" : "bg-white"
                      )}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="flex-1 truncate">{item.label}</span>
                    </div>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="flex flex-wrap gap-2 mt-1">
        {selectedValues.map((val) => {
          const item = items.find((i) => i.value === val);
          if (!item) return null;
          return (
            <Badge 
              key={val} 
              variant="secondary" 
              className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100 px-3 py-1 flex items-center gap-1"
            >
              {item.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-red-500" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleValue(val);
                }}
              />
            </Badge>
          );
        })}
      </div>
    </div>
  );
};

export default MultiSelectMenu;