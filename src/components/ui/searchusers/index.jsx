import React, { useState } from 'react';
import styles from "./searchusers.module.css";
import Input from '../../common/input';

const SearchUsers = ({
    value,
    onChange,
    clearSearch,
    searchValue,
}) => (

    <div className={styles.searchInputContainer}>
        <Input
            type="text"
            customStyle={{ marginTop: '0rem' }}
            name="instanceName"
            placeholder="Search Users"
            value={value}
            onChange={onChange}
            // autoFocus={searchValue}
        />
        <div className={styles.iconsContainer}>
            {value && (

                <svg
                    className="modal_crossIcon"
                    onClick={clearSearch}
                >
                    <use xlinkHref={"sprite.svg#x_mark_icon"} />
                </svg>
            )}
            {!value && (
                <img
                    src="/images/icon-search.png"
                    alt="search icon"
                />
            )}
        </div>
    </div>
);

export default SearchUsers;