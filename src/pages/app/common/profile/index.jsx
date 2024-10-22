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
import { validateEmail, validatePhone, validatePassword, validateUsername } from "../../../../utils/validators";
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
import { extractFileInfo, extractFileType, formatDateString } from "../../../../utils/helper.js";
import { fileTypes } from "../../../../constants/filetypes.js";
import InputDataContainer from "../../../../components/ui/inputdatacontainer/index.jsx";
import { getFileStream, resetFileStreamState } from "../../../../store/app/admin/fileStream/getFileStream.js";
import CustomInput from "../../../../components/common/customInput/index.jsx";
import Dropdown from "../../../../components/common/dropdown/index.jsx";

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
    status: {
      value: "",
      error: "",
    },
  });

  const [defaultUrl, setDefaultUrl] = useState(null);

  // const [imageURl, setImageURl] = useState(null);
  // const [imageInfo, setImageInfo] = useState({
  //   type: null,
  //   name: null,
  // });
  const [imageURl, setImageURl] = useState({
    url: null,
    type: null,
    name: null,
  });

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

  const { fileStream, fileStreamLoading } = useSelector(
    (state) => state.getFileStream
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const allowedFileTypesArray = [
    fileTypes.IMAGE_EXTENSION_1,
    fileTypes.IMAGE_EXTENSION_2,
    fileTypes.IMAGE_EXTENSION_3,
    fileTypes.MIME_IMAGE_1,
    fileTypes.MIME_IMAGE_2,
    fileTypes.MIME_IMAGE_3,
  ]

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
      status: {
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
        // setImageInfo({
        //   type: null,
        //   name: null,
        // });
        // setImageURl(null);
        setImageURl({
          url: null,
          type: null,
          name: null,
        });
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
      // setImageInfo({
      //   type: null,
      //   name: null,
      // });
      // setImageURl(null);
      setImageURl({
        url: null,
        type: null,
        name: null,
      });
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


  const setUserDetailState = useCallback(async () => {
    if (isJSONString(userByIdDetails.data)) {
      const data = JSON.parse(userByIdDetails.data);
      console.log("userByIdDetails : ", data)

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
        status: {
          value: data.Status,
          error: "",
        },
      };

      // setImageURl(data.ProfileImageDisplay);
      setDefaultUrl(data.ProfileImage);
      setUserData(newData);
      // call the stream api to get the tram for the default url
      if (data.ProfileImage && data.ProfileImage != "file") {
        try {

          // setImageInfo({
          //   type: extractFileType(data.ProfileImage),
          //   name: extractFileInfo(data.ProfileImage).name,
          // });

          // Define the body parameters
          const requestBody = {
            fileName: data.ProfileImage,
            module: "ProfileImage"
          };
          // console.log("requesst body :",requestBody)
          // dispatch(getFileStream(requestBody));
          //Make the API call
          const response = await axios.post(
            `${baseUrl}/api/Storage/GetFileStream`,
            requestBody,
            {
              responseType: 'blob', // Set response type to blob
              headers: {
                "Content-Type": "application/json", // Update content type to JSON
                Authorization: `Bearer ${credentials.data.token}`,
              },
              cancelToken: source.token,
            }
          );

          if (response.data) {
            // Assuming the response contains the file stream data
            // console.log("responce  :")
            const fileStream = response.data;

            // Generate URL for the file stream
            const fileUrl = URL.createObjectURL(new Blob([fileStream]));
            // console.log("fileUrl  :", fileUrl)
            // Set the intro file display URL
            // setImageURl(fileUrl);
            setImageURl({
              url: fileUrl,
              type: extractFileType(data.ProfileImage),
              name: extractFileInfo(data.ProfileImage).name,
            });
          } else {
            // Handle API response errors
            console.error("File upload failed:");
          }
        } catch (error) {
          // Handle API call errors
          // console.error("Error uploading file:", error);
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            console.error("Error:", error.message);
          }
        }
      }
    }
  }, [userByIdDetails]);

  useEffect(() => {
    if (userByIdDetails === null || userByIdDetails === undefined) return;

    if (!userID) return;

    setUserDetailState();

    return () => {
      // Cleanup function
      source.cancel("Request canceled by cleanup");
    };
  }, [userByIdDetails]);

  // useEffect(() => {
  //   if (fileStream === null || fileStream === undefined) return;

  //   if (!userID) return;

  //   setImageURl(fileStream); 

  // }, [fileStream]);

  const onChange = (value, event) => {
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

  const onSelectRole = (value) => {
    setUserData({
      ...userData,
      role: {
        value: value,
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

  const onSelectDesignation = (value) => {
    setUserData({
      ...userData,
      organizationName: {
        value: value,
        error: "",
      },
    });
  };

  const onSelectOrganisation = (value) => {
    setUserData({
      ...userData,
      organizationName: {
        value: value,
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

  const onResetFile = useCallback(
    (file) => {
      setUserData((prevUserData) => ({
        ...prevUserData,
        profileImage: {
          value: "",
          error: "",
        },
      }));
      setDefaultUrl(null);
    },
    [userData]
  );

  const onSubmit = async (event) => {
    event.preventDefault();

    let isEmpty = false;
    let valid = true;
    let data = userData;

    if (userData?.username?.value?.trim() === "") {
      data = {
        ...data,
        username: {
          ...data.username,
          error: "Please enter username",
        },
      };

      valid = false;
      isEmpty = true;
    } else if (!validateUsername(userData?.username?.value)) {
      console.log("!validateUsername :", userData?.username?.value);
      data = {
        ...data,
        username: {
          ...data.username,
          error: "Please enter a valid username",
        },
      };
      valid = false;
      // toast.error("Please enter a valid username ");
    } else if (!/[a-zA-Z][a-zA-Z0-9\s]*$/.test(userData?.username?.value)) {
      data = {
        ...data,
        username: {
          ...data.username,
          error: "Username should only contain alphanumeric and special characters",
        },
      };

      valid = false;

    }

    if (userData?.email?.value?.trim() === "") {
      data = {
        ...data,
        email: {
          ...data.email,
          error: "Please enter email",
        },
      };

      valid = false;
      isEmpty = true;

    } else if (!validateEmail(userData.email.value)) {
      console.log("!validateEmail :", userData?.email?.value);
      data = {
        ...data,
        email: {
          ...data.email,
          error: "Please enter a valid email with format abc@xyz.com, min 6 and max 320 characters",
        },
      };
      valid = false;
      // toast.error("Please enter a valid email with format abc@xyz.com, min 6 and max 254 characters without any spaces ");
    }


    // Validate mobile number
    if (userData?.mobile?.value?.trim() === "") {
      console.log("Please enter mobile number");

      // data = {
      //   ...data,
      //   mobile: {
      //     ...data.mobile,
      //     error: "Please enter mobile number",
      //   },
      // };
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
      // toast.error("Please enter valid mobile number");

    }

    if (userData?.role?.value?.trim() === "") {
      data = {
        ...data,
        role: {
          ...data.role,
          error: "Please select role",
        },
      };

      valid = false;
      isEmpty = true;

    }

    if (userData?.designation?.value?.trim() === "") {
      data = {
        ...data,
        designation: {
          ...data.designation,
          error: "Please select designation",
        },
      };

      valid = false;
      isEmpty = true;

    }

    if (userData?.organizationName?.value?.trim() === "") {
      data = {
        ...data,
        organizationName: {
          ...data.organizationName,
          error: "Please select organization name",
        },
      };

      valid = false;
      isEmpty = true;

    }

    // Validate password
    if (userData?.password?.value?.trim() === "") {
      console.log("Please enter password");

      // data = {
      //   ...data,
      //   password: {
      //     ...data.password,
      //     error: "Please enter password",
      //   },
      // };
      // valid = false; password here can be empty
    } else if (!validatePassword(userData?.password?.value?.trim())) {
      console.log("Invalid password");

      data = {
        ...data,
        password: {
          ...data.password,
          error: "Invalid password",
        },
      };
      // valid = false;
      // toast.error("Please enter a valid password  ");

    }

    // console.log(" password validation " + validatePassword(userData?.password?.value?.trim()) + " passwprd: " + userData.password.value)

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

    setUserData(data);

    try {
      if (!isEmpty) {
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
                  Authorization: `Bearer ${credentials.data.token}`,
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
                status: userData.status.value,
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
              status: userData.status.value,
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
      } else {
        // console.log("user empty data:", userData);
        // toast.error("Please fill all the mandatory details.");
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
      // setImageURl(null);
      // setImageInfo({
      //   type: null,
      //   name: null,
      // });
      setImageURl({
        url: null,
        type: null,
        name: null,
      });
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
          {/* <div className={styles.formContainer}>
            <div className={styles.formLeft}></div>
            <div
              className={styles.formRight}
              style={{ backgroundImage: 'url("./images/particles.png")' }}
            > */}
          <InputDataContainer
            customRightContainerStyles={{
              transform: "scaleY(-1)",
              backgroundPosition: "bottom right",
            }}
          >
            <div className={styles.leftInputs}>
              {/* <Input
                customStyle={{ margin: '0rem' }}
                customLabelStyle={{ display: 'none' }}
                type="text"
                value={userData.username.value}
                name={"username"}
                placeholder="Username &#128900;"
                onChange={onChange}
                disabled={credentials.data.role === "3"}
              /> */}

              <CustomInput
                type="text"
                value={userData.username.value}
                // customStyle={{ margin: '0' }}
                // customInputStyles={{ height: "auto" }}
                // inputStyleClass={styles.customInputStylesClass}
                customLabelStyle={{ display: "none" }}
                name={"username"}
                title="User Name"
                onChange={onChange}
                required
                readOnly={credentials.data.role === "3"}
                error={userData.username.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.username.error}
                  </div>
                )}
                maxLength={100}

              />

              {credentials?.data?.role === "1" ||
                credentials?.data?.role === "2" ? (
                // <div>
                //   <label htmlFor="dropdown_role" className="select_label">
                //       Role:
                //     </label>
                //   <select
                //     id="dropdown_role"
                //     value={userData.role.value}
                //     className="select_input"
                //     onChange={onRoleSelect}
                //   >
                //     <option value={""} hidden>Role &#128900;</option>

                //     {masters &&
                //       masters.data &&
                //       isJSONString(masters.data) &&
                //       Array.isArray(JSON.parse(masters.data)) &&
                //       JSON.parse(masters.data).map((item, index) => {
                //         if (item.MasterType !== "Role") return;
                //         return (
                //           <option value={item.MasterID} key={index}>
                //             {item.MasterDisplayName}
                //           </option>
                //         );
                //       })}
                //   </select>
                // </div>

                <Dropdown
                  data={
                    masters &&
                    masters.data &&
                    isJSONString(masters.data) &&
                    Array.isArray(JSON.parse(masters.data)) &&
                    JSON.parse(masters.data)
                      .filter(item => item.MasterType === "Role") ||
                    []
                  }
                  value={userData.role.value}
                  valueKey="MasterID"
                  labelKey="MasterDisplayName"
                  placeholder="Roles"
                  onSelect={(value) => { onSelectRole(value) }}
                  error={userData.role.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {userData.role.error}
                    </div>
                  )}
                  required
                />
              ) : null}

              {/* <Input
                customStyle={{ margin: '0rem' }}
                customLabelStyle={{ display: 'none' }}
                type="tel"
                value={userData.mobile.value}
                name="mobile"
                placeholder="Mobile No."
                onChange={onChange}
              /> */}

              <CustomInput
                type="text"
                value={userData.mobile.value}
                // customStyle={{ margin: '0' }}
                // customInputStyles={{ height: "auto" }}
                // inputStyleClass={styles.customInputStylesClass}
                customLabelStyle={{ display: "none" }}
                name={"mobile"}
                title="Mobile No."
                onChange={onChange}
                error={userData.mobile.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.mobile.error}
                  </div>
                )}
                maxLength={10}

              />

              {/* <div>
                <label htmlFor="dropdown_Organisation" className="select_label">
                    Organisation:
                  </label>
                <select
                  id="dropdown_Organisation"
                  value={userData.organizationName.value}
                  className="select_input"
                  onChange={onOrganisationSelect}
                >
                  <option value="" hidden>Organisation &#128900;</option>
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
              </div> */}
              <Dropdown
                data={
                  masters &&
                  masters.data &&
                  isJSONString(masters.data) &&
                  Array.isArray(JSON.parse(masters.data)) &&
                  JSON.parse(masters.data)
                    .filter(item => item.MasterType === "Organization") ||
                  []
                }
                value={userData.organizationName.value}
                valueKey="MasterID"
                labelKey="MasterDisplayName"
                placeholder="Organization"
                onSelect={(value) => { onSelectOrganisation(value) }}
                error={userData.organizationName.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.organizationName.error}
                  </div>
                )}
                required
                maxLength={250}
              />

              <div>
                <label
                  className={styles.inputLabel}
                >
                  Last edited on {formatDateString(userData?.updatedAt?.value)}
                </label>
              </div>
            </div>
            <div className={styles.rightInputs}>
              {/* <Input
                customStyle={{ margin: '0rem' }}
                customLabelStyle={{ display: 'none' }}
                type="text"
                value={userData.email.value}
                name={"email"}
                placeholder="Email &#128900;"
                disabled={true}
                onChange={onChange}
              /> */}
              <CustomInput
                type="text"
                value={userData.email.value}
                // customStyle={{ margin: '0' }}
                // customInputStyles={{ height: "auto" }}
                // inputStyleClass={styles.customInputStylesClass}
                customLabelStyle={{ display: "none" }}
                name={"email"}
                title="Email"
                onChange={onChange}
                required
                error={userData.email.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.email.error}
                  </div>
                )}
                readonly
                maxLength={320}

              />

              {/* <Input
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
              /> */}
              <CustomInput
                type="text"
                value={userData.password.value}
                customStyle={{
                  margin: '0',
                  marginTop: '-2.5rem'
                }}
                // customStyle={{ margin: '0' }}
                // customInputStyles={{ height: "auto" }}
                // inputStyleClass={styles.customInputStylesClass}
                name={"password"}
                title="Password"
                label="Password"
                labelStyle={styles.inputLabel}
                onChange={onChange}
                required
                error={userData.password.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.password.error}
                  </div>
                )}
              />

              {/* <div>
                <label htmlFor="dropdown_designation" className="select_label">
                    Designation:
                  </label>
                <select
                  disabled={credentials.data.role === "3"}
                  id="dropdown_designation"
                  value={userData.designation.value}
                  className="select_input"
                  onChange={onDesignationSelect}
                >
                  <option value="" hidden>Designation &#128900;</option>
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
              </div> */}
              <Dropdown
                data={
                  masters &&
                  masters.data &&
                  isJSONString(masters.data) &&
                  Array.isArray(JSON.parse(masters.data)) &&
                  JSON.parse(masters.data)
                    .filter(item => item.MasterType === "Designation") ||
                  []
                }
                customContainerClass={styles.customContainerClass}
                value={userData.designation.value}
                valueKey="MasterID"
                labelKey="MasterDisplayName"
                placeholder="Designation"
                label={"Designation"}
                labelStyle={styles.inputLabel}
                onSelect={(value) => { onSelectDesignation(value) }}
                error={userData.designation.error}
                errorNode={(
                  <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                    {userData.designation.error}
                  </div>
                )}
                required
                maxLength={250}

              />

              <div>
                <ImageDropZone
                  customstyle={{ marginTop: "0rem" }}
                  label="Upload Profile Pic"
                  onUpload={onUpload}
                  imageSrc={imageURl.url}
                  allowedFileTypes={allowedFileTypesArray}
                  onResetFile={onResetFile}
                  setUrl={(file) => {
                    // setImageURl(file);
                    setImageURl((previousState) => ({
                      ...previousState,
                      url: file,
                      type: file && extractFileType(file),
                      name: file && extractFileInfo(file).name,
                    }));
                  }}
                  // fileSrcType={
                  //   imageURl && extractFileType(imageURl)
                  // }
                  // fileName={imageURl && extractFileInfo(imageURl).name}
                  // fileSrcType={
                  //   (imageInfo) ?
                  //     imageInfo.type : ""
                  // }
                  // fileName={
                  //   (imageInfo) ?
                  //     imageInfo.name : ""
                  // }
                  fileSrcType={
                    (imageURl) ?
                      imageURl.type : ""
                  }
                  fileName={
                    (imageURl) ?
                      imageURl.name : ""
                  }
                />
              </div>
            </div>

          </InputDataContainer>
          {/* </div>
          </div> */}
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
