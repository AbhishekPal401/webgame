import React, { useState, useRef } from "react";
import styles from "./imagecontroller.module.css";
import Button from "../../common/button";

const ImageController = ({
  imageUrl,
  showButton = false,
  onButtonClick = () => {},
  buttonLabel = "Skip",
}) => {
  return (
    <div className={`${styles.container} `}>
      <img
        src={imageUrl}
        alt="Question Intro Image"
        className={styles.previewImage}
      />
      {showButton ? (
        <div
          className={styles.skipContainer}
          style={{
            backgroundImage: 'url("./images/grey_strip.png")',
          }}
        >
          <Button onClick={onButtonClick}>{buttonLabel}</Button>
        </div>
      ) : null}
    </div>
  );
};

export default ImageController;
