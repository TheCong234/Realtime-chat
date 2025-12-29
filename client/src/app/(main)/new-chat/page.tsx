"use client";
import { Input } from "@/components/ui/input";
import Footer from "../components/Footer";
import { IChatMessageData } from "@/types/chat";
import { ChatMessage } from "../messenger/[id]/ChatMessage";
import { ReceipientsAutocomplete } from "@/components/ReceipientsAutocomplete";
import { useState } from "react";
import { IMessage } from "@/features/messages/message.type";
import { MessageType } from "@/constants/enum";

const options = [
  { value: "react", label: "React" },
  { value: "next", label: "Next.js" },
  { value: "vue", label: "Vue" },
  { value: "angular", label: "Angular" },
];
type Option = { label: string; value: string };
const NewChatPage = () => {
  const [values, setValues] = useState<Option[]>([]);
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-2xl bg-white">
      <div className="border-border flex items-center gap-2 border-b p-3">
        <label htmlFor="send-to">Đến:</label>
        {/* <Input
          id="send-to"
          placeholder="Nhập tên người nhận"
          type="text"
          className="border-none shadow-none outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        /> */}
        <ReceipientsAutocomplete
          options={options}
          values={values}
          onChange={setValues}
          placeholder="Chọn người nhận ..."
          className="flex-1"
        />
      </div>
      <div className="h-full overflow-auto p-3">
        <div className="flex flex-col gap-2">
          {/* {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))} */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewChatPage;
