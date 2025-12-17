"use client";
import { IconButtonTooltip } from "@/components/IconButtonTooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, CircleUserRoundIcon, SearchIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const RecipientInfo = () => {
  const [open, setOpen] = useState<boolean[]>([false, false, false, false]);
  const toggle = (index: number) => {
    setOpen((prev) => prev.map((v, i) => (i === index ? !v : v)));
  };
  return (
    <div className="h-full rounded-xl bg-white p-4">
      <div>
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
