import React, { useEffect, useState } from "react";
import Button from "../../common/button";
import Input from "../../common/input";
import Checkbox from "../../ui/checkbox";
import styles from "./loginForm.module.css";
import pwcLogo from "../../../assets/logo/pwc.png";
import { Link } from "react-router-dom";
import { validateEmail } from "../../../utils/validators";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../../store/auth/login.js";
import Azure from "../../../pages/auth/azure/azure.jsx";

const LoginForm = () => {
  const [loginData, setLoginData] = useState({
    username: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
  });

  const dispatch = useDispatch();

  const onChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: {
        value: e.target.value,
        error: "",
      },
    });
  };

  const loginSubmit = (e) => {
    e.preventDefault();

    let valid = true;
    let data = loginData;

    if (loginData.username.value === "") {
      data = {
        ...loginData,
        username: {
          ...loginData.username,
          error: "Please enter username",
        },
      };

      valid = false;
    } else if (
      loginData.username.value.includes("@") &&
      !validateEmail(loginData.username.value)
    ) {
      data = {
        ...loginData,
        username: {
          ...loginData.username,
          error: "Please enter a valid email",
        },
      };
      valid = false;
    }

    if (loginData.password.value === "") {
      data = {
        ...loginData,
        password: {
          ...loginData.password,
          error: "Please enter password",
        },
      };
      valid = false;
    }

    // else if (loginData.password.value.length < 8) {
    //   data = {
    //     ...loginData,
    //     password: {
    //       ...loginData.password,
    //       error: "Password must be at least 8 characters",
    //     },
    //   };
    //   valid = false;
    // }

    if (valid) {
      const data = {
        username: loginData.username.value,
        password: loginData.password.value,
      };

      dispatch(login(data));
    } else {
      setLoginData(data);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLogo}>
        <img src={pwcLogo} alt="PWC black and white logo" />
      </div>
      <div className={styles.containerHeading}>
        <h3>Game of Risks</h3>
        <p>Please login to continue</p>
      </div>

      <div>
        <Input
          type="text"
          name={"username"}
          label="Username"
          onChange={onChange}
        />
        <Input
          type="password"
          name={"password"}
          label="Password"
          customStyle={{
            marginTop: "2rem",
          }}
          onChange={onChange}
        />
      </div>

      <div style={{ marginTop: "1.2rem" }}>
        <Checkbox label="Remember me" />
      </div>

      <div className={styles.containerRow}>
        <Link className={styles.forgotpassword}>Forgot Password ?</Link>
        <div>
          <Button type="submit" buttonType="login" onClick={loginSubmit}>
            Login
          </Button>
        </div>
      </div>
      <div className={styles.containerDivider}>
        <hr />
      </div>
      <div>
        <Azure />
      </div>
    </div>
  );
};

export default LoginForm;
