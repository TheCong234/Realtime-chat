import { IMessage } from "@/features/messages/message.type";

export interface IBaseResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface IPagedResult<T> {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export type IMessagePagedResult = IPagedResult<IMessage>;
