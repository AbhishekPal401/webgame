import React, { useState } from "react";
import styles from "./adminsidebar.module.css";
import ButtonLink from "../../common/ButtonLink";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentActive } from "../../../store/local/sidebar.js";

const AdminSidebar = () => {
  const { currentActive } = useSelector((state) => state.sidebar);

  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <ButtonLink
        style={{
          marginTop: "2rem",
        }}
        linkTo="/"
        isActive={currentActive === "home"}
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("home"));
        }}
      />

      <ButtonLink
        linkTo="/users"
        isActive={currentActive === "users"}
        svgSrc="sprite.svg#homepage"
        onClick={() => {
          dispatch(setCurrentActive("users"));
        }}
      />

      <ButtonLink
        linkTo="/scenario"
        isActive={currentActive === "scenario"}
        svgSrc="sprite.svg#scenario"
        onClick={() => {
          dispatch(setCurrentActive("scenario"));
        }}
      />
      <ButtonLink
        linkTo="/questionbuilder"
        isActive={currentActive === "questionbuilder"}
        svgSrc="sprite.svg#questionBuilder"
        onClick={() => {
          dispatch(setCurrentActive("questionbuilder"));
        }}
      />
      <ButtonLink
        linkTo="/decisiontree"
        isActive={currentActive === "decisiontree"}
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
