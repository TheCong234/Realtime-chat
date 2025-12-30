"use client";
import { IChatMessageData, MessageType } from "@/types/chat";
import Footer from "../../components/Footer";
import Toolbar from "../../components/Toolbar";
import { ChatMessage } from "./ChatMessage";
import RecipientInfo from "./RecipientInfo";
import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { fetchMessages } from "@/features/messages/message.slice";
import { fetchConversationDetails } from "@/features/conversations/conversation.slice";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserStatus } from "@/constants/enum";

const ChatPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const params = useParams();
  const conversationId = params.id as string;
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { messages, loading } = useSelector((state: RootState) => state.message);
  const { conversation, loading: conversationLoading } = useSelector((state: RootState) => state.conversation);

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
      dispatch(fetchConversationDetails(conversationId));
    }
  }, [conversationId, dispatch]);

  const toolbarInfo = useMemo(() => {
    if (!conversation) {
      return {
        name: "Loading...",
        avatar: "/assets/images/no-avatar.png",
        status: "",
      };
    }

    if (conversation.type === 0) {
      const otherMember = conversation.members.find((member) => member.userId !== currentUser?.id);
      return {
        name: otherMember?.fullName || otherMember?.username || "Unknown",
        avatar: otherMember?.avatarUrl || "/assets/images/no-avatar.png",
        status: UserStatus[otherMember?.status || UserStatus.Offline],
      };
    }

    return {
      name: conversation.name || "Group Chat",
      avatar: conversation.avatarUrl || "/assets/images/no-avatar.png",
      status: `${conversation.members.length} thành viên`,
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
        <div className="h-full overflow-auto p-3">
          <div className="flex flex-col gap-2">
            {loading && <div className="text-center text-sm text-gray-500">Loading messages...</div>}
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
