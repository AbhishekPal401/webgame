import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";

const ModalContainer = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  const modalElement = document.createElement("div");

  modalRoot.appendChild(modalElement);

  return ReactDOM.createPortal(
    <div className={styles.container}>{children}</div>,
    modalElement
  );
};

export default ModalContainer;
