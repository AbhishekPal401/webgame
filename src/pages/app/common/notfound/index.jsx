import React, { useEffect } from "react";
import styles from "./notfound.module.css";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, []);

  return <div>NotFound</div>;
};

export default NotFound;
