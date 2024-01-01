import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_WEBSOCKET_URL, {
        withCredentials: false,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupConnectionHandlers();
  }

  setupConnectionHandlers() {
    this.hubConnection.onclose(async () => {
      console.log("Connection closed, attempting to reconnect...");
      await this.startConnection();
    });
  }

  async startConnection(callbackOnConnected = () => {}) {
    try {
      if (
        this.hubConnection.state === signalR.HubConnectionState.Disconnected
      ) {
        await this.hubConnection.start();
      }

      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        console.log("Connection established");
        if (callbackOnConnected) {
          callbackOnConnected(); // Call the provided callback
        }
      }
    } catch (error) {
      console.error("Error while establishing connection:", error);
      throw error;
    }
  }

  async stopConnection() {
    try {
      await this.hubConnection.stop();
      console.log("Connection stopped!");
    } catch (error) {
      console.error("Error while stopping connection:", error);
      throw error;
    }
  }

  async joinSession(joinSessionRequest) {
    try {
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke("JoinSession", joinSessionRequest);
        console.log("Joined the session successfully!");
      }
    } catch (error) {
      console.error("Error while joining the session:", error);
      throw error;
    }
  }

  async connectedUsers(callback = () => {}) {
    try {
      this.hubConnection.on("ConnectedUsers", (connectedUsers) => {
        callback(connectedUsers);
      });
    } catch (error) {
      console.error("Error while joining the session:", error);
      throw error;
    }
  }

  async ReceiveNotification(callback = () => {}) {
    try {
      this.hubConnection.on("ReceiveNotification", (actionType, message) => {
        callback(actionType, message);
      });
    } catch (error) {
      console.error("Error while joining the session:", error);
      throw error;
    }
  }

  async AdminMessage(data) {
    try {
      await this.hubConnection.invoke("AdminMessage", data);
    } catch (error) {
      console.error("Error while joining the session:", error);
      throw error;
    }
  }

  async SendVotes(data) {
    try {
      await this.hubConnection.invoke("SubmitVote", data);
      console.log("Vote Submitted");
    } catch (error) {
      console.error("Error while sending Submiting Vote:", error);
      throw error;
    }
  }

  async GetVotingDetails(callback = () => {}) {
    try {
      this.hubConnection.on("ReceiveVotingInfo", (votesDetails) => {
        callback(votesDetails);
      });
    } catch (error) {
      console.error("Error while Getting Vote:", error);
      throw error;
    }
  }

  async ProceedToNextQuestionInvoke(data) {
    try {
      await this.hubConnection.invoke("ProceedToNextQuestion", data);
    } catch (error) {
      console.error("Error while sending to ProceedToNextQuestion:", error);
      throw error;
    }
  }

  async ProceedToNextQuestionListener(callback = () => {}) {
    try {
      // isFinal --> Yes || No
      this.hubConnection.on("ProceedToNextQuestion", (isFinal) => {
        callback(isFinal);
      });
    } catch (error) {
      console.error("Error while listening ProceedToNextQuestion:", error);
      throw error;
    }
  }

  // Ensure a single instance of SignalRService is used
  static getInstance() {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }
}

export const signalRService = SignalRService.getInstance();
