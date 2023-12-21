import React, { useCallback, useEffect, useState } from "react";
import styles from "./createusers.module.css";
import PageContainer from "../../../../components/ui/pagecontainer";
import Input from "../../../../components/common/input";
import ImageDropZone from "../../../../components/common/upload/ImageDropzone";
import Button from "../../../../components/common/button";
import { getAllMasters } from "../../../../store/app/admin/users/masters";
import {
  getUserDetailsByID,
  resetUserDetailState,
} from "../../../../store/app/admin/users/getUserbyId.js";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../../../utils/validators";
import { baseUrl } from "../../../../middleware/url";
import { toast } from "react-toastify";
import {
  createUser,
  resetCreateUserState,
} from "../../../../store/app/admin/users/createUser.js";
import { generateGUID } from "../../../../utils/common.js";
import { useParams } from "react-router-dom";
import axios from "axios";
import { isJSONString } from "../../../../utils/common.js";

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

  const [imageURl, setImageURl] = useState(null);

  const { userID } = useParams();

  const { masters, loading: masterLoading } = useSelector(
    (state) => state.masters
  );

  const { credentials } = useSelector((state) => state.login);

  const { userByIdDetails, loading: getUserDetailsLoading } = useSelector(
    (state) => state.getUserbyId
  );

  const { createUserResponse, loading: createUserResponseLoading } =
    useSelector((state) => state.createUser);

  const dispatch = useDispatch();

  const resetUserData = () => {
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
  };

  useEffect(() => {
    dispatch(getAllMasters());
    dispatch(resetUserDetailState());
  }, []);

  useEffect(() => {
    if (createUserResponse === null) return;

    if (createUserResponse?.success) {
      toast.success(createUserResponse.message);
      if (userID) {
        dispatch(
          getUserDetailsByID({
            userID: userID,
          })
        );
      } else {
        setImageURl(null);
        resetUserData();
      }

      dispatch(resetCreateUserState());
      dispatch(resetUserDetailState());
    } else if (!createUserResponse.success) {
      if (userID) {
        dispatch(
          getUserDetailsByID({
            userID: userID,
          })
        );
      }
      toast.error(createUserResponse.message);
      dispatch(resetCreateUserState());
    } else {
      dispatch(resetCreateUserState());
    }
  }, [createUserResponse]);

  useEffect(() => {
    if (userID === null || userID === undefined) {
      resetUserData();
      setImageURl(null);
    } else {
      dispatch(
        getUserDetailsByID({
          userID: userID,
        })
      );
    }
  }, [userID]);

  const setUserDetailState = useCallback(() => {
    if (isJSONString(userByIdDetails.data)) {
      const data = JSON.parse(userByIdDetails.data);

      const newData = {
        username: {
          value: data.UserName,
          error: "",
        },
        email: {
          value: data.Email,
          error: "",
        },
        role: {
          value: data.Role,
          error: "",
        },
        designation: {
          value: data.Designation,
          error: "",
        },
        organizationName: {
          value: data.OrganizationName,
          error: "",
        },
        profileImage: {
          value: "",
          error: "",
        },
      };

      setImageURl(data.ProfileImageDisplay);

      setUserData(newData);
    }
  }, [userByIdDetails]);

  useEffect(() => {
    if (userByIdDetails === null || userByIdDetails === undefined) return;

    if (!userID) return;

    setUserDetailState();
  }, [userByIdDetails]);

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

    if (!userID && userData.profileImage.value === "") {
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
      let url = "";

      if (userData.profileImage.value) {
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
          const serializedData = JSON.parse(response.data.data);

          url = JSON.parse(serializedData.Data).URL;
        }
      }

      const data = {
        userID: userID ? userID : "",
        userName: userData.username.value,
        password: "",
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

      dispatch(createUser(data));
    }
  };

  const onCancel = () => {
    if (userID) {
      setUserDetailState();
      return;
    } else {
      resetUserData();
      setImageURl(null);
    }
  };

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label> {userID ? "Update User" : "Create User"}</label>
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
                    isJSONString(masters.data) &&
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
                    isJSONString(masters.data) &&
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
                    isJSONString(masters.data) &&
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
                imageSrc={imageURl}
                setUrl={(file) => {
                  setImageURl(file);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <Button buttonType="cancel" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}> {userID ? "Update" : "Create"}</Button>
      </div>
    </PageContainer>
  );
};

export default CreateUser;
