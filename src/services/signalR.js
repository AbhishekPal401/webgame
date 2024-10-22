import * as signalR from "@microsoft/signalr";

class SignalRService {
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_WEBSOCKET_URL, {
        withCredentials: false,
        accessTokenFactory: () => {
          return localStorage.getItem("isAuthorised_jwt") || "";
        },
      })
      .withAutomaticReconnect()
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

  async joinWithUserId(data) {
    try {
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke("JoinWithUserID", data);
        console.log("Joined the server with user id successfully!");
      }
    } catch (error) {
      console.error("Error while joining server with user id ", error);
    }
  }

  async NotifyPlayers(data) {
    try {
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke("NotifyPlayers", data);
        console.log("NotifyPlayers invoke is  successfully!");
      }
    } catch (error) {
      console.error("Error while NotifyPlayers ", error);
    }
  }

  async GameAvailable(callback = () => {}) {
    try {
      this.hubConnection.on("GameAvailable", () => {
        callback();
      });
    } catch (error) {
      console.error("Error while listening to GameAvailable", error);
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
    }
  }

  async connectedUsers(callback = () => {}) {
    try {
      this.hubConnection.on("ConnectedUsers", (connectedUsers) => {
        callback(connectedUsers);
      });
    } catch (error) {
      console.error("Error while joining the session:", error);
    }
  }

  async ReceiveNotification(callback = () => {}) {
    try {
      this.hubConnection.on("ReceiveNotification", (actionType, message) => {
        callback(actionType, message);
      });
    } catch (error) {
      console.error("Error while joining the session:", error);
    }
  }

  async AdminMessage(data) {
    try {
      await this.hubConnection.invoke("AdminMessage", data);
    } catch (error) {
      console.error("Error while joining the session:", error);
    }
  }

  async SendVotes(data) {
    try {
      await this.hubConnection.invoke("SubmitVote", data);
      console.log("Vote Submitted");
    } catch (error) {
      console.error("Error while sending Submiting Vote:", error);
    }
  }

  async GetVotingDetails(callback = () => {}) {
    try {
      this.hubConnection.on("ReceiveVotingInfo", (votesDetails) => {
        callback(votesDetails);
      });
    } catch (error) {
      console.error("Error while Getting Vote:", error);
    }
  }

  async MissionCompletedInvoke(data) {
    try {
      await this.hubConnection.invoke("MissionCompleted", data);
    } catch (error) {
      console.error("Error while sending to MissionCompleted:", error);
    }
  }

  async HomeScreenListener(callback = () => {}) {
    try {
      this.hubConnection.on("HomeScreen", () => {
        callback();
      });
    } catch (error) {
      console.error("Error while listening HomeScreen:", error);
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

  async NotificationInvoke(data) {
    try {
      this.hubConnection.invoke("Notifications", data);
    } catch (error) {
      console.error("Error while sending Notifications:", error);
      throw error;
    }
  }

  async NotificationListener(callback = () => {}) {
    try {
      this.hubConnection.on("Notifications", (ActionType, Message) => {
        callback(ActionType, Message);
      });
    } catch (error) {
      console.error("Error while listening Notifications:", error);
      throw error;
    }
  }

  async SkipMediaListener(callback = () => {}) {
    try {
      this.hubConnection.on("SkipMedia", (data) => {
        callback(data);
      });
      console.log("media skipped listening started");
    } catch (error) {
      console.error("Error while listening SkipMedia:", error);
      throw error;
    }
  }

  async SkipMediaInvoke(data) {
    try {
      await this.hubConnection.invoke("SkipMedia", data);
    } catch (error) {
      console.error("Error while sending SkipMedia:", error);
      throw error;
    }
  }

  GameAvailableOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("GameAvailable", callback);
    }
  }

  SkipMediaOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("SkipMedia", callback);
    }
  }

  HomeScreenListenerOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("HomeScreen", callback);
    }
  }

  GetVotingDetailsOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("ReceiveVotingInfo", callback);
    }
  }

  ProceedToNextQuestionListenerOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("ProceedToNextQuestion", callback);
    }
  }

  NotificationListenerOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("Notifications", callback);
    }
  }

  ReceiveNotificationOff(callback) {
    if (typeof callback === "function") {
      this.hubConnection.off("ReceiveNotification", callback);
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
