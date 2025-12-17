import { IconButtonTooltip } from "@/components/IconButtonTooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { InfoIcon, PhoneIcon, VideoIcon } from "lucide-react";
import React from "react";

interface ToolbarProps {
  name: string;
  avatar: string;
  status: string;
}
const Toolbar = React.memo(({ name, avatar, status }: ToolbarProps) => {
  return (
    <div className="p-3 flex justify-between items-center border-b border-border">
      <div className="flex gap-3 items-center ">
        <Avatar className="h-12 w-12 border border-gray-200">
          <AvatarImage src={avatar} alt="avatar" />
        </Avatar>
        <div className="flex flex-col">
          <p className="text-lg font-medium">{name}</p>
          <p className="text-sm text-gray-500 mt-[-4px]">{status}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <IconButtonTooltip
          icon={<PhoneIcon className="size-5" />}
          tooltip="Cuộc gọi thoại"
          className="bg-gray-300 hover:bg-gray-400"
          iconClassName="text-main group-hover:text-white"
        />
        <IconButtonTooltip
          icon={<VideoIcon className="size-5" />}
          tooltip="Cuộc gọi video"
          className="bg-gray-300 hover:bg-gray-400"
          iconClassName="text-main group-hover:text-white"
        />
        <IconButtonTooltip
          icon={<InfoIcon className="size-5" />}
          tooltip="Thông tin về cuộc trò chuyện"
          className="bg-gray-300 hover:bg-gray-400"
          iconClassName="text-main group-hover:text-white"
        />
      </div>
    </div>
  );
});

export default Toolbar;
