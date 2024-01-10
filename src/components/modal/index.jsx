import React, { useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import ReactDOM from "react-dom";
import styles from "./modal.module.css";

// const ModalContainer = ({ children }) => {
//   const modalRoot = document.getElementById("modal-root");
//   const modalElement = document.createElement("div");

//   modalRoot.appendChild(modalElement);

//   return ReactDOM.createPortal(
//     <div className={styles.container}>{children}</div>,
//     modalElement
//   );
// };

const ModalContainer = ({ children }) => {
  const element = useRef()  
  // here the element is created only once
  if (!element.current) {
    element.current = document.createElement('div');
    element.current.classList.add(styles.container);
  } 

  useLayoutEffect(() => {
      const target = document.getElementById('modal-root')
      // element is attached to the target only once
      target.appendChild(element.current)
      return () => {
          // remove your created element on unmount
          target.removeChild(element.current)
      }
  }, [])

  return createPortal(children, element.current)
}

export default ModalContainer;
