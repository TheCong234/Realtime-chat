import { axiosClient } from "@/lib/axios";
import { IBaseResponse, IPagedResult } from "@/types/api-response";
import { IConversation } from "./conversation.type";
import { CONVERSATION_API } from "@/constants/endpoint.api";
import { buildQueryParams, createSearchParams } from "@/lib/query.utils";

export const conversationService = {
  getConversations: async (searchQuery?: string): Promise<IBaseResponse<IPagedResult<IConversation>>> => {
    const url = CONVERSATION_API.GET_PAGED;
    const params = buildQueryParams({
      values: "all",
      ...createSearchParams(searchQuery),
    });

    return axiosClient.get(url, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },

  getConversationById: async (id: string): Promise<IBaseResponse<IConversation>> => {
    const url = CONVERSATION_API.GET_BY_ID(id);
    return axiosClient.get(url, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },

  clearHistory: async (id: string): Promise<IBaseResponse<null>> => {
    const url = CONVERSATION_API.CLEAR_HISTORY(id);
    return axiosClient.post(
      url,
      {},
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      },
    );
  },
};
