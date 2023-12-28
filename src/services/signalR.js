import * as signalR from "@microsoft/signalr";

const hubConnection = new signalR.HubConnectionBuilder()
  .withUrl(import.meta.env.VITE_WEBSOCKET_URL, {
    withCredentials: false,
  })
  .configureLogging(signalR.LogLevel.Information)
  .build();

export const signalRService = {
  startConnection: async () => {
    try {
      if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
        await hubConnection.start();
        console.log("Connection started!");
      }

      hubConnection.onclose(async () => {
        console.log("Connection closed, attempting to reconnect...");
        await signalRService.startConnection();
      });
    } catch (error) {
      console.error("Error while establishing connection:", error);
      throw error;
    }
  },

  stopConnection: async () => {
    try {
      await hubConnection.stop();
      console.log("Connection stopped!");
    } catch (error) {
      console.error("Error while stopping connection:", error);
      throw error;
    }
  },

  joinSession: async (joinSessionRequest) => {
    try {
      await hubConnection.invoke("JoinSession", joinSessionRequest);
      console.log("Joined the session successfully!");
    } catch (error) {
      console.error("Error while joining the session:", error);
      throw error;
    }
  },
};
