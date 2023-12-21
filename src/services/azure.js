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

    console.log("email in service", email);

    return { email: email };
  },
  azureLogout: async () => {
    try {
      await publicClientApp.logoutPopup({
        mainWindowRedirectUri: azureConfig.redirectURL,
      });
    } catch (error) {
      console.error("error", error);
    }
  },
};
