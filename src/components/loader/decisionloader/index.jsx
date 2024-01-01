import React from "react";

import styles from "./decision.module.css";
import ModalContainer from "../../modal";

const LoaderTypes = {
  DEFAULT: "default",
  BOUNCE: "bounce",
};

const DecisionLoader = ({
  type = LoaderTypes.DEFAULT,
  scale = 12,
  HeaderText = "Waiting for CTO's Final Decision...",
}) => {
  const data_scale = `${scale}rem`;

  return (
    <ModalContainer>
      <div className={styles.container}>
        <div>{HeaderText}</div>
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
      </div>
    </ModalContainer>
  );
};

export default DecisionLoader;
