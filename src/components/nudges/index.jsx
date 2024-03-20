import React, { useState } from "react";
import Button from "../common/button";
import { signalRService } from "../../services/signalR";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isJSONString } from "../../utils/common";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "@appkit4/styles/appkit.min.css";
import "@appkit4/react-text-editor/dist/appkit4-react-texteditor.min.css";
import { TextEditor } from "@appkit4/react-text-editor";
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

function getTotalTextLength(node) {
  let totalLength = 0;

  console.log("node", node);

  // If the node is a text node, add its length to the total length
  if (node.nodeType === Node.TEXT_NODE) {
    console.log("node length", node.textContent.trim().length);
    totalLength += node.textContent.trim().length;
  }

  // Traverse each child node of the current node
  if (node.childNodes) {
    for (let i = 0; i < node.childNodes.length; i++) {
      // If the node has child nodes, recursively call the function
      if (node.childNodes[i].nodeType === Node.ELEMENT_NODE) {
        totalLength += getTotalTextLength(node.childNodes[i]);
      }
    }
  }

  console.log("totalLength", totalLength);

  return totalLength;
}

function stringToHTML(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.firstChild;
}

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

    // console.log("count", getTotalTextLength(stringToHTML(message)));

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
            <ReactQuill
              className={styles.quill}
              value={message}
              onChange={setMessage}
              modules={Nudges.modules}
              formats={Nudges.formats}
              placeholder="Write your message..."
            />
            {/* <TextEditor
              config={sampleConfig}
              className={styles.quill}
              data={message}
              onChange={(event, value, message) => {
                setMessage(message);
              }}
            /> */}
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
