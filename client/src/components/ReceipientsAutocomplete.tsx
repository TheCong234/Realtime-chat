"use client";

import * as React from "react";
import { X, ChevronsUpDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IUser } from "@/features/user/user.types";
import { userService } from "@/features/user/user.service";
import { useDebounce } from "@/hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const MAX_RECIPIENTS = 20;

interface IReceipientsAutocompleteProps {
  values: IUser[];
  onChange: (users: IUser[]) => void;
  placeholder?: string;
  className?: string;
}

export function ReceipientsAutocomplete({
  values,
  onChange,
  placeholder = "Chọn người nhận...",
  className,
}: IReceipientsAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [loading, setLoading] = React.useState(false);

  const debouncedQuery = useDebounce(query, 300);

  const selectedIds = React.useMemo(() => new Set(values.map((v) => v.id)), [values]);

  // Fetch users from API
  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await userService.getPagedUsers(1, 20, debouncedQuery || undefined);
        setUsers(response.data.items);
      } catch (error: any) {
        toast.error(error.message || "Không thể tải danh sách người dùng");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchUsers();
    }
  }, [debouncedQuery, open]);

  // Filter out already selected users
  const filtered = React.useMemo(() => {
    return users.filter((u) => !selectedIds.has(u.id));
  }, [users, selectedIds]);

  const add = (user: IUser) => {
    if (values.length >= MAX_RECIPIENTS) {
      toast.warning(`Bạn chỉ có thể chọn tối đa ${MAX_RECIPIENTS} người nhận`);
      return;
    }
    onChange([...values, user]);
  };

  const remove = (userId: string) => onChange(values.filter((v) => v.id !== userId));

  const getUserInitials = (user: IUser) => {
    if (user.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.username.slice(0, 2).toUpperCase();
  };

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
                    key={v.id}
                    variant="secondary"
                    className="flex cursor-pointer items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(v.id);
                    }}
                  >
                    {v.fullName || v.username}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--ac-width,24rem)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Tìm kiếm người dùng..." value={query} onValueChange={setQuery} />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <CommandEmpty>Không tìm thấy người dùng phù hợp.</CommandEmpty>
              ) : (
                <ScrollArea className="max-h-56">
                  <CommandGroup>
                    {filtered.map((user) => (
                      <CommandItem
                        key={user.id}
                        onSelect={() => add(user)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <Check className={cn("h-4 w-4 opacity-0")} />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium">{user.fullName || user.username}</span>
                          <span className="text-muted-foreground text-xs">{user.email}</span>
                        </div>
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
