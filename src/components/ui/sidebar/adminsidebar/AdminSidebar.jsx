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
import MenuLink from "../../menulink/index.jsx";
import { 
  setIsResetScenarioState,
  setIsResetHomePageState,
  setIsResetMasterState,
  setIsResetGameInstanceState,
  setIsResetUserState,
} from "../../../../store/local/menu.js";

const AdminSidebar = ({
  isSideBarCollapsed,
  onCollapseClick = () => { },
}) => {
  // const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div
      className={`
          ${styles.container} ${isSideBarCollapsed ? styles.collapsed : styles.notCollapsed}
        `}
    >
      <>
        <MenuLink
          style={{
            marginTop: "2rem",
          }}
          linkTo="/"
          isActive={
            location.pathname === "/" || location.pathname.includes("home")
          }
          svgSrc="sprite.svg#homepage"
          label="Home"
          onClick={() => {
            dispatch(setCurrentActive("home"));
            dispatch(setIsResetHomePageState(true));
          }}
          displayLabel={isSideBarCollapsed}
          svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
          labelStyle={{
            display: isSideBarCollapsed ? "none" : "",
            transition: "display 0.5s ease-in",
          }}
        />

        <MenuLink
          linkTo="/masters"
          isActive={location.pathname.includes("/masters")}
          svgSrc="sprite.svg#masters"
          label="Masters"
          onClick={() => {
            dispatch(setCurrentActive("masters"));
            dispatch(setIsResetMasterState(true));
          }}
          displayLabel={isSideBarCollapsed}
          svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
          labelStyle={{
            display: isSideBarCollapsed ? "none" : "",
            transition: "display 0.5s ease-in",
          }}

        />

        <MenuLink
          linkTo="/scenario"
          isActive={location.pathname.includes("scenario") ||
            location.pathname.includes("questions")
          }
          svgSrc="sprite.svg#scenario"
          label="Scenarios"
          onClick={() => {
            dispatch(setCurrentActive("scenario"));
            dispatch(setIsResetScenarioState(true));
          }}
          displayLabel={isSideBarCollapsed}
          svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
          labelStyle={{
            display: isSideBarCollapsed ? "none" : "",
            transition: "display 0.5s ease-in",
          }}
        />

        <MenuLink
          linkTo="/instances"
          isActive={location.pathname.includes("instances")}
          svgSrc="sprite.svg#instances"
          label="Instances"
          onClick={() => {
            dispatch(setCurrentActive("instances"));
            dispatch(setIsResetGameInstanceState(true));
          }}
          displayLabel={isSideBarCollapsed}
          svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
          labelStyle={{
            display: isSideBarCollapsed ? "none" : "",
            transition: "display 0.5s ease-in",
          }}
        />

        <MenuLink
          linkTo="/users"
          isActive={location.pathname.includes("users")}
          svgSrc="sprite.svg#users"
          label="Users"
          onClick={() => {
            dispatch(setCurrentActive("users"));
            dispatch(setIsResetUserState(true));
          }}
          displayLabel={isSideBarCollapsed}
          svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
          labelStyle={{
            display: isSideBarCollapsed ? "none" : "",
            transition: "display 0.5s ease-in",
          }}
        />

        <div className={styles.bottomContainer}>
          <MenuLink
            disabled={true}
            // isActive={showLogoutModal}
            svgSrc={isSideBarCollapsed ? "sprite.svg#expand" : "sprite.svg#collapse"}
            label="Collapse"
            onClick={onCollapseClick}
            displayLabel={isSideBarCollapsed}
            svgStyle={{ width: isSideBarCollapsed ? '100%' : '30%' }}
            labelStyle={{
              display: isSideBarCollapsed ? "none" : "",
              transition: "display 0.5s ease-in",
            }}
          />
        </div>
      </>
      {/*
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
              linkTo="/masters"
              isActive={location.pathname.includes("/masters")}
              svgSrc="sprite.svg#masters"
              onClick={() => {
                dispatch(setCurrentActive("masters"));
              }}
            />

            <ButtonLink
              linkTo="/scenario"
              isActive={location.pathname.includes("scenario") ||
                location.pathname.includes("questions")
              }
              svgSrc="sprite.svg#scenario"
              onClick={() => {
                dispatch(setCurrentActive("scenario"));
              }}
            />

            <ButtonLink
              linkTo="/instances"
              isActive={location.pathname.includes("instances")}
              svgSrc="sprite.svg#instances"
              onClick={() => {
                dispatch(setCurrentActive("instances"));
              }}
            />

            <ButtonLink
              linkTo="/users"
              isActive={location.pathname.includes("users")}
              svgSrc="sprite.svg#users"
              onClick={() => {
                dispatch(setCurrentActive("users"));
              }}
            />

            <div className={styles.bottomContainer}>
              <ButtonLink
                disabled={true}
                // isActive={showLogoutModal}
                svgSrc="sprite.svg#logout"
                onClick={onCollapseClick}
              />
            </div>

            
          </>
          {showLogoutModal && (
        <ModalContainer>
          <div className={"modal_content"}>
            <div className={"modal_header"}>
              <div>Logout</div>
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
          */}

    </div >
  );
};

export default AdminSidebar;
