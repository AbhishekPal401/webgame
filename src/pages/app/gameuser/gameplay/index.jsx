import React from "react";
import { motion } from "framer-motion";

const GamePlay = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, damping: 10 }}
    >
      <div>Game</div>
    </motion.div>
  );
};

export default GamePlay;
