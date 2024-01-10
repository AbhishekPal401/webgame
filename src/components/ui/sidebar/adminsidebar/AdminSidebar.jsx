import React, { useState } from "react";
import styles from "./adminsidebar.module.css";
import ButtonLink from "../../../common/ButtonLink/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActive } from "../../../../store/local/sidebar.js";
import { useLocation } from "react-router-dom";
import ModalContainer from "../../../modal";
import Button from "../../../common/button/index.jsx";
import { logoutUser } from "../../../../store/auth/login.js";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <ButtonLink
        style={{
          marginTop: "2rem",
        }}
        linkTo="/"
        isActive={
          location.pathname === "/" || location.pathname.includes("home")
        }
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("home"));
        }}
      />

      <ButtonLink
        linkTo="/users"
        isActive={location.pathname.includes("/users")}
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("users"));
        }}
      />

      <ButtonLink
        linkTo="/instances"
        isActive={location.pathname.includes("/instances")}
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("instances"));
        }}
      />

      <ButtonLink
        linkTo="/masters"
        isActive={location.pathname.includes("/masters")}
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("masters"));
        }}
      />
      {/* <ButtonLink
        linkTo="/masters"
        isActive={location.pathname.includes("/masters")}
        svgSrc="sprite.svg#masters"
        onClick={() => {
          dispatch(setCurrentActive("masters"));
        }}
      /> */}

      <ButtonLink
        linkTo="/scenario"
        isActive={location.pathname.includes("scenario")}
        svgSrc="sprite.svg#scenario"
        onClick={() => {
          dispatch(setCurrentActive("scenario"));
        }}
      />
      <ButtonLink
        linkTo="/questionbuilder"
        isActive={location.pathname.includes("questionbuilder")}
        svgSrc="sprite.svg#questionBuilder"
        onClick={() => {
          dispatch(setCurrentActive("questionbuilder"));
        }}
      />
      <ButtonLink
        linkTo="/decisiontree"
        isActive={location.pathname.includes("decisiontree")}
        svgSrc="sprite.svg#decisionTree"
        onClick={() => {
          dispatch(setCurrentActive("decisiontree"));
        }}
      />

      <div className={styles.bottomContainer}>
        <ButtonLink
          disabled={true}
          isActive={showLogoutModal}
          svgSrc="sprite.svg#logout"
          onClick={() => {
            setShowLogoutModal(true);
          }}
        />
      </div>

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

export default AdminSidebar;
