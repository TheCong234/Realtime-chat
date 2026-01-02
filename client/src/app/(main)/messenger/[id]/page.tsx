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
import { IMAGE_DOMAIN } from "@/environments";

const ChatPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const params = useParams();
  const conversationId = params.id as string;
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state: RootState) => state.user);
  const { messages } = useSelector((state: RootState) => state.message);
  const { conversation } = useSelector((state: RootState) => state.conversation);

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
        avatar: undefined,
        status: UserStatus.Offline,
      };
    }

    if (conversation.type === 0) {
      const otherMember = conversation.members.find((member) => member.userId !== currentUser?.id);
      console.log("other menber", otherMember);

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
  console.log(toolbarInfo);
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
