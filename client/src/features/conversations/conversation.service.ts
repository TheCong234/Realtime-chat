import { axiosClient } from "@/lib/axios";
import { BaseResponse } from "@/types/api-response";
import { Conversation, PagedResult } from "./conversation.type";
import { CONVERSATION_API } from "@/constants/endpoint.api";

export const conversationService = {
  getConversations: async (): Promise<PagedResult<Conversation>> => {
    const url = CONVERSATION_API.GET_PAGED;
    return axiosClient.get(url, {
      params: { values: "all" },
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
};
