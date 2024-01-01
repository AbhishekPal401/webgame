import * as signalR from "@microsoft/signalr";

// const hubConnection = new signalR.HubConnectionBuilder()
//   .withUrl(import.meta.env.VITE_WEBSOCKET_URL, {
//     withCredentials: false,
//   })
//   .configureLogging(signalR.LogLevel.Information)
//   .build();

// export const signalRService = {
//   startConnection: async () => {
//     try {
//       if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
//         await hubConnection.start();
//         console.log("Connection established");
//       }

//       hubConnection.onclose(async () => {
//         console.log("Connection closed, attempting to reconnect...");
//         await signalRService.startConnection();
//       });
//     } catch (error) {
//       console.error("Error while establishing connection:", error);
//       throw error;
//     }
//   },

//   stopConnection: async () => {
//     try {
//       await hubConnection.stop();
//       console.log("Connection stopped!");
//     } catch (error) {
//       console.error("Error while stopping connection:", error);
//       throw error;
//     }
//   },

//   joinSession: async (joinSessionRequest) => {
//     try {
//       if (hubConnection.state === signalR.HubConnectionState.Connected) {
//         await hubConnection.invoke("JoinSession", joinSessionRequest);
//         console.log("Joined the session successfully!");
//       }
//     } catch (error) {
//       console.error("Error while joining the session:", error);
//       throw error;
//     }
//   },

//   connectedUsers: (callback = () => {}) => {
//     try {
//       hubConnection.on("ConnectedUsers", (connectedUsers) => {
//         callback(connectedUsers);
//       });
//     } catch (error) {
//       console.error("Error while joining the session:", error);
//       throw error;
//     }
//   },

//   ReceiveNotification: (callback = () => {}) => {
//     try {
//       hubConnection.on("ReceiveNotification", (actionType, message) => {
//         callback(actionType, message);
//       });
//     } catch (error) {
//       console.error("Error while joining the session:", error);
//       throw error;
//     }
//   },

//   AdminMessage: async (data) => {
//     try {
//       await hubConnection.invoke("AdminMessage", data);
//     } catch (error) {
//       console.error("Error while joining the session:", error);
//       throw error;
//     }
//   },

//   ProceedToNextQuestionInvoke: async (data) => {
//     // data ={
//     //   sessionID,  Yes
//     // }

//     try {
//       await hubConnection.invoke("ProceedToNextQuestion", data);
//     } catch (error) {
//       console.error("Error while sending to ProceedToNextQuestion:", error);
//       throw error;
//     }
//   },

//   ProceedToNextQuestionListener: async (callback = () => {}) => {
//     try {
//       // isFinal --> Yes || No
//       hubConnection.on("ProceedToNextQuestion", (isFinal) => {
//         callback(isFinal);
//       });
//     } catch (error) {
//       console.error("Error while listening ProceedToNextQuestion:", error);
//       throw error;
//     }
//   },

//   SendVotes: async (data) => {
//     try {
//       await hubConnection.invoke("SubmitVote", data);
//       console.log("Vote Submitted");
//     } catch (error) {
//       console.error("Error while sending SubmitVote:", error);
//       throw error;
//     }
//   },

//   GetVotingDetails: async (callback = () => {}) => {
//     try {
//       hubConnection.on("ReceiveVotingInfo", (votesDetails) => {
//         callback(votesDetails);
//       });
//       console.log("Vote Submitted");
//     } catch (error) {
//       console.error("Error while sending SubmitVote:", error);
//       throw error;
//     }
//   },
// };

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

  // Ensure a single instance of SignalRService is used
  static getInstance() {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }
}

export const signalRService = SignalRService.getInstance();
