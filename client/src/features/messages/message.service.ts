import { axiosClient } from "@/lib/axios";
import { Message, SendMessagePayload } from "./message.type";
import { MESSAGE_API } from "@/constants/endpoint.api";
import { MessagePagedResult } from "@/types/api-response";

export const messageService = {
  getMessages: async (conversationId: string): Promise<MessagePagedResult> => {
    const url = `${MESSAGE_API.GET_BY_CONVERSATION_ID}/${conversationId}/GetPaged`;
    return axiosClient.get(url, {
      params: {
        pageNumber: 1,
        pageSize: 10,
      },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
  sendMessage: async (payload: SendMessagePayload): Promise<Message> => {
    const url = MESSAGE_API.SEND;
    return axiosClient.post(url, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
};
