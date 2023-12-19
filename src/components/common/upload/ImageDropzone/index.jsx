import React, { useCallback } from "react";
import styles from "./imagedropzone.module.css";
import { useDropzone } from "react-dropzone";

const ImageDropZone = ({ label = "" }) => {
  const onDrop = useCallback((acceptedFiles) => {}, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      <div className={styles.label}>{label}</div>
      <div {...getRootProps()} className={styles.container}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </>
  );
};

export default ImageDropZone;
