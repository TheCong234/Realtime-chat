import { Input } from "@/components/ui/input";
import Footer from "../components/Footer";
import { ChatMessageData } from "@/types/chat";
import { ChatMessage } from "../messenger/[id]/ChatMessage";

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

const NewChatPage = () => {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-2xl bg-white">
      <div className="border-border flex items-center gap-2 border-b p-3">
        <label htmlFor="send-to">Đến:</label>
        <Input
          id="send-to"
          placeholder="Nhập tên người nhận"
          type="text"
          className="border-none shadow-none outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      <div className="h-full overflow-auto p-3">
        <div className="flex flex-col gap-2">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewChatPage;
