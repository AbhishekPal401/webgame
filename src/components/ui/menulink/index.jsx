import React from "react";
import styles from "./menulink.module.css";
import { Link } from "react-router-dom";

const MenuLink = ({
    isActive = false,
    svgSrc = "",
    style = {},
    linkTo = "",
    disabled = false,
    svgStyle = {},
    label,
    labelStyle,
    displayLabel,
    onClick = () => { },
}) => {
    const Container = disabled ? "div" : Link;

    return (
        <Container
            to={!disabled ? linkTo : ""}
            style={{ backgroundColor: isActive ? 'var(--primary)' : 'white', ...style }}
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
            <div
                className={styles.labelContainer}
                style={{
                    backgroundColor: isActive ? "var(--primary)" : "white",
                    ...labelStyle
                }}
            >
                {label}
            </div>
        </Container>
    );
};

export default MenuLink;
