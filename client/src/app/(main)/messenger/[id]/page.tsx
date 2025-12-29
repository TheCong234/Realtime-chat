"use client";
import { IChatMessageData, MessageType } from "@/types/chat";
import Footer from "../../components/Footer";
import Toolbar from "../../components/Toolbar";
import { ChatMessage } from "./ChatMessage";
import RecipientInfo from "./RecipientInfo";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { fetchMessages } from "@/features/messages/message.slice";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";

const ChatPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const params = useParams();
  const conversationId = params.id as string;
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { messages, loading } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    if (conversationId) {
      dispatch(fetchMessages(conversationId));
    }
  }, [conversationId, dispatch]);

  return (
    <div className="flex h-full gap-4">
      <div className="flex h-full flex-1 flex-col justify-between rounded-xl bg-white shadow-xl">
        <Toolbar
          name="Trần Thế Công"
          avatar="/assets/images/no-avatar.png"
          status="Hoạt động 2 phút trước"
          setShowInfo={setShowInfo}
        />
        <div className="h-full overflow-auto p-3">
          <div className="flex flex-col gap-2">
            {loading && <div className="text-center text-sm text-gray-500">Loading messages...</div>}
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
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
