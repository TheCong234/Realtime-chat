"use client";
import * as React from "react";
import { EllipsisIcon, GalleryVerticalEnd, SearchIcon, SquarePenIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import StatusDot from "@/components/StatusDot";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatCard } from "@/app/(main)/components/ChatCard";
import Link from "next/link";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OptionDropdown } from "./OptionDropdown";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { UserStatus } from "@/constants/enum";
import Image from "next/image";
import { useEffect } from "react";
import { fetchConversations } from "@/features/conversations/conversation.slice";
import { IMAGE_DOMAIN } from "@/environments";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { conversations } = useSelector((state: RootState) => state.conversation);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);
  return (
    <Sidebar {...props}>
      <Tabs defaultValue="all">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex">
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image
                        src={
                          currentUser?.avatarUrl ? IMAGE_DOMAIN + currentUser.avatarUrl : "/assets/images/no-avatar.png"
                        }
                        alt={currentUser?.fullName || "avatar"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="text-base font-medium">{currentUser?.fullName || currentUser?.username}</span>
                      <div className="flex items-center gap-1">
                        <StatusDot status={currentUser?.status || UserStatus.Offline} />
                        <span className="text-xs">{UserStatus[currentUser?.status || 0]}</span>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
                <div className="flex gap-3">
                  <Tooltip>
                    <DropdownMenu>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="size-8 rounded-full bg-gray-300 hover:bg-gray-400"
                          >
                            <EllipsisIcon />
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>

                      <OptionDropdown />
                    </DropdownMenu>

                    <TooltipContent>
                      <p>Cài đặt, trợ giúp, v.v...</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant="secondary"
                        size="icon"
                        className="size-8 cursor-pointer rounded-full bg-gray-300 hover:bg-gray-400"
                      >
                        <Link href="/new-chat">
                          <SquarePenIcon />
                        </Link>
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
                <Input type="search" placeholder="Search..." className="flex-1" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="icon"
                      className="cursor-pointer bg-gray-300 hover:bg-gray-400"
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
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
                <TabsTrigger value="group">Nhóm</TabsTrigger>
                <TabsTrigger value="community">Cộng đồng</TabsTrigger>
              </TabsList>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* all conversations tab  */}
        <SidebarContent className="p-2">
          <TabsContent value="all">
            {conversations.map((conversation) => {
              const partner = conversation.members.find((m) => m.userId !== currentUser?.id);
              const name = conversation.name || partner?.fullName || partner?.username || "Unknown";
              const avatarUrl =
                conversation.avatarUrl ||
                (partner?.avatarUrl ? IMAGE_DOMAIN + partner.avatarUrl : "/assets/images/no-avatar.png");

              return (
                <div key={conversation.id}>
                  <ChatCard
                    name={name}
                    lastMessage={conversation.lastMessage || null}
                    conversationId={conversation.id}
                    avatarUrl={avatarUrl}
                  />
                </div>
              );
            })}
          </TabsContent>
          <TabsContent value="unread">
            <div>unread tab content</div>
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
