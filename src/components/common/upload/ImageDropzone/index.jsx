import React, { useCallback, useEffect, useState } from "react";
import styles from "./imagedropzone.module.css";
import { useDropzone } from "react-dropzone";

const ImageDropZone = ({
  label = "",
  customstyle = {},
  resetImage = false,
  onUpload = () => {},
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Please choose a JPG or PNG file.");
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  useEffect(() => {
    if (resetImage) {
      setSelectedImage(null);
    }
  }, [resetImage]);

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
            {selectedImage ? (
              <div className={styles.previewContainer}>
                <img
                  src={selectedImage}
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

      <div className={styles.hint}>Eligible Formats: JPG and PNG</div>
    </>
  );
};

export default ImageDropZone;
