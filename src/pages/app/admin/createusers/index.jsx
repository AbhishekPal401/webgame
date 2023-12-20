import React, { useCallback, useEffect, useState } from "react";
import styles from "./createusers.module.css";
import PageContainer from "../../../../components/ui/pagecontainer";
import Input from "../../../../components/common/input";
import ImageDropZone from "../../../../components/common/upload/ImageDropzone";
import Button from "../../../../components/common/button";
import { getAllMasters } from "../../../../store/app/admin/users/masters";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../../../utils/validators";
import { baseUrl } from "../../../../middleware/url";
import { toast } from "react-toastify";
import {
  createUser,
  resetCreateUserState,
} from "../../../../store/app/admin/users/createUser.js";
import { getUsersbyPage } from "../../../../store/app/admin/users/users.js";
import { generateGUID } from "../../../../utils/common.js";
import axios from "axios";

const CreateUser = () => {
  const [userData, setUserData] = useState({
    username: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    role: {
      value: "",
      error: "",
    },
    designation: {
      value: "",
      error: "",
    },
    organizationName: {
      value: "",
      error: "",
    },
    profileImage: {
      value: "",
      error: "",
    },
  });

  const [resetImage, setResetImage] = useState(false);

  const { masters, loading: masterLoading } = useSelector(
    (state) => state.masters
  );

  const { credentials } = useSelector((state) => state.login);

  const { createUserResponse, loading: createUserResponseLoading } =
    useSelector((state) => state.createUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllMasters());
  }, []);

  useEffect(() => {
    if (createUserResponse === null) return;

    if (createUserResponse?.success) {
      toast.success(createUserResponse.message);
      setUserData({
        username: {
          value: "",
          error: "",
        },
        email: {
          value: "",
          error: "",
        },
        role: {
          value: "",
          error: "",
        },
        designation: {
          value: "",
          error: "",
        },
        organizationName: {
          value: "",
          error: "",
        },
        profileImage: {
          value: "",
          error: "",
        },
      });
      setResetImage(!resetImage);
      dispatch(resetCreateUserState());
    } else if (!createUserResponse.success) {
      toast.error(createUserResponse.message);
      dispatch(resetCreateUserState());
    } else {
      dispatch(resetCreateUserState());
    }
  }, [createUserResponse, resetImage]);

  const onChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onRoleSelect = (event) => {
    setUserData({
      ...userData,
      role: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onDesignationSelect = (event) => {
    setUserData({
      ...userData,
      designation: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onOrganisationSelect = (event) => {
    setUserData({
      ...userData,
      organizationName: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onUpload = useCallback(
    (file) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        profileImage: {
          value: file,
          error: "",
        },
      }));
    },
    [userData]
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    let valid = true;
    let data = userData;

    if (userData.username.value === "") {
      data = {
        ...data,
        username: {
          ...data.username,
          error: "Please enter username",
        },
      };

      valid = false;
    }

    if (userData.email.value === "") {
      data = {
        ...data,
        email: {
          ...data.email,
          error: "Please enter email",
        },
      };

      valid = false;
    } else if (
      userData.email.value.includes("@") &&
      !validateEmail(userData.email.value)
    ) {
      data = {
        ...data,
        email: {
          ...data.email,
          error: "Please enter a valid email",
        },
      };
      valid = false;
    }

    if (userData.role.value === "") {
      data = {
        ...data,
        role: {
          ...data.role,
          error: "Please select role",
        },
      };

      valid = false;
    }

    if (userData.designation.value === "") {
      data = {
        ...data,
        designation: {
          ...data.designation,
          error: "Please select designation",
        },
      };

      valid = false;
    }

    if (userData.organizationName.value === "") {
      data = {
        ...data,
        organizationName: {
          ...data.organizationName,
          error: "Please select organization name",
        },
      };

      valid = false;
    }

    if (userData.profileImage.value === "") {
      data = {
        ...data,
        profileImage: {
          ...data.profileImage,
          error: "Please select profile image",
        },
      };

      valid = false;
    }

    if (valid) {
      const formData = new FormData();

      formData.append("Module", "ProfileImage");
      formData.append("contentType", userData.profileImage.value.type);
      formData.append("FormFile", userData.profileImage.value);

      const response = await axios.post(
        `${baseUrl}/api/Storage/FileUpload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        console.log(JSON.parse(response.data.data));

        const serializedData = JSON.parse(response.data.data);

        const url = JSON.parse(serializedData.Data).URL;

        const data = {
          userID: "",
          userName: userData.username.value,
          password: "pwc@123456",
          role: userData.role.value,
          email: userData.email.value,
          mobile: "",
          designation: userData.designation.value,
          organizationName: userData.organizationName.value,
          profileImage: url,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };

        // console.log(data);

        dispatch(createUser(data));
      }
    }
  };

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
                value={userData.username.value}
                name={"username"}
                label="Username"
                onChange={onChange}
              />
              <Input
                labelStyle={styles.inputLabel}
                type="text"
                value={userData.email.value}
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
                  value={userData.role.value}
                  className="select_input"
                  onChange={onRoleSelect}
                >
                  <option value={""}>Select Roles</option>

                  {masters &&
                    masters.data &&
                    Array.isArray(JSON.parse(masters.data)) &&
                    JSON.parse(masters.data).map((item, index) => {
                      if (item.MasterType !== "Role") return;
                      return (
                        <option value={item.MasterID} key={index}>
                          {item.MasterDisplayName}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <label htmlFor="dropdown_designation" className="select_label">
                  Designation:
                </label>
                <select
                  id="dropdown_designation"
                  value={userData.designation.value}
                  className="select_input"
                  onChange={onDesignationSelect}
                >
                  <option value="">Select Designation</option>
                  {masters &&
                    masters.data &&
                    Array.isArray(JSON.parse(masters.data)) &&
                    JSON.parse(masters.data).map((item, index) => {
                      if (item.MasterType !== "Designation") return;
                      return (
                        <option value={item.MasterID} key={index}>
                          {item.MasterDisplayName}
                        </option>
                      );
                    })}
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
                  value={userData.organizationName.value}
                  className="select_input"
                  onChange={onOrganisationSelect}
                >
                  <option value="">Select Organisation</option>
                  {masters &&
                    masters.data &&
                    Array.isArray(JSON.parse(masters.data)) &&
                    JSON.parse(masters.data).map((item, index) => {
                      if (item.MasterType !== "Organization") return;
                      return (
                        <option value={item.MasterID} key={index}>
                          {item.MasterDisplayName}
                        </option>
                      );
                    })}
                </select>
              </div>
              <ImageDropZone
                customstyle={{ marginTop: "1rem" }}
                label="Upload Profile Pic"
                onUpload={onUpload}
                resetImage={resetImage}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button buttonType="cancel">Cancel</Button>
        <Button onClick={onSubmit}>Create</Button>
      </div>
    </PageContainer>
  );
};

export default CreateUser;
