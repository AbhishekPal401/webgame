import React from "react";
import styles from "./intromedia.module.css";

const IntroMedia = ({
  onCancel = () => {},
  mediaURL = "",
  description = "",
  mediaType = "",
}) => {
  console.log("mediaURL", mediaURL);
  console.log("description", description);

  let resource = "";

  if (mediaType === "Video" && mediaURL) {
    resource = (
      <video controls className={styles.video}>
        <source src={mediaURL} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className={"modal_content"} style={{ width: "80vw" }}>
      <div className={"modal_header"}>
        <div>Introduction Resource</div>
        <div>
          <svg className="modal_crossIcon" onClick={onCancel}>
            <use xlinkHref={"sprite.svg#crossIcon"} />
          </svg>
        </div>
      </div>
      <div className={"modal_description"} style={{ marginBottom: "2rem" }}>
        {description ? description : ""}
      </div>

      <div style={{ height: "72vh" }}>{resource}</div>
    </div>
  );
};

export default IntroMedia;
