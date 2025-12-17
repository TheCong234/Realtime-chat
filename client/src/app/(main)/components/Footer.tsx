import { IconButtonTooltip } from "@/components/IconButtonTooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicIcon, ImageIcon, StickerIcon, GiftIcon, SmileIcon } from "lucide-react";

const Footer = () => {
  return (
    <div className="flex gap-2 p-3">
      <IconButtonTooltip
        icon={<MicIcon className="size-5" />}
        tooltip="Gửi thu âm"
        className="bg-gray-300 hover:bg-gray-400"
        iconClassName="text-main group-hover:text-white"
      />
      <IconButtonTooltip
        icon={<ImageIcon className="size-5" />}
        tooltip="Chọn ảnh"
        className="bg-gray-300 hover:bg-gray-400"
        iconClassName="text-main group-hover:text-white"
      />
      <IconButtonTooltip
        icon={<StickerIcon className="size-5" />}
        tooltip="Chọn nhãn dán"
        className="bg-gray-300 hover:bg-gray-400"
        iconClassName="text-main  group-hover:text-white"
      />
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Aa"
          className="flex-1 rounded-full border-none bg-gray-200 pr-12 outline-none focus:bg-gray-300 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full hover:bg-gray-400"
        >
          <SmileIcon className="size-5" />
        </Button>
      </div>

      <IconButtonTooltip
        icon={<GiftIcon className="size-5" />}
        tooltip="Chọn quà"
        className="bg-gray-300 hover:bg-gray-400"
        iconClassName="text-main group-hover:text-white"
      />
      <IconButtonTooltip
        icon={<SmileIcon className="size-5" />}
        tooltip="Chọn emoji"
        className="bg-gray-300 hover:bg-gray-400"
        iconClassName="text-main group-hover:text-white"
      />
    </div>
  );
};

export default Footer;
