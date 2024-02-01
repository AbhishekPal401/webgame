import React, { useCallback, useEffect, useState } from "react";
import styles from "./profile.module.css";
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
import { validateEmail, validatePhone, validatePassword } from "../../../../utils/validators";
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
import { useNavigate } from "react-router-dom";
import { formatDateString } from "../../../../utils/helper.js";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    username: {
      value: "",
      error: "",
    },
    email: {
      value: "",
      error: "",
    },
    mobile: {
      value: "",
      error: "",
    },
    password: {
      value: "",
      error: "",
    },
    updatedAt: {
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

  const [defaultUrl, setDefaultUrl] = useState(null);

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
  const navigateTo = useNavigate();

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
      mobile: {
        value: "",
        error: "",
      },
      password: {
        value: "",
        error: "",
      },
      updatedAt: {
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
    if (createUserResponse === null || createUserResponse === undefined) return;

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

      navigateTo("/users");

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

  //DEBUG:: start
  useEffect(() => {
    if (userID === null ||
      userID === undefined ||
      userByIdDetails === null ||
      userByIdDetails === undefined) {
      return
    } else {
      console.log("userByIdDetails :", JSON.parse(userByIdDetails.data));
    }
  }, [userID]);

  //DEBUG:: end


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
        mobile: {
          value: data.Mobile,
          error: "",
        },
        password: {
          value: "", // TODO:: password to be set
          error: "",
        },
        updatedAt: {
          value: (data.UpdatedAt != null && data.UpdatedAt != undefined) ? data.UpdatedAt : "",
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
      setDefaultUrl(data.ProfileImage);

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
    } else if (!validateEmail(userData.email.value)) {
      data = {
        ...data,
        email: {
          ...data.email,
          error: "Please enter a valid email",
        },
      };
      valid = false;
    }

    // Validate mobile number
    if (userData?.mobile?.value?.trim() === "") {
      console.log("Please enter mobile number");

      data = {
        ...data,
        mobile: {
          ...data.mobile,
          error: "Please enter mobile number",
        },
      };
      // valid = false;
    } else if (!validatePhone(userData.mobile.value)) {
      console.log("Invalid mobile number");

      data = {
        ...data,
        mobile: {
          ...data.mobile,
          error: "Invalid mobile number",
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

    // Validate password
    if (userData?.password?.value?.trim() === "") {
      console.log("Please enter password");

      data = {
        ...data,
        mobile: {
          ...data.mobile,
          error: "Please enter password",
        },
      };
      // valid = false; password here can be empty
    } else if (!validatePassword(userData?.password?.value?.trim())) {
      console.log("Invalid password");

      data = {
        ...data,
        mobile: {
          ...data.mobile,
          error: "Invalid password",
        },
      };
      // valid = false;
    }

    console.log(" password validation " + validatePassword(userData?.password?.value?.trim()) + " passwprd: " + userData.password.value)

    if (!userID && userData.profileImage.value === "") {
      data = {
        ...data,
        profileImage: {
          ...data.profileImage,
          error: "Please select profile image",
        },
      };
      console.log("profile image is not uploaded")
      // valid = false;
    }

    try {
      if (valid) {
        let url = defaultUrl;

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

            const data = {
              userID: userID ? userID : "",
              userName: userData.username.value,
              password: userData.password.value ? userData.password.value : "",
              role: userData.role.value,
              email: userData.email.value,
              mobile: userData.mobile.value,
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
            console.log("data to be created :", data)
            dispatch(createUser(data));

          } else if (response.data && !response.data.success) {
            toast.error(response.data.message);
            console.log("error message :", response.data.message);
          } else {
            console.log("error message :", response.data.message);
            toast.error("File upload failed.");
          }
        } else {
          const data = {
            userID: userID ? userID : "",
            userName: userData.username.value,
            password: userData.password.value ? userData.password.value : "",
            role: userData.role.value,
            email: userData.email.value,
            mobile: userData.mobile.value,
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
          console.log("data to be created :", data)
          dispatch(createUser(data));
        }

      }
    } catch (error) {
      toast.error("An error ocurred while saving the user.")
      console.log("error :", error);
    }

  };

  const onCancel = () => {
    if (userID) {
      setUserDetailState();
      navigateTo(credentials.data.role === "1" ? "/users" : -1);
      return;
    } else {
      resetUserData();
      setImageURl(null);
    }
    navigateTo(credentials.data.role === "1" ? "/users" : -1);


  };

  return (
    <PageContainer>
      <div
        style={{
          background: 'url("./images/particles-yellow.png") top right no-repeat',
          backgroundSize: '80%',
        }}>

        <div className={styles.topContainer}>
          <div className={styles.left}>
            <label>User Profile</label>
          </div>
          <div
            className={styles.right}
          >
            <img
              src={"/images/createscenario2.png"}
              alt="Update user profile background"
            />
          </div>
        </div>
        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            <div className={styles.formLeft}></div>
            <div
              className={styles.formRight}
              style={{ backgroundImage: 'url("./images/particles.png")' }}
            >
              <div className={styles.leftInputs}>
                <Input
                  customStyle={{ margin: '0rem' }}
                  customLabelStyle={{ display: 'none' }}
                  type="text"
                  value={userData.username.value}
                  name={"username"}
                  placeholder="Username"
                  onChange={onChange}
                  disabled={credentials.data.role === "3"}
                />
                {credentials?.data?.role === "1" ||
                  credentials?.data?.role === "2" ? (
                  <div>
                    {/* <label htmlFor="dropdown_role" className="select_label">
                      Role:
                    </label> */}
                    <select
                      id="dropdown_role"
                      value={userData.role.value}
                      className="select_input"
                      onChange={onRoleSelect}
                    >
                      <option value={""} hidden>Role</option>

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
                ) : null}

                <Input
                  customStyle={{ margin: '0rem' }}
                  customLabelStyle={{ display: 'none' }}
                  type="tel"
                  value={userData.mobile.value}
                  name="mobile"
                  placeholder="Mobile No."
                  onChange={onChange}
                />
                <div>
                  {/* <label htmlFor="dropdown_Organisation" className="select_label">
                    Organisation:
                  </label> */}
                  <select
                    id="dropdown_Organisation"
                    value={userData.organizationName.value}
                    className="select_input"
                    onChange={onOrganisationSelect}
                  >
                    <option value="" hidden>Organisation</option>
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
                <div>
                  <label 
                    className={styles.inputLabel}
                  >
                    Last edited on {formatDateString(userData?.updatedAt?.value)}
                  </label>
                </div>
              </div>
              <div className={styles.rightInputs}>
                <Input
                  customStyle={{ margin: '0rem' }}
                  customLabelStyle={{ display: 'none' }}
                  type="text"
                  value={userData.email.value}
                  name={"email"}
                  placeholder="Email"
                  disabled={true}
                  onChange={onChange}
                />
                <Input
                  type="password"
                  value={userData.password.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{
                    margin: '0',
                    marginTop: '-2.5rem'
                  }}
                  name={"password"}
                  label="Password"
                  placeholder="Password"
                  onChange={onChange}
                />
                <div>
                  {/* <label htmlFor="dropdown_designation" className="select_label">
                    Designation:
                  </label> */}
                  <select
                    disabled={credentials.data.role === "3"}
                    id="dropdown_designation"
                    value={userData.designation.value}
                    className="select_input"
                    onChange={onDesignationSelect}
                  >
                    <option value="" hidden>Designation</option>
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

                <div>
                  <ImageDropZone
                    customstyle={{ marginTop: "0rem" }}
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
        </div>
        <div className={styles.buttonContainer}>
          <Button buttonType="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Update</Button>
        </div>

      </div>
    </PageContainer>
  );
};

export default UserProfile;
