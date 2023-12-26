import React, { useCallback, useEffect, useState } from "react";
import styles from "./fileDropzone.module.css";
import { useDropzone } from "react-dropzone";

const FileDropZone = ({
  label = "",
  customstyle = {},
  fileSrc = "",
  resetFile = false,
  setUrl = () => {},
  onUpload = () => {},
}) => {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.type === "audio/mp3" || file.type === "video/mp4") {
        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setUrl(e.target.result);
          setError(null);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Invalid file type. Please choose a MP4 or MP3 file.");
      }
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "audio/mp3, video/mp4",
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
            {fileSrc ? (
              <div className={styles.previewContainer}>
                {fileSrc.type === "audio/mp3" ? (
                  <audio controls>
                    <source src={fileSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls>
                    <source src={fileSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
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

      <div className={styles.hint}>Eligible Formats: MP4 and MP3</div>
    </>
  );
};

export default FileDropZone;
