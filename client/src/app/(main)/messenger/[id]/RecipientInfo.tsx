"use client";
import { IconButtonTooltip } from "@/components/IconButtonTooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, BellIcon, CircleUserRoundIcon, SearchIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface IRecipientInfoProps {
  onClose: () => void;
}

const RecipientInfo = ({ onClose }: IRecipientInfoProps) => {
  const [open, setOpen] = useState<boolean[]>([false, false, false, false]);
  const toggle = (index: number) => {
    setOpen((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  return (
    <div className="dark:bg-card flex h-full flex-col rounded-xl bg-white">
      {/* Mobile header with back button - only visible on mobile */}
      <header className="flex shrink-0 items-center gap-2 border-b p-3 md:hidden">
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <ArrowLeftIcon className="size-5" />
        </Button>
        <span className="font-semibold">Thông tin về cuộc trò chuyện</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="size-24">
            <AvatarImage src="/assets/images/no-avatar.png" />
            <AvatarFallback>CT</AvatarFallback>
          </Avatar>
          <p className="text-xl font-medium">Tên Recipient</p>
        </div>

        <div className="mt-4 flex items-start justify-center gap-1">
          <div className="flex max-w-20 flex-col items-center">
            <IconButtonTooltip
              icon={<CircleUserRoundIcon className="size-6" />}
              tooltip="Trang cá nhân"
              className="bg-gray-300 hover:bg-gray-400"
              iconClassName="text-main group-hover:text-white"
            />
            <p className="text-center text-sm">Trang cá nhân</p>
          </div>
          <div className="flex max-w-20 flex-col items-center">
            <IconButtonTooltip
              icon={<BellIcon className="size-6" />}
              tooltip="Tắt thông báo"
              className="bg-gray-300 hover:bg-gray-400"
              iconClassName="text-main group-hover:text-white"
            />
            <p className="text-center text-sm">Tắt thông báo</p>
          </div>
          <div className="flex w-20 max-w-20 flex-col items-center">
            <IconButtonTooltip
              icon={<SearchIcon className="size-6" />}
              tooltip="Tìm kiếm trong đoạn chat"
              className="bg-gray-300 hover:bg-gray-400"
              iconClassName="text-main group-hover:text-white"
            />
            <p className="text-center text-sm">Tìm kiếm</p>
          </div>
        </div>
        <div className="w-full max-w-md space-y-2">
          {[1, 2, 3, 4].map((item, index) => (
            <Collapsible key={item} open={open[index]} onOpenChange={() => toggle(index)} className="rounded-lg">
              <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2 font-medium">
                Collapsible {item}
                <ChevronDown className={cn("h-4 w-4 transition-transform", open[index] && "rotate-180")} />
              </CollapsibleTrigger>

              <CollapsibleContent className="text-muted-foreground px-4 pb-4 text-sm">
                Nội dung của collapsible {item}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipientInfo;
