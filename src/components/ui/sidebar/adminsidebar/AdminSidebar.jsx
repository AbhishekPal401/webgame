import React, { useState } from "react";
import styles from "./adminsidebar.module.css";
import ButtonLink from "../../../common/ButtonLink/index.jsx";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActive } from "../../../../store/local/sidebar.js";
import { useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const { currentActive } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();
  const location = useLocation();

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
          isActive={currentActive === "logout"}
          svgSrc="sprite.svg#logout"
          onClick={() => {
            dispatch(setCurrentActive("logout"));
          }}
        />
      </div>
    </div>
  );
};

export default AdminSidebar;
