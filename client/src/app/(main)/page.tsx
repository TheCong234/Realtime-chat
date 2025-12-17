import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PhoneIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="p-5 h-full bg-white rounded-xl shadow-xl flex flex-col justify-between">
      <div className=" bg-gray-100 flex justify-between">
        <div className="flex gap-3 items-center">
          <Avatar className="h-12 w-12 border border-gray-200">
            <AvatarImage src="/assets/images/no-avatar.png" alt="avatar" />
          </Avatar>
          <p className="text-lg font-medium">Trần Thế Công</p>
        </div>

        <div className="flex gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="size-8 bg-gray-300 rounded-full hover:bg-gray-400 cursor-pointer group"
              >
                <PhoneIcon className="text-main group-hover:text-white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cuộc gọi thoại</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className=" h-full overflow-auto">
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
        <h1>234</h1>
      </div>

      <div className="h-44 w-full bg-gray-600"></div>
    </div>
  );
}
