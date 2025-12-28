import { Message } from "@/features/messages/message.type";

export interface BaseResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PagedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export type MessagePagedResult = PagedResult<Message>;
