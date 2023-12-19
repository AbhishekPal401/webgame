import React, { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { azureConfig } from "../../../constants/azure.js";
import Button from "../../../components/common/button/index.jsx";
import styles from "./azure.module.css";
import axios from "axios";
import { baseUrl } from "../../../middleware/url.js";
import { azurelogin } from "../../../store/auth/login.js";
import { useDispatch } from "react-redux";

const azure = () => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    publicClientApp.initialize();
  }, []);

  const login = async () => {
    try {
      const loginResponse = await publicClientApp.loginPopup({
        scopes: azureConfig.scopes,
        prompt: "select_account",
      });

      if (loginResponse?.account?.username) {
        const email = loginResponse?.account?.username;

        dispatch(azurelogin({ emailID: email }));
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Button customClassName={styles.microsoftLoginButton} onClick={login}>
      Login with PWC
    </Button>
  );
};

export default azure;
