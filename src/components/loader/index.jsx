import React from "react";
import Modal from "../modal";
import styles from "./loader.module.css";

const LoaderTypes = {
  DEFAULT: "default",
  BOUNCE: "bounce",
};

const Loader = ({ type = LoaderTypes.DEFAULT, scale = 24 }) => {
  const data_scale = `${scale}rem`;

  return (
    <Modal>
      <div
        style={{
          width: data_scale,
          height: data_scale,
          borderRadius: data_scale,
        }}
        className={styles.loaderContainer}
      >
        <svg data-animation={type}>
          <use xlinkHref={"sprite.svg#loader"} />
        </svg>
      </div>
    </Modal>
  );
};

export default Loader;