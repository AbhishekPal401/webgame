import React, { useState } from "react";
import Button from "../common/button";
import { signalRService } from "../../services/signalR";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isJSONString } from "../../utils/common";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import "@appkit4/styles/appkit.min.css";
import { TextEditor } from "@appkit4/react-text-editor";
import "@appkit4/react-text-editor/dist/appkit4-react-texteditor.min.css";
import styles from "./nudges.module.css";

const sampleConfig = {
  toolbar: [
    "fontFamily",
    "fontSize",
    "bold",
    "italic",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "alignment:justify",
  ],
};

const Nudges = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  // console.log("message", message);

  const sendNotification = () => {
    console.log("message", message);
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    if (message === "" || message === "<p><br></p>") {
      toast.error("Message cannot be empty");
      return;
    }

    const data = {
      InstanceID: sessionData.InstanceID,
      UserID: credentials.data.userID,

      UserRole: credentials.data.role,
      UserName: credentials.data.userName,

      ActionType: "Nudges",
      Message: message,
    };

    signalRService.NotificationInvoke(data);

    setMessage("");
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.header}
        onClick={() => {
          setShow((prev) => {
            return !prev;
          });
        }}
      >
        <div>Nudges</div>
        <div className={`${styles.arrow} ${show ? styles.show : ""}`}>
          <svg onClick={() => {}}>
            <use xlinkHref={"sprite.svg#up_arrow"} />
          </svg>
        </div>
      </div>
      {show && (
        <div className={styles.description}>
          <div className={styles.input}>
            {/* <textarea
              value={message}
              draggable={false}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></textarea> */}
            {/* <ReactQuill
              className={styles.quill}
              value={message}
              onChange={setMessage}
              modules={Nudges.modules}
              formats={Nudges.formats}
              placeholder="Write your message..."
            /> */}
            <TextEditor
              config={sampleConfig}
              className={styles.quill}
              data={message}
              onChange={(event, value, message) => {
                setMessage(message);
              }}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button onClick={sendNotification}>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
};

Nudges.modules = {
  toolbar: [
    [{ color: [] }],
    ["clean"],
    ["bold", "italic", "underline"],

    [{ align: "center" }, { align: "right" }, { align: "justify" }],
  ],
};

Nudges.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "color",
];

export default Nudges;
