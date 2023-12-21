import React, { useCallback, useEffect, useState } from "react";
import styles from "./fileDropzone.module.css";
import { useDropzone } from "react-dropzone";

const FileDropZone = ({
  label = "",
  customstyle = {},
  resetFile = false,
  onUpload = () => {},
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (file.type === "audio/mp3" || file.type === "video/mp4") {
        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedFile(e.target.result);
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
  
  useEffect(() => {
    if (resetFile) {
      setSelectedFile(null);
    }
  }, [resetFile]);

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
            {selectedFile ? (
              <div className={styles.previewContainer}>
                {selectedFile.type === "audio/mp3" ? (
                  <audio controls>
                    <source src={selectedFile} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <video controls>
                    <source src={selectedFile} type="video/mp4" />
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
