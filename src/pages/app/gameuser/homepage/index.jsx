import React from "react";
import { motion } from "framer-motion";
import styles from "./homepage.module.css";

const UserHomePage = () => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      In development
    </motion.div>
  );
};

export default UserHomePage;
