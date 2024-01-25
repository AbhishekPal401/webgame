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
  customFileNameContainerClass = {},
  hint = "",
  fileSrc = "",
  fileSrcType = "",
  fileName = "",
  resetFile = false,
  isUploaded = {},
  setUrl = () => { },
  onUpload = () => { },
  onResetFile = () => { },
  allowedFileTypes = [],
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
      if (allowedFileTypes.includes(file.type)) {
        const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

        console.log("file type: ", file.type);
        console.log("file name: ", file.name);
        console.log("file size: ", fileSizeInMB);

        setFileInfo({
          type: file.type,
          name: file.name,
          size: fileSizeInMB,
        });

        onUpload(file);

        const reader = new FileReader();
        reader.onload = (e) => {
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
        setError("Invalid file type. Please choose a valid file.");
        console.log("Invalid file type. Please choose a valid file :", file.type);
      }
    }
  }, [error, onUpload, allowedFileTypes]);


  // const onDrop = useCallback((acceptedFiles) => {
  //   const file = acceptedFiles[0];

  //   if (file) {
  //     if (allowedFileTypes.includes(file.type)) {
  //       console.log("file type: ", file.type);
  //       console.log("file type: ", file.name);
  //       console.log("file type: ", file.size);
  //       onUpload(file);

  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         setUrl(e.target.result);
  //         setError(null);
  //       };
  //       reader.readAsDataURL(file);
  //       // toast.success("File upload successfull.")
  //     } else {
  //       setError("Invalid file type. Please choose a valid file.");
  //       console.log("Invalid file type. Please choose a valid file.");
  //     }
  //   }

  // }, [error]);

  const handleRemoveFile = () => {
    setUrl("");
    setError(null);
    resetFileInfo();
    onResetFile();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes.join(','),
  });

  return (
    <>
      <div style={customstyle} className={styles.label}>
        {label}
      </div>

      {/* <div style={customstyle} className={styles.label}>
        {label}
      </div> */}
      <div {...getRootProps()} className={`${styles.container} ${customContainerClass}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <>
            {fileSrc ? (
              <div className={styles.previewContainer}>
                {(fileSrcType === fileTypes.VIDEO_EXTENSION ||
                  fileSrcType === fileTypes.MIME_VIDEO
                ) ? (

                  <video controls>
                    <source src={fileSrc} type={fileTypes.VIDEO} />
                    Your browser does not support the video tag.
                  </video>

                ) : (
                  fileSrcType === fileTypes.AUDIO_EXTENSION ||
                  fileSrcType === fileTypes.MIME_AUDIO_1 ||
                  fileSrcType === fileTypes.MIME_AUDIO_2
                ) ? (

                  <img
                    src="./images/icon-audio.png"
                    alt="PPT icon png"
                    className={styles.previewImage}
                  />

                ) : (fileSrcType === fileTypes.MIME_EXCEL_1 ||
                  fileSrcType === fileTypes.MIME_EXCEL_2
                ) ? (

                  <div>
                    <img src="./images/icon-excel.png" alt="Excel file png" />
                  </div>


                ) : (fileSrcType === fileTypes.IMAGE_EXTENSION_1 ||
                  fileSrcType === fileTypes.IMAGE_EXTENSION_2 ||
                  fileSrcType === fileTypes.IMAGE_EXTENSION_3 ||
                  fileSrcType === fileTypes.MIME_IMAGE_1 ||
                  fileSrcType === fileTypes.MIME_IMAGE_2 ||
                  fileSrcType === fileTypes.MIME_IMAGE_3
                ) ? (

                  <img
                    src={fileSrc}
                    alt="Profile Image"
                    className={styles.previewImage}
                  />

                ) : (fileSrcType === fileTypes.MIME_PDF_1 ||
                  fileSrcType === fileTypes.PDF_EXTENSION
                ) ? (

                  <img
                    src="./images/icon-pdf.png"
                    alt="PDF icon png"
                    className={styles.previewImage}
                  />

                ) : (
                  fileSrcType === fileTypes.MIME_POWERPOINT_1 ||
                  fileSrcType === fileTypes.MIME_POWERPOINT_2 ||
                  fileSrcType === fileTypes.MIME_POWERPOINT_3 ||
                  fileSrcType === fileTypes.POWERPOINT_EXTENSION
                ) ? (

                  <img
                    src="./images/icon-ppt.png"
                    alt="PPT icon png"
                    className={styles.previewImage}
                  />


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

      {(fileSrc && allowedFileTypes.includes(fileSrcType)
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

      <div className={`${styles.hint} ${customHintClass}`}>{hint}</div>
    </>
  );
};

export default FileDropZone;
