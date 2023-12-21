// authService.js (authentication service)
import { PublicClientApplication } from "@azure/msal-browser";
import { azureConfig } from "../constants/azure";

const publicClientApp = new PublicClientApplication({
  auth: {
    clientId: azureConfig.appId,
    redirectUri: azureConfig.redirectURL,
    authority: azureConfig.authority,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
});

export const azureService = {
  azureInit: async () => {
    publicClientApp.initialize();
  },

  azureLogin: async () => {
    const loginResponse = await publicClientApp.loginPopup({
      scopes: azureConfig.scopes,
      prompt: "select_account",
    });

    const email = loginResponse?.account?.username;

    return { email: email };
  },
  azureLogout: async () => {
    try {
      await publicClientApp.logoutPopup({
        mainWindowRedirectUri: azureConfig.redirectURL,
      });

      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("error", error);

      return { success: false, message: "Logout failed" };
    }
  },
};
