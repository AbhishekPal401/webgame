import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./usernavbar.module.css";
import logo from "../../../assets/logo/pwclabel.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ModalContainer from "../../modal";
import { logoutUser } from "../../../store/auth/login";
import Button from "../../common/button";
import { signalRService } from "../../../services/signalR";
import { setConnectionState } from "../../../store/local/gameplay";
import { isJSONString } from "../../../utils/common";

const UserNavBar = ({ disable = false, role = "Player" }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const [initial, setInitials] = useState("");

  const { credentials } = useSelector((state) => state.login);
  const { isConnectedToServer } = useSelector((state) => state.gameplay);
  const { sessionDetails } = useSelector((state) => state.getSession);

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();

  const extractInitials = (username) => {
    const words = username.split(" ");

    if (words.length >= 2) {
      const firstNameInitial = words[0][0].toUpperCase();
      const lastNameInitial = words[words.length - 1][0].toUpperCase();

      return `${firstNameInitial}${lastNameInitial}`;
    } else {
      return username[0].toUpperCase();
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (credentials?.data) {
      const init = extractInitials(credentials.data.userName);

      if (init) {
        setInitials(init);
      }
    }
  }, []);

  useEffect(() => {
    //signalR connection initiated and joining room
    const startConnection = async () => {
      try {
        // Start the SignalR connection
        await signalRService.startConnection(() => {
          dispatch(setConnectionState(true));
        });
      } catch (error) {
        console.error("Error during connection ", error);
      }
    };

    dispatch(setConnectionState(false));

    startConnection();
  }, []);

  const joinRoom = useCallback(async () => {
    if (!isJSONString(sessionDetails.data)) return;
    const sessionData = JSON.parse(sessionDetails.data);

    const data = {
      InstanceID: sessionData.InstanceID,
      SessionID: sessionData.SessionID,
      UserID: credentials.data.userID,
      UserName: credentials.data.userName,
      UserRole: credentials.data.role,
      Designation: credentials?.data?.designation
        ? credentials.data.designation
        : "",
    };

    console.log("Joining the room...", data);
    await signalRService.joinSession(data);
  }, [sessionDetails, credentials]);

  useEffect(() => {
    if (isConnectedToServer) {
      if (
        location.pathname === "/" ||
        location.pathname.includes("/missioncompleted") ||
        location.pathname.includes("/game/") ||
        location.pathname.includes("/missioncompleted")
      )
        return;

      (async () => {
        try {
          await joinRoom();
        } catch (error) {
          console.error("Error during join room:", error);
        }
      })();
    }
  }, [isConnectedToServer]);

  if (disable) {
    return null;
  }

  return (
    <div className={styles.navbarContainer}>
      <div className={styles.icon}>
        <svg
          onClick={() => {
            // navigate("./");
          }}
        >
          <use xlinkHref={"sprite.svg#pwc"} />
        </svg>
      </div>

      <div className={styles.label}>Game of Risks</div>
      <div className={styles.containerRight}>
        <div className={styles.role}>
          {role === "Player" ? credentials.data.designation : "Admin"}
        </div>

        <div
          className={styles.profileIcon}
          profile_collapsed="true"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          {initial}
        </div>
      </div>

      {showDropdown && (
        <div ref={dropdownRef} className={styles.dropdownContainer}>
          <div className={styles.headRow}>
            <div className={styles.playerDetails}>
              {credentials?.data?.userName ? (
                <div>{credentials.data.userName}</div>
              ) : (
                <div></div>
              )}

              {credentials?.data?.emailID ? (
                <div>{credentials.data.emailID}</div>
              ) : (
                <div></div>
              )}
            </div>
            <div className={styles.profileIcon2}>{initial}</div>
          </div>
          <hr></hr>
          <div
            onClick={() => {
              setShowDropdown(false);
              navigate(`/profile/${credentials.data.userID}`);
            }}
            className={styles.row}
          >
            Edit Profile
          </div>
          <div
            className={styles.row}
            onClick={() => {
              setShowDropdown(false);
              setShowLogoutModal(true);
            }}
          >
            Logout
          </div>
        </div>
      )}

      {showLogoutModal && (
        <ModalContainer>
          <div className={"modal_content"}>
            <div className={"modal_header"}>
              <div>Logout:</div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowLogoutModal(null);
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className={"modal_description"}>
              Are you sure you want to logout ?
            </div>

            <div className={"modal_buttonContainer"}>
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowLogoutModal(null);
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={() => {
                  dispatch(logoutUser());
                  navigate("/");
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
    </div>
  );
};

export default UserNavBar;
