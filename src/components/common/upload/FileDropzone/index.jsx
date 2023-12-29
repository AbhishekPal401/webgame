import React, { useCallback, useEffect, useState } from "react";
import styles from "./fileDropzone.module.css";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { fileTypes } from "../../../../constants/filetypes";
import uploadeSuccessPng from "../../../../../public/images/correct-icon.png";

const FileDropZone = ({
  label = "",
  customstyle = {},
  customContainerClass = {},
  customHintClass = {},
  hint = "",
  fileSrc = "",
  fileSrcType = "",
  resetFile = false,
  isUploaded = {},
  setUrl = () => { },
  onUpload = () => { },
  allowedFileTypes = [],
}) => {
  const [error, setError] = useState(null);

  console.log("fileSrcType :", fileSrcType);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      if (allowedFileTypes.includes(file.type)) {
        console.log("file type: ", file.type);
        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
          setUrl(e.target.result);
          setError(null);
        };
        reader.readAsDataURL(file);
        toast.success("File upload successfull.")
      } else {
        setError("Invalid file type. Please choose a valid file.");
        console.log("Invalid file type. Please choose a valid file.");
      }
    }

  }, [error]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes.join(','),
  });

  return (
    <>
      <div style={customstyle} className={styles.label}>
        {label}
      </div>
      <div {...getRootProps()} className={`${styles.container} ${customContainerClass}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            {fileSrc ? (
              <div className={styles.previewContainer}>
                {(fileSrcType === fileTypes.MIME_AUDIO_1 || 
                  fileSrcType === fileTypes.MIME_AUDIO_2 ||
                  fileSrcType === fileTypes.AUDIO_EXTENSION
                  ) ? (

                  <audio controls>
                    <source src={fileSrc} type={fileTypes.AUDIO_2} />
                    Your browser does not support the audio element.
                  </audio>

                ) : (fileSrcType === fileTypes.VIDEO_EXTENSION || 
                    fileSrcType === fileTypes.MIME_VIDEO
                    ) ? (

                    <video controls>
                      <source src={fileSrc} type={fileTypes.VIDEO} />
                      Your browser does not support the video tag.
                    </video>

                ) : (fileSrcType === fileTypes.MIME_EXCEL_1 || 
                    fileSrcType === fileTypes.MIME_EXCEL_2
                    ) ? (

                  <div>
                    <img src={uploadeSuccessPng} alt="Excel file uploaded" />
                  </div>
                  
                ) : (
                  <p>
                    Drag and drop or <label>Choose file</label>
                  </p>
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

      <div className={`${styles.hint} ${customHintClass}`}>{hint}</div>
    </>
  );
};

export default FileDropZone;
