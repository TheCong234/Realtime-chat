const apiVersion = "api/v1";

export const AUTH_API = {
  LOGIN: `${apiVersion}/Auth/login`,
  REGISTER: `${apiVersion}/Auth/register`,
  GET_ME: `${apiVersion}/Auth/me`,
};

export const CONVERSATION_API = {
  GET_PAGED: `${apiVersion}/Conversation/GetPaged`,
  GET_BY_ID: (id: string) => `${apiVersion}/Conversation/${id}`,
};

export const MESSAGE_API = {
  GET_BY_CONVERSATION_ID: `${apiVersion}/Message/Conversation`,
  SEND: `${apiVersion}/Message`,
};

export const USER_API = {
  UPDATE_PROFILE: `${apiVersion}/Users/Profile`,
};
