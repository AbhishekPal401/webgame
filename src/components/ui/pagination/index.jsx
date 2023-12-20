import React from "react";
import styles from "./pagination.module.css";

const Pagination = ({
  totalCount = 100,
  pageNumber = 1,
  countPerPage = 10,
  onPageChange = () => {},
}) => {
  const totalPages = Math.ceil(totalCount / countPerPage);

  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.previous} ${
          pageNumber === 1 ? styles.disabled : ""
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        disabled={pageNumber === 1}
        onClick={() => {
          if (pageNumber === 1) return;
          handlePageChange(pageNumber - 1);
        }}
      >
        Previous
      </div>
      <div className={styles.pages_status}>
        <input
          disabled
          type="number"
          value={pageNumber}
          min="1"
          max={totalPages}
          onChange={(e) => {
            if (e.target.value <= totalPages) {
              handlePageChange(e.target.value);
            }
          }}
        />
        <div>
          of <label>{totalPages}</label>
        </div>
      </div>
      <div
        className={`${styles.next} ${
          pageNumber === totalPages ? styles.disabled : ""
        }`}
        onClick={() => {
          if (pageNumber === totalPages) return;
          handlePageChange(pageNumber + 1);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={() => {}}
        disabled={pageNumber === totalPages}
      >
        Next{" "}
      </div>
    </div>
  );
};

export default Pagination;
