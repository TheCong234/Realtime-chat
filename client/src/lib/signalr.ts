import { HUB_URL } from "@/environments";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

/**
 * Creates a new SignalR connection with the given access token
 */
export function createConnection(accessToken: string): signalR.HubConnection {
  if (connection) {
    return connection;
  }

  console.log("SignalR: Creating connection to", HUB_URL);

  connection = new signalR.HubConnectionBuilder()
    .withUrl(HUB_URL, {
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect([0, 1000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Debug)
    .build();

  // Add connection state change handlers for debugging
  connection.onclose((error) => {
    console.log("SignalR: Connection closed", error);
  });

  connection.onreconnecting((error) => {
    console.log("SignalR: Reconnecting...", error);
  });

  connection.onreconnected((connectionId) => {
    console.log("SignalR: Reconnected with ID:", connectionId);
  });

  return connection;
}

/**
 * Gets the existing connection or null if not connected
 */
export function getConnection(): signalR.HubConnection | null {
  return connection;
}

/**
 * Starts the SignalR connection
 */
export async function startConnection(): Promise<void> {
  if (!connection) {
    console.error("SignalR: Connection not initialized. Call createConnection first.");
    return;
  }

  // Only start if in Disconnected state
  if (connection.state === signalR.HubConnectionState.Connected) {
    console.log("SignalR: Already connected.");
    return;
  }

  if (connection.state !== signalR.HubConnectionState.Disconnected) {
    console.log("SignalR: Connection is in state:", connection.state, "- skipping start");
    return;
  }

  try {
    await connection.start();
    console.log("SignalR: Connected successfully.");
  } catch (error) {
    console.error("SignalR: Connection failed.", error);
    // Only retry if still disconnected (not if already connecting again)
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      setTimeout(() => startConnection(), 5000);
    }
  }
}

/**
 * Stops the SignalR connection
 */
export async function stopConnection(): Promise<void> {
  if (connection) {
    try {
      await connection.stop();
      console.log("SignalR: Disconnected.");
    } catch (error) {
      console.error("SignalR: Failed to disconnect.", error);
    } finally {
      connection = null;
    }
  }
}

/**
 * Registers an event handler
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function on(eventName: string, callback: (...args: any[]) => void): void {
  if (connection) {
    connection.on(eventName, callback);
  }
}

/**
 * Removes an event handler
 */
export function off(eventName: string): void {
  if (connection) {
    connection.off(eventName);
  }
}

/**
 * Invokes a hub method
 */
export async function invoke<T = void>(methodName: string, ...args: unknown[]): Promise<T> {
  if (!connection || connection.state !== signalR.HubConnectionState.Connected) {
    throw new Error("SignalR: Not connected.");
  }
  return await connection.invoke<T>(methodName, ...args);
}

/**
 * Joins a conversation group for real-time updates
 */
export async function joinConversation(conversationId: string): Promise<void> {
  await invoke("JoinConversation", conversationId);
}

/**
 * Leaves a conversation group
 */
export async function leaveConversation(conversationId: string): Promise<void> {
  await invoke("LeaveConversation", conversationId);
}

/**
 * Marks all messages in a conversation as seen
 */
export async function markConversationAsSeen(conversationId: string): Promise<void> {
  await invoke("MarkConversationAsSeen", conversationId);
}

/**
 * Gets list of online user IDs
 */
export async function getOnlineUsers(): Promise<string[]> {
  return await invoke<string[]>("GetOnlineUsers");
}

// Export connection state enum for convenience
export { HubConnectionState } from "@microsoft/signalr";
