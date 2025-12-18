"use client";
import { ChatMessageData } from "@/types/chat";
import Footer from "../../components/Footer";
import Toolbar from "../../components/Toolbar";
import { ChatMessage } from "./ChatMessage";
import RecipientInfo from "./RecipientInfo";
import { useState } from "react";
import { cn } from "@/lib/utils";

const messages: ChatMessageData[] = [
  {
    id: "1",
    senderId: "u1",
    isMe: false,
    type: "text",
    content: "Hello 👋",
  },
  {
    id: "2",
    senderId: "me",
    isMe: true,
    type: "image",
    content: "/assets/images/demo/because.jpeg",
  },
  {
    id: "3",
    senderId: "u1",
    isMe: false,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "4",
    senderId: "me",
    isMe: true,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "5",
    senderId: "u1",
    isMe: false,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "6",
    senderId: "me",
    isMe: true,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "7",
    senderId: "u1",
    isMe: false,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "8",
    senderId: "me",
    isMe: true,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "9",
    senderId: "u1",
    isMe: false,
    type: "text",
    content: "I'm good, thanks!",
  },
  {
    id: "10",
    senderId: "me",
    isMe: true,
    type: "text",
    content: "I'm good, thanks!",
  },
];

const ChatPage = () => {
  const [showInfo, setShowInfo] = useState(false);
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
