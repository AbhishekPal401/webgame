import React, { useEffect, useState } from "react";
import styles from "./intromedia.module.css";
import { extractFileType } from "../../utils/helper";
import PDFPreview from "../preview/pdfpreview";
import DOMPurify from "dompurify";
import axios from "axios";
import { baseUrl } from "../../middleware/url";
import QuestionLoader from "../loader/questionLoader";

const IntroMedia = ({
  onCancel = () => {},
  mediaURL = "",
  description = "",
  mediaType = "",
}) => {
  const [resourceType, setResourceType] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileStream, setFileStream] = useState(null);

  const getFileStream = async (url) => {
    setLoading(true);

    const data = {
      fileName: url,
      module: "Scenario",
    };

    const headers = { "Content-Type": "application/json" };

    const response = await axios.request({
      baseURL: baseUrl,
      url: "/api/Storage/GetFileStream",
      method: "POST",
      data: data,
      headers,
      responseType: "blob",
    });
    if (response.data) {
      setFileStream(URL.createObjectURL(new Blob([response.data])));
    }

    setLoading(false);
  };

  useEffect(() => {
    if (mediaURL) {
      getFileStream(mediaURL);
    }
  }, [mediaURL]);

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
    <div
      className={"modal_content"}
      style={{
        width: "80vw",
        height: "85vh",
        overflowY: "auto",
      }}
    >
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

      {loading ? (
        <div style={{ height: "50vh" }}>
          <QuestionLoader />
        </div>
      ) : (
        <div style={{ height: "72vh" }}>
          {resourceType === "Video" && fileStream ? (
            <video controls className={styles.video}>
              <source src={fileStream} />
              Your browser does not support the video tag.
            </video>
          ) : resourceType === "Audio" && fileStream ? (
            <div className={styles.audio}>
              <img src="./images/audio_background.png" alt="Audio Background" />
              <audio controls controlsList="nodownload">
                <source src={fileStream} />
                Your browser does not support the audio tag.
              </audio>
            </div>
          ) : resourceType === "Pdf" && fileStream ? (
            <PDFPreview pdfUrl={fileStream} customStyles={styles.pdf} />
          ) : resourceType === "Image" && fileStream ? (
            <img
              src={fileStream}
              alt="resource Image"
              className={styles.previewImage}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default IntroMedia;
