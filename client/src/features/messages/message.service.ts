import { axiosClient } from "@/lib/axios";
import { IMessage, ISendMessagePayload, IBroadcastMessagePayload } from "./message.type";
import { MESSAGE_API } from "@/constants/endpoint.api";
import { IBaseResponse, IMessagePagedResult } from "@/types/api-response";
import { buildQueryParams, createPaginationParams } from "@/lib/query.utils";

export const messageService = {
  getMessages: async (
    conversationId: string,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<IBaseResponse<IMessagePagedResult>> => {
    const url = `${MESSAGE_API.GET_BY_CONVERSATION_ID}/${conversationId}/GetPaged`;
    const params = buildQueryParams(createPaginationParams(pageNumber, pageSize));

    return axiosClient.get(url, {
      params,
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
  sendMessage: async (payload: ISendMessagePayload): Promise<IBaseResponse<IMessage>> => {
    const url = MESSAGE_API.SEND;
    return axiosClient.post(url, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
  broadcastMessage: async (payload: IBroadcastMessagePayload): Promise<IBaseResponse<void>> => {
    const url = MESSAGE_API.BROADCAST;
    return axiosClient.post(url, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
    });
  },
};
