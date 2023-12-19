import React from "react";
import styles from "./buttonlink.module.css";
import { Link } from "react-router-dom";

const ButtonLink = ({
  isActive = false,
  svgSrc = "",
  style = {},
  linkTo = "",
  disabled = false,
  svgStyle = {},
  onClick = () => {},
}) => {
  const Container = disabled ? "div" : Link;

  return (
    <Container
      to={!disabled ? linkTo : ""}
      style={style}
      className={styles.iconContainer}
      onClick={onClick}
    >
      <svg
        style={svgStyle}
        className={isActive ? styles.logoActive : styles.logoInactive}
        onClick={onClick}
      >
        <use xlinkHref={svgSrc} />
      </svg>
    </Container>
  );
};

export default ButtonLink;
