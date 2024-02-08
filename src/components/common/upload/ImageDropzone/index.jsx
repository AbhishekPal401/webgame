import React, { useCallback, useEffect, useState } from "react";
import styles from "./imagedropzone.module.css";
import { useDropzone } from "react-dropzone";

const ImageDropZone = ({
  label = "",
  customstyle = {},
  resetImage = false,
  imageSrc = "",
  fileName = "",
  fileSrcType = "",
  customFileNameContainerClass = {},
  allowedFileTypes = [],
  setUrl = () => { },
  onUpload = () => { },
  onResetFile = () => { },
}) => {
  const [error, setError] = useState(null);


  const [fileInfo, setFileInfo] = useState({
    type: null,
    name: null,
    size: null,
  });

  const resetFileInfo = () => {
    setFileInfo({
      type: null,
      name: null,
      size: null,
    });
  }


  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {

        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        setFileInfo({
          type: file.type,
          name: file.name,
          size: fileSizeInMB,
        });

        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          // setSelectedImage(e.target.result);
          setUrl(e.target.result);
          setError(null);
        };

        // Log any errors during FileReader
        reader.onerror = (e) => {
          console.error("FileReader error:", e.target.error);
          setError("Error reading the file. Please try again.");
        };

        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Please choose a JPG or PNG file.");
      }
    }
  }, [error, onUpload]);

  const handleRemoveFile = () => {
    setUrl("");
    setError(null);
    resetFileInfo();
    onResetFile();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

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
          <>
            {imageSrc ? (
              <div className={styles.previewContainer}>
                <img
                  src={imageSrc}
                  alt="Profile Image"
                  className={styles.previewImage}
                />
              </div>
            ) : (
              <p>
                Drag and drop or <label>Choose file</label>
              </p>
            )}
          </>
        )}
      </div>
      {error && <div className={styles.error}>{error}</div>}

      {(imageSrc && allowedFileTypes.includes(fileSrcType)
      ) &&
        <div
          className={`${styles.fileNameContainer} ${customFileNameContainerClass}`}
        >
          <div>
            <span>{fileName || fileInfo.name}</span>
          </div>

          <div
            onClick={handleRemoveFile}
          >
            <svg
              className={styles.xMarkIcon}
              width="16"
              height="16"
            >
              <use xlinkHref={"sprite.svg#x_mark_icon"} />
            </svg>
          </div>
        </div>

      }

      <div className={styles.hint}>Eligible Formats: JPG and PNG</div>
    </>
  );
};

export default ImageDropZone;
