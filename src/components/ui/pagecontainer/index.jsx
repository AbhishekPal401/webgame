import React from "react";
import styles from "./pagecontainer.module.css";

const PageContainer = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};

export default PageContainer;
