"use client";

import * as React from "react";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";

type Option = { label: string; value: string };

interface MultiAutocompleteProps {
  options: Option[];
  values: Option[];
  onChange: (opts: Option[]) => void;
  placeholder?: string;
  className?: string;
}

export function ReceipientsAutocomplete({
  options,
  values,
  onChange,
  placeholder = "Chọn người nhận...",
  className,
}: MultiAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const selectedValues = React.useMemo(() => new Set(values.map((v) => v.value)), [values]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? options.filter((o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q))
      : options;
    // có thể ẩn item đã chọn
    return base.filter((o) => !selectedValues.has(o.value));
  }, [options, query, selectedValues]);

  const add = (opt: Option) => onChange([...values, opt]);
  const remove = (val: string) => onChange(values.filter((v) => v.value !== val));

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-none shadow-none outline-none hover:bg-transparent"
          >
            {values.length ? (
              <div className="flex flex-wrap gap-1">
                {values.map((v) => (
                  <Badge
                    key={v.value}
                    variant="secondary"
                    className="flex cursor-pointer items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(v.value);
                    }}
                  >
                    {v.label}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--ac-width,24rem)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Tìm kiếm..." value={query} onValueChange={setQuery} />
            <CommandList>
              {filtered.length === 0 ? (
                <CommandEmpty>Không còn lựa chọn phù hợp.</CommandEmpty>
              ) : (
                <ScrollArea className="max-h-56">
                  <CommandGroup>
                    {filtered.map((opt) => (
                      <CommandItem key={opt.value} onSelect={() => add(opt)}>
                        <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
