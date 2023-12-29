import React, { useEffect, useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { azureConfig } from "../../../constants/azure.js";
import Button from "../../../components/common/button/index.jsx";
import styles from "./azure.module.css";

import { azurelogin } from "../../../store/auth/login.js";
import { useDispatch } from "react-redux";
import { azureService } from "../../../services/azure.js";
import { toast } from "react-toastify";

const azure = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    azureService.azureInit();
  }, []);

  const login = async () => {
    try {
      const { email } = await azureService.azureLogin();

      if (email) {
        dispatch(azurelogin({ emailID: email }));
      }
    } catch (error) {
      toast.error("Azure AD login error:", JSON.stringify(error));

      if (
        error.errorMessage &&
        error.errorMessage.includes("consent_required")
      ) {
        toast.error(
          "Insufficient permissions. Please grant the required permissions."
        );
      }
    }
  };

  return (
    <Button customClassName={styles.microsoftLoginButton} onClick={login}>
      Login with PWC
    </Button>
  );
};

export default azure;
