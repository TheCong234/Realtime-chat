import * as React from "react";
import {
  EllipsisIcon,
  GalleryVerticalEnd,
  SearchIcon,
  SquarePenIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import StatusDot from "./StatusDot";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ChatCard } from "./ChatCard";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <Tabs defaultValue="account">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex">
                <SidebarMenuButton size="lg" asChild>
                  <a href="#">
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium">Trần Thế Công</span>
                      <div className="flex gap-1 items-center">
                        <StatusDot />
                        <span className="text-xs">Online</span>
                      </div>
                    </div>
                  </a>
                </SidebarMenuButton>
                <div className="flex gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 bg-gray-300 rounded-full hover:bg-gray-400 cursor-pointer"
                      >
                        <EllipsisIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Cài đặt, trợ giúp, v.v...</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 bg-gray-300 rounded-full hover:bg-gray-400 cursor-pointer"
                      >
                        <SquarePenIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tin nhắn mới</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </SidebarMenuItem>

            {/* search */}
            <SidebarMenuItem className="mt-3">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-1"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="icon"
                      className=" bg-gray-300 hover:bg-gray-400 cursor-pointer"
                    >
                      <SearchIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tìm kiếm</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </SidebarMenuItem>

            {/* tab */}
            <SidebarMenuItem className="mt-3">
              <TabsList className="w-full">
                <TabsTrigger value="account">Tất cả</TabsTrigger>
                <TabsTrigger value="password">Chưa đọc</TabsTrigger>
                <TabsTrigger value="group">Nhóm</TabsTrigger>
                <TabsTrigger value="community">Cộng đồng</TabsTrigger>
              </TabsList>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <TabsContent value="account">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <ChatCard name="Bich Lien" message="hello fen" />
              </div>
            ))}
          </TabsContent>
          <TabsContent value="password">
            <div>password tab content</div>
          </TabsContent>
          <TabsContent value="group">
            <div>group tab content</div>
          </TabsContent>
          <TabsContent value="community">
            <div>community tab content</div>
          </TabsContent>
        </SidebarContent>
        <SidebarRail />
      </Tabs>
    </Sidebar>
  );
}
