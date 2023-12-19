import React from "react";
import styles from "./createusers.module.css";
import PageContainer from "../../../../components/ui/pagecontainer";
import Input from "../../../../components/common/input";
import ImageDropZone from "../../../../components/common/upload/ImageDropzone";
import Button from "../../../../components/common/button";

const CreateUser = () => {
  const onChange = () => {};
  const onRoleSelect = () => {};
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
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <div className={styles.formLeft}></div>
          <div className={styles.formRight}>
            <div className={styles.leftInputs}>
              <Input
                labelStyle={styles.inputLabel}
                type="text"
                name={"username"}
                label="Username"
                onChange={onChange}
              />
              <Input
                labelStyle={styles.inputLabel}
                type="text"
                name={"email"}
                label="Email"
                onChange={onChange}
              />
              <div>
                <label htmlFor="dropdown_role" className="select_label">
                  Role:
                </label>
                <select
                  id="dropdown_role"
                  value={""}
                  className="select_input"
                  onChange={onRoleSelect}
                >
                  <option value="">Select Roles</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>

              <div>
                <label htmlFor="dropdown_designation" className="select_label">
                  Designation:
                </label>
                <select
                  id="dropdown_designation"
                  value={""}
                  className="select_input"
                  onChange={onRoleSelect}
                >
                  <option value="">Select Designation</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
            </div>
            <div className={styles.rightInputs}>
              <div>
                <label htmlFor="dropdown_Organisation" className="select_label">
                  Organisation:
                </label>
                <select
                  id="dropdown_Organisation"
                  value={""}
                  className="select_input"
                  onChange={onRoleSelect}
                >
                  <option value="">Select Organisation</option>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </select>
              </div>
              <ImageDropZone
                customstyle={{ marginTop: "1rem" }}
                label="Upload Profile Pic"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button buttonType="cancel">Cancel</Button>
        <Button>Create</Button>
      </div>
    </PageContainer>
  );
};

export default CreateUser;
