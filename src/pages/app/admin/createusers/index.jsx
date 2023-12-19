import React from "react";
import styles from "./createusers.module.css";
import PageContainer from "../../../../components/ui/pagecontainer";

const CreateUser = () => {
  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Create User</label>
        </div>
        <div className={styles.right}>
          <img src="./images/scenario.png" />
        </div>
      </div>
      <div className={styles.mainContainer}></div>
    </PageContainer>
  );
};

export default CreateUser;
