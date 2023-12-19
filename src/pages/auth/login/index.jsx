import React, { useEffect } from "react";
import styles from "./login.module.css";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "../../../components/forms/loginForm";
import backgroundImage from "../../../assets/images/loginbackground.png";
const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerLeftColumn}>
        <LoginForm />
      </div>
      <div className={styles.containerRightColumn}>
        <img src={backgroundImage}></img>
      </div>
    </div>
  );
};

export default Login;
