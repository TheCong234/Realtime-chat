"use client";
import { IChatMessageData, MessageType } from "@/types/chat";
import Footer from "../../components/Footer";
import Toolbar from "../../components/Toolbar";
import { ChatMessage } from "./ChatMessage";
import RecipientInfo from "./RecipientInfo";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { fetchMessages, loadMoreMessages } from "@/features/messages/message.slice";
import { fetchConversationDetails } from "@/features/conversations/conversation.slice";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserStatus } from "@/constants/enum";
import { IMAGE_DOMAIN } from "@/environments";

const ChatPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const params = useParams();
  const conversationId = params.id as string;
  const dispatch = useDispatch();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { messages, loadingMore, hasMore, pageNumber } = useSelector((state: RootState) => state.message);
  const { conversation } = useSelector((state: RootState) => state.conversation);

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
      dispatch(fetchConversationDetails(conversationId));
    }
  }, [conversationId, dispatch]);

  // Scroll to bottom on initial load or when new message is sent
  useEffect(() => {
    if (scrollContainerRef.current && messages.length > 0 && !loadingMore) {
      const container = scrollContainerRef.current;
      // Only scroll to bottom if we're not loading more (which means it's a new conversation or new message)
      // if (previousScrollHeight.current === 0) {

      container.scrollTop = container.scrollHeight;
      // }
      previousScrollHeight.current = container.scrollHeight;
    }
  }, [messages, loadingMore]);

  // Preserve scroll position when loading more messages
  useEffect(() => {
    if (loadingMore && scrollContainerRef.current) {
      previousScrollHeight.current = scrollContainerRef.current.scrollHeight;
    }
  }, [loadingMore]);

  useEffect(() => {
    if (!loadingMore && scrollContainerRef.current && previousScrollHeight.current > 0) {
      const container = scrollContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeight.current;
      if (scrollDiff > 0) {
        container.scrollTop = scrollDiff;
      }
    }
  }, [messages.length, loadingMore]);

  useEffect(() => {
    if (!topSentinelRef.current || !hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !loadingMore) {
          dispatch(loadMoreMessages(conversationId));
        }
      },
      {
        root: scrollContainerRef.current,
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(topSentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [conversationId, dispatch, hasMore, loadingMore]);

  const toolbarInfo = useMemo(() => {
    if (!conversation) {
      return {
        name: "Loading...",
        avatar: undefined,
        status: UserStatus.Offline,
      };
    }

    if (conversation.type === 0) {
      const otherMember = conversation.members.find((member) => member.userId !== currentUser?.id);
      return {
        name: otherMember?.fullName || otherMember?.username || "Unknown",
        avatar: conversation.avatarUrl || (otherMember?.avatarUrl && IMAGE_DOMAIN + otherMember.avatarUrl) || undefined,
        status: otherMember?.userStatus || UserStatus.Offline,
      };
    }

    return {
      name: conversation.name || "Group Chat",
      avatar: conversation.avatarUrl || (conversation.avatarUrl && IMAGE_DOMAIN + conversation.avatarUrl) || undefined,
      status: UserStatus.Online,
    };
  }, [conversation, currentUser?.id]);
  return (
    <div className="flex h-full gap-4">
      <div className="flex h-full flex-1 flex-col justify-between rounded-xl bg-white shadow-xl">
        <Toolbar
          name={toolbarInfo.name}
          avatar={toolbarInfo.avatar}
          status={toolbarInfo.status}
          setShowInfo={setShowInfo}
        />
        <div ref={scrollContainerRef} className="h-full overflow-auto p-3">
          <div className="flex flex-col gap-1">
            {/* Sentinel element for detecting scroll to top */}
            <div ref={topSentinelRef} className="h-1" />

            {/* Loading indicator */}
            {loadingMore && (
              <div className="flex justify-center py-2">
                <span className="text-muted-foreground text-sm">Đang tải tin nhắn...</span>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} isGroup={conversation?.type === 1} />
            ))}
          </div>
        </div>

        <Footer />
      </div>
      <div className={`${cn("hidden", showInfo && "block")} sm:w-full md:w-1/2 lg:w-1/3`}>
        <RecipientInfo />
      </div>
    </div>
  );
};

export default ChatPage;
