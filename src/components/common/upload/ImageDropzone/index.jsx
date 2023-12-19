import React, { useCallback } from "react";
import styles from "./imagedropzone.module.css";
import { useDropzone } from "react-dropzone";

const ImageDropZone = ({ label = "", customstyle = {} }) => {
  const onDrop = useCallback((acceptedFiles) => {}, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div style={customstyle} className={styles.label}>
        {label}
      </div>
      <div {...getRootProps()} className={styles.container}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag and drop or <label>Choose file</label>{" "}
          </p>
        )}
      </div>
      <div className={styles.hint}>Eligible Formats: JPG and PNG</div>
    </>
  );
};

export default ImageDropZone;
