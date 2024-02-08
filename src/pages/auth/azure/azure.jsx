import React, { useEffect, useState } from "react";
import Button from "../../../components/common/button/index.jsx";
import styles from "./azure.module.css";

import { pwclogin } from "../../../store/auth/login.js";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAuth, UserManager } from "oidc-react";

const azure = () => {
  const dispatch = useDispatch();

  const authInfo = useAuth();

  const openIdLogin = async () => {
    const config1 = new UserManager(authInfo.userManager.settings);

    config1
      .signinPopup()
      .then((response) => {
        console.log("response", response);
        if (response && response.profile && response.profile.email) {
          dispatch(pwclogin({ email: response.profile.email }));
        }
      })
      .catch((e) => {
        console.log("error", e);
        toast.error(`Unable to login ${e?.message} `);
      });
  };

  return (
    <Button customClassName={styles.microsoftLoginButton} onClick={openIdLogin}>
      Login via PwC
    </Button>
  );
};

export default azure;
