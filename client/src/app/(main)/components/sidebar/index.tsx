"use client";
import * as React from "react";
import { EllipsisIcon, SearchIcon, SquarePenIcon } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import { toast } from "sonner";

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
import { fetchConversations, loadMoreConversations } from "@/features/conversations/conversation.slice";
import { IMAGE_DOMAIN } from "@/environments";
import { getUserInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const isInitializedRef = useRef(false);
  const isLoadingMoreRef = useRef(false);
  const hasShownEndToastRef = useRef(false);

  const { currentUser, onlineUsers } = useSelector((state: RootState) => state.user);
  const { conversations, hasMore, loadingMore } = useSelector((state: RootState) => state.conversation);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Initial fetch without search
  useEffect(() => {
    isInitializedRef.current = false;
    hasShownEndToastRef.current = false;
    dispatch(fetchConversations());
  }, [dispatch]);

  // Mark as initialized after first load
  useEffect(() => {
    if (conversations.length > 0 && !isInitializedRef.current) {
      isInitializedRef.current = true;
    }
  }, [conversations.length]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      isInitializedRef.current = false;
      hasShownEndToastRef.current = false;
      dispatch(fetchConversations(searchQuery));
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, dispatch]);

  // Handle loading more state
  useEffect(() => {
    if (isLoadingMoreRef.current && !loadingMore) {
      isLoadingMoreRef.current = false;
    }
  }, [loadingMore]);

  // Handle load more when reaching bottom
  const handleEndReached = useCallback(() => {
    if (!isInitializedRef.current) return;

    if (hasMore && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      dispatch(loadMoreConversations());
    } else if (!hasMore && isInitializedRef.current && !hasShownEndToastRef.current) {
      hasShownEndToastRef.current = true;
      toast.info("Bạn đã xem hết cuộc hội thoại", {
        duration: 2000,
      });
    }
  }, [hasMore, dispatch]);

  return (
    <Sidebar {...props}>
      <Tabs defaultValue="all" className="flex h-full flex-col">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div className="flex">
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/">
                    <div className="relative overflow-hidden">
                      <Avatar className="h-10 w-10 border border-gray-200">
                        <AvatarImage
                          src={(currentUser?.avatarUrl && IMAGE_DOMAIN + currentUser.avatarUrl) || undefined}
                          alt="avatar"
                        />
                        <AvatarFallback>
                          {getUserInitials({ fullName: currentUser?.fullName, username: currentUser?.username || "" })}
                        </AvatarFallback>
                      </Avatar>
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
                <Input
                  type="search"
                  placeholder="Search..."
                  className="flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
        <SidebarContent className="flex-1 p-2">
          <TabsContent value="all" className="m-0 flex h-full flex-col">
            <Virtuoso
              ref={virtuosoRef}
              style={{ height: "100%" }}
              data={conversations}
              endReached={handleEndReached}
              atBottomThreshold={200}
              itemContent={(index, conversation) => {
                const partner = conversation.members.find((m) => m.userId !== currentUser?.id);
                const name = conversation.name || partner?.fullName || partner?.username || "Unknown";
                const avatarUrl =
                  conversation.avatarUrl || (partner?.avatarUrl ? IMAGE_DOMAIN + partner.avatarUrl : "");
                const userStatus = onlineUsers[partner?.userId || ""] || UserStatus.Offline;
                return (
                  <div key={conversation.id}>
                    <ChatCard
                      name={name}
                      lastMessage={conversation.lastMessage || null}
                      conversationId={conversation.id}
                      avatarUrl={avatarUrl}
                      userStatus={userStatus}
                    />
                  </div>
                );
              }}
              components={{
                Footer: () =>
                  loadingMore ? (
                    <div className="flex justify-center py-2">
                      <span className="text-xs text-gray-400">Đang tải...</span>
                    </div>
                  ) : null,
              }}
            />
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
