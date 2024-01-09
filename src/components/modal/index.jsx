import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";

const ModalContainer = ({ children, autoFocusInput }) => {
  const modalRoot = document.getElementById("modal-root");
  const modalElement = document.createElement("div");

  modalRoot.appendChild(modalElement);

  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current && autoFocusInput) {
      modalRef.current.focus();
    }
  }, [autoFocusInput]);

  return ReactDOM.createPortal(
    <div className={styles.container} ref={modalRef} tabIndex="-1">
      {children}
    </div>,
    modalElement
  );
};

export default ModalContainer;
