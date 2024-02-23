import React, { useEffect, useState } from "react";
import styles from "./intromedia.module.css";
import { extractFileType } from "../../utils/helper";
import PDFPreview from "../preview/pdfpreview";
import DOMPurify from "dompurify";

const IntroMedia = ({
  onCancel = () => { },
  mediaURL = "",
  description = "",
  mediaType = "",
}) => {
  const [resourceType, setResourceType] = useState("");

  useEffect(() => {
    if (mediaURL) {
      const fileType = extractFileType(mediaURL);

      if (fileType.includes("mp3")) {
        setResourceType("Audio");
      } else if (fileType.includes("mp4")) {
        setResourceType("Video");
      } else if (fileType.includes("pdf")) {
        setResourceType("Pdf");
      } else if (
        fileType.includes("png") ||
        fileType.includes("jpg") ||
        fileType.includes("jpeg")
      ) {
        setResourceType("Image");
      }
    }
  }, [mediaType, mediaURL]);

  // console.log("mediaURL", mediaURL);
  // console.log("description", description);
  // console.log("resourceType", resourceType);

  return (
    <div className={"modal_content"}
      style={{
        width: "80vw",
        height: "85vh",
        overflowY: "auto",
      }}>
      <div className={"modal_header"}>
        <div>Introduction Resource</div>
        <div>
          <svg className="modal_crossIcon" onClick={onCancel}>
            <use xlinkHref={"sprite.svg#crossIcon"} />
          </svg>
        </div>
      </div>
      <div className={"modal_description"} style={{ marginBottom: "2rem" }}>
        {description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          ></div>
        ) : (
          ""
        )}
      </div>

      <div style={{ height: "72vh" }}>
        {resourceType === "Video" ? (
          <video controls className={styles.video}>
            <source src={mediaURL} />
            Your browser does not support the video tag.
          </video>
        ) : resourceType === "Audio" ? (
          <div className={styles.audio}>
            <img src="./images/audio_background.png" alt="Audio Background" />
            <audio controls>
              <source src={mediaURL} />
              Your browser does not support the audio tag.
            </audio>
          </div>
        ) : resourceType === "Pdf" ? (
          <PDFPreview pdfUrl={mediaURL} customStyles={styles.pdf} />
        ) : resourceType === "Image" ? (
          <img
            src={mediaURL}
            alt="resource Image"
            className={styles.previewImage}
          />
        ) : null}
      </div>
    </div>
  );
};

export default IntroMedia;
