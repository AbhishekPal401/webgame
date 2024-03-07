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
  const config1 = new UserManager(authInfo.userManager.settings);
  const openIdLogin = async () => {
    config1
      .signinRedirect()
      .then((response) => {
        console.log("response", response);
        console.log("id_token in popoup callback", response?.id_token);

        if (response && response.profile && response.profile.preferredMail) {
          dispatch(
            pwclogin(
              { emailID: response.profile.preferredMail },
              {
                id_token: response.id_token,
                settings: authInfo.userManager.settings,
              }
            )
          );
        }
      })
      .catch((e) => {
        console.log("error", e);
        toast.error(`Unable to login ${e?.message} `);
      });
  };

  useEffect(() => {
    config1.getUser().then((user) => {
      if (user) {
        console.log("user", user);
        if (user && user.profile && user.profile.preferredMail) {
          dispatch(
            pwclogin(
              { emailID: user.profile.preferredMail },
              {
                id_token: user.id_token,
                settings: authInfo.userManager.settings,
              }
            )
          );
        }
      }
    });
  }, [config1]);

  // useEffect(() => {
  //   config1.getUser().then((user) => {
  //     if (user) {
  //       console.log("user", user);
  //     }
  //   });
  // }, [config1]);

  // const openIdLogin = async () => {
  //   console.log("authInfo.userManager.settings", authInfo.userManager.settings);

  //   const config1 = new UserManager(authInfo.userManager.settings);

  //   config1
  //     .signinRedirect()
  //     .then((response) => {
  //       console.log("response", response);
  //       console.log("id_token in popoup callback", response?.id_token);

  //       if (response && response.profile && response.profile.preferredMail) {
  //         dispatch(
  //           pwclogin(
  //             { emailID: response.profile.preferredMail },
  //             {
  //               id_token: response.id_token,
  //               settings: authInfo.userManager.settings,
  //             }
  //           )
  //         );
  //       }
  //     })
  //     .catch((e) => {
  //       console.log("error", e);
  //       toast.error(`Unable to login ${e?.message} `);
  //     });
  // };

  return (
    <Button customClassName={styles.microsoftLoginButton} onClick={openIdLogin}>
      Login via PwC
    </Button>
  );
};

export default azure;
