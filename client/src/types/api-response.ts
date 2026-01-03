import { IMessage } from "@/features/messages/message.type";
import { IUser } from "@/features/user/user.types";

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
  hasNextPage: boolean;
}

export type IMessagePagedResult = IPagedResult<IMessage>;
export type IUserPagedResult = IPagedResult<IUser>;
