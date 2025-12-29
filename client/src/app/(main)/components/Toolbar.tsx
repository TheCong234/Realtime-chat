import { IconButtonTooltip } from "@/components/IconButtonTooltip";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { InfoIcon, PhoneIcon, VideoIcon } from "lucide-react";
import React from "react";

interface IToolbarProps {
  name: string;
  avatar: string;
  status: string;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
}
const Toolbar = React.memo(({ name, avatar, status, setShowInfo }: IToolbarProps) => {
  return (
    <div className="border-border flex items-center justify-between border-b p-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-gray-200">
          <AvatarImage src={avatar} alt="avatar" />
        </Avatar>
        <div className="flex flex-col">
          <p className="text-lg font-medium">{name}</p>
          <p className="mt-[-4px] text-sm text-gray-500">{status}</p>
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
          onClick={() => setShowInfo((prev) => !prev)}
          icon={<InfoIcon className="size-5" />}
          tooltip="Thông tin về cuộc trò chuyện"
          className="cursor-pointer bg-gray-300 hover:bg-gray-400"
          iconClassName="text-main group-hover:text-white"
        />
      </div>
    </div>
  );
});

export default Toolbar;
