import React, { useState } from "react";
import styles from "./homepage.module.css";
import Button from "../../../../components/common/button";
import { motion } from "framer-motion";
const UserHomePage = () => {
  const [ready, setReady] = useState(true);

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div className={styles.contentContainer}>
        <h3>Welcome to</h3>
        <h1>Game of Risks</h1>
        <div className={styles.players}>
          <div>
            <Button
              customClassName={ready ? styles.button : styles.buttonDisabled}
            >
              Ready
            </Button>
          </div>
          <div className={styles.wait}>
            {/* <div>Waiting for players to join</div>
            <div className={styles.users}>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                COO
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                CTO
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: "6em" }}
                animate={{ opacity: 1, x: "0" }}
                exit={{ opacity: 0, x: "-6rem" }}
                transition={{ duration: 0.8, damping: 10 }}
                className={styles.userbadge}
              >
                CFO
              </motion.div>
            </div> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserHomePage;
