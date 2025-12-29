import { axiosClient } from "@/lib/axios";
import { IPagedResult } from "@/types/api-response";
import { IConversation } from "./conversation.type";
import { CONVERSATION_API } from "@/constants/endpoint.api";

export const conversationService = {
  getConversations: async (): Promise<IPagedResult<IConversation>> => {
    const url = CONVERSATION_API.GET_PAGED;
    return axiosClient.get(url, {
      params: { values: "all" },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
};
