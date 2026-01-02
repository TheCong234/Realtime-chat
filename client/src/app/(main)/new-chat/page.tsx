"use client";
import Footer from "../components/Footer";
import { ReceipientsAutocomplete } from "@/app/(main)/new-chat/ReceipientsAutocomplete";
import { useState } from "react";
import { IUser } from "@/features/user/user.types";
import { messageService } from "@/features/messages/message.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const NewChatPage = () => {
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung tin nhắn");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người nhận");
      return;
    }

    setIsSending(true);
    try {
      await messageService.broadcastMessage({
        userIds: selectedUsers.map((u) => u.id),
        type: 0,
        content: content.trim(),
      });
      toast.success(`Đã gửi tin nhắn đến ${selectedUsers.length} người nhận`);

      setSelectedUsers([]);
    } catch (error: any) {
      toast.error(error.message || "Không thể gửi tin nhắn");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-2xl bg-white">
      <div className="border-border flex items-center gap-2 border-b p-3">
        <label htmlFor="send-to">Đến:</label>
        <ReceipientsAutocomplete
          values={selectedUsers}
          onChange={setSelectedUsers}
          placeholder="Chọn người nhận ..."
          className="flex-1"
        />
      </div>
      <div className="h-full overflow-auto p-3">
        <div className="flex flex-col gap-2">
          {isSending && (
            <div className="text-muted-foreground flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang gửi tin nhắn...</span>
            </div>
          )}
        </div>
      </div>
      <Footer onSendMessage={handleSendMessage} />
    </div>
  );
};

export default NewChatPage;
