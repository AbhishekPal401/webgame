import React from "react";
import styles from "./searchbar.module.css";

const Search = ({ ...props }) => {
    return (
        <div className="ui search">
            <div className="ui icon input">
                {/* <input
                    disabled={disabled}
                    type={type}
                    name={name}
                    value={value}
                    className={style.formControl}
                    placeholder={label}
                    {...props}
                    onChange={onChange}
                /> */}
                <i className="search icon" />
            </div>
            <div className="results" />
        </div>
    );
};

export default Search;
