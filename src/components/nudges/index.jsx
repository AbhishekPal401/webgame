import React, { useState } from "react";
import styles from "./nudges.module.css";
import Button from "../common/button";
import { signalRService } from "../../services/signalR";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { isJSONString } from "../../utils/common";

const Nudges = () => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const sendNotification = () => {
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    if (message === "") {
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
            <textarea
              value={message}
              draggable={false}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            ></textarea>
          </div>
          <div className={styles.buttonContainer}>
            <Button onClick={sendNotification}>Send</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nudges;
