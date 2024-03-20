import React, { useCallback, useEffect, useState } from "react";
import styles from "./updatescenarios.module.css";
import bg_2 from "/images/createscenario2.png";
import PageContainer from "../../../../components/ui/pagecontainer";
// import Input from "../../../../components/common/input";
import FileDropZone from "../../../../components/common/upload/FileDropzone";
import Button from "../../../../components/common/button";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../middleware/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  updateScenario,
  resetUpdateScenarioState,
} from "../../../../store/app/admin/scenario/updateScenario.js";
import { generateGUID } from "../../../../utils/common.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  getScenarioDetailsByID,
  resetScenarioDetailState,
} from "../../../../store/app/admin/scenario/getScenarioById.js";
import { isJSONString } from "../../../../utils/common.js";
import { checkHtmlContentLength, extractFileInfo, formatDateString } from "../../../../utils/helper.js";
import { dateFormats } from "../../../../constants/date.js";
import { fileTypes } from "../../../../constants/filetypes.js";
import { extractFileType } from "../../../../utils/helper.js";
import CustomInput from "../../../../components/common/customInput/index.jsx";
import RichTextEditor from "../../../../components/common/textEditor/index.jsx";


const UpdateScenarios = () => {
  const [scenarioData, setScenarioData] = useState({
    scenarioName: {
      value: "",
      error: "",
    },
    scenarioDescription: {
      value: "",
      error: "",
    },
    gameIntroText: {
      value: "",
      error: "",
    },
    gameIntroFile: {
      value: "",
      error: "",
    },
    updateAt: {
      value: "",
      error: "",
    },
  });

  // const [resetFile, setResetFile] = useState(false);
  const [defaultIntroFileUrl, setDefaultIntroFileUrl] = useState({
    url: null,
    type: null,
  });
  // const [introFileDisplay, setIntroFileDisplay] = useState(null);
  const [introFileDisplay, setIntroFileDisplay] = useState({
    url: null,
    type: null,
    name: null,
  });

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const allowedFileTypesArray = [
    fileTypes.AUDIO_EXTENSION,
    fileTypes.MIME_AUDIO_1,
    fileTypes.MIME_AUDIO_2,
    fileTypes.VIDEO_EXTENSION,
    fileTypes.MIME_VIDEO,
    fileTypes.IMAGE_EXTENSION_1,
    fileTypes.IMAGE_EXTENSION_2,
    fileTypes.IMAGE_EXTENSION_3,
    fileTypes.MIME_IMAGE_1,
    fileTypes.MIME_IMAGE_2,
    fileTypes.MIME_IMAGE_3,
    fileTypes.MIME_PDF_1,
    fileTypes.PDF_EXTENSION,
    fileTypes.MIME_POWERPOINT_1,
    fileTypes.MIME_POWERPOINT_2,
    fileTypes.MIME_POWERPOINT_3,
    fileTypes.POWERPOINT_EXTENSION,
  ]

  const sampleConfig = {
    toolbar:
      ["fontFamily",
        "fontSize",
        "bold",
        "italic",
        "strikethrough",
        "underline",
        "bulletedList",
        "numberedList",
        "indent",
        "outdent",
        "alignment:left",
        "alignment:center",
        "alignment:right",
        "alignment:justify",
      ]
  };


  console.log(" scenario data :", scenarioData)

  const { credentials } = useSelector((state) => state.login);

  const { scenarioByIdDetails, loading: scenarioByIdDetailsLoading } =
    useSelector((state) => state.getScenarioById);

  const { updateScenarioResponse } = useSelector(
    (state) => state.updateScenario
  );

  const { scenarioID } = useParams();

  const dispatch = useDispatch();

  const navigateTo = useNavigate();

  const resetScenarioData = () => {
    setScenarioData({
      scenarioName: {
        value: "",
        error: "",
      },
      scenarioDescription: {
        value: "",
        error: "",
      },
      gameIntroText: {
        value: "",
        error: "",
      },
      gameIntroFile: {
        value: "",
        error: "",
      },
      updateAt: {
        value: "",
        error: "",
      },
    });
  };

  useEffect(() => {
    if (updateScenarioResponse === null || updateScenarioResponse === undefined)
      return;

    if (updateScenarioResponse?.success) {
      toast.success(updateScenarioResponse.message);
      if (scenarioID) {
        const data = {
          scenarioID: scenarioID,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };
        dispatch(getScenarioDetailsByID(data));
        navigateTo(`/scenario`);
      } else {
        // introFileDisplay(null);
        setIntroFileDisplay({
          url: null,
          type: null,
          name: null,
        });
        resetScenarioData();
      }

      dispatch(resetUpdateScenarioState());
      dispatch(resetScenarioDetailState());
    } else if (!updateScenarioResponse?.success) {
      if (scenarioID) {
        const data = {
          scenarioID: scenarioID,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };
        dispatch(getScenarioDetailsByID(data));
      }
      toast.error(updateScenarioResponse?.message);
      dispatch(resetUpdateScenarioState());
    } else {
      dispatch(resetUpdateScenarioState());
    }
  }, [updateScenarioResponse]);

  // check if we have scenarioID
  useEffect(() => {
    if (scenarioID === null || scenarioID === undefined) {
      resetScenarioData();
      // setIntroFileDisplay(null);
      setIntroFileDisplay({
        url: null,
        type: null,
        name: null,
      });
    } else {
      const data = {
        scenarioID: scenarioID,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };
      dispatch(getScenarioDetailsByID(data));
    }
    return () => {
      console.log("Clean up sceario function");
      dispatch(resetScenarioDetailState());
    }
  }, [scenarioID]);

  const setScenarioDetailState = useCallback(async () => {
    if (isJSONString(scenarioByIdDetails.data)) {
      const data = JSON.parse(scenarioByIdDetails.data);
      console.log("data:", data);
      console.log(
        "formatDateString data.UpdatedAt :",
        formatDateString(data.UpdatedAt)
      );

      const newData = {
        scenarioName: {
          value: data.ScenarioName,
          error: "",
        },
        scenarioDescription: {
          value: data.Description,
          error: "",
        },
        gameIntroText: {
          value: data.GameIntro,
          error: "",
        },
        gameIntroFile: {
          value: "",
          error: "",
        },
        updateAt: {
          value: data.UpdatedAt,
          error: "",
        },
      };

      // setIntroFileDisplay(data.IntroFileDisplay);
      setDefaultIntroFileUrl((previous) => ({
        ...previous,
        url: data.IntroFile,
        type: data.IntroFileType,
      }));

      setScenarioData(newData);

      // call the stream api to get the tram for the default url
      if (data.IntroFile) {
        try {
          // Define the body parameters
          const requestBody = {
            fileName: data.IntroFile,
            module: "Scenario"
          };

          // Make the API call
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
            console.log("responce  :", response.data)
            const fileStream = response.data;

            // Generate URL for the file stream
            const fileUrl = URL.createObjectURL(new Blob([fileStream]));
            console.log("fileUrl  :", fileUrl)
            // Set the intro file display URL
            // setIntroFileDisplay(fileUrl);
            setIntroFileDisplay({
              url: fileUrl,
              type: extractFileType(data.IntroFile),
              name: extractFileInfo(data.IntroFile).name,
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
  }, [scenarioByIdDetails]);

  // update the Scenario Data state with new data and render it
  useEffect(() => {
    if (scenarioByIdDetails === null || scenarioByIdDetails === undefined)
      return;

    if (!scenarioID) return;
    setScenarioDetailState();

    return () => {
      // Cleanup function
      source.cancel("Request canceled by cleanup");
    };
  }, [scenarioByIdDetails]);

  // const onChange = (event) => {
  //   setScenarioData({
  //     ...scenarioData,
  //     [event.target.name]: {
  //       value: event.target.value,
  //       error: "",
  //     },
  //   });
  // };

  const onChange = (value, event) => {
    console.log("name:" + event.target.name + " value: " + value);
    setScenarioData({
      ...scenarioData,
      [event.target.name]: {
        value: value,
        error: "",
      },
    });
  };


  const onGameIntroTextChange = (htmlContent) => {
    console.log("Game Intro text ", htmlContent)
    setScenarioData((prevScenarioData) => ({
      ...prevScenarioData,
      gameIntroText: {
        value: htmlContent,
        error: "",
      },
    }));
  };

  const onUpload = useCallback(
    (file) => {
      setScenarioData((prevScenarioData) => ({
        ...prevScenarioData,
        gameIntroFile: {
          value: file,
          error: "",
        },
      }));
    },
    [scenarioData]
  );

  const onResetFile = useCallback(
    (file) => {
      setScenarioData((prevScenarioData) => ({
        ...prevScenarioData,
        gameIntroFile: {
          value: "",
          error: "",
        },
      }));
      setDefaultIntroFileUrl({
        url: "",
        type: "",
      })
    },
    [scenarioData]
  );

  // Update scenario on submit
  const onSubmit = async (event) => {
    event.preventDefault();

    let isEmpty = false;
    let valid = true;
    let data = scenarioData;
    console.log("scenarioData data:", data);

    if (scenarioData?.scenarioName?.value?.trim() === "") {
      console.log("scenarioName:", data.scenarioName);
      data = {
        ...data,
        scenarioName: {
          ...data.scenarioName,
          error: "Please enter scenario name",
        },
      };

      valid = false;
      isEmpty = true;

    } else if (scenarioData?.scenarioName?.value !== scenarioData?.scenarioName?.value?.trim()) {
      console.log("scenarioName :", scenarioData?.scenarioName?.value);
      data = {
        ...data,
        scenarioName: {
          ...data.scenarioName,
          error: "Please enter a valid scenario name",
        },
      };

      valid = false;
      toast.error("Please enter a valid scenario name")
    }

    if (scenarioData?.scenarioDescription?.value?.trim() === "") {
      console.log("scenarioDescription:", data.scenarioDescription);
      data = {
        ...data,
        scenarioDescription: {
          ...data.scenarioDescription,
          error: "Please enter scenario description",
        },
      };

      valid = false;
      isEmpty = true;

    } else if (scenarioData?.scenarioDescription?.value !== scenarioData?.scenarioDescription?.value?.trim()) {
      console.log("scenarioDescription :", scenarioData?.scenarioDescription?.value);
      data = {
        ...data,
        scenarioDescription: {
          ...data.scenarioDescription,
          error: "Please enter a valid scenario description",
        },
      };

      valid = false;
      toast.error("Please enter a valid scenario description")
    }

    if (
      scenarioData?.gameIntroText?.value?.trim() === "" ||
      scenarioData?.gameIntroText?.value?.replace(/<\/?[^>]+(>|$)/g, "").trim() === ""
    ) {
      console.log("gameIntroText:", data.gameIntroText);
      data = {
        ...data,
        gameIntroText: {
          ...data.gameIntroText,
          error: "Please select game intro text",
        },
      };

      valid = false;
      isEmpty = true;

    }  else if (checkHtmlContentLength(scenarioData?.gameIntroText?.value, 3000)) {
      console.log("HTML content exceeds maxLength");
      data = {
        ...data,
        gameIntroText: {
          ...data.gameIntroText,
          error: "Game Intro content exceeds maximum length",
        },
      };

      valid = false;
    }

    if ((!scenarioID || !introFileDisplay) && scenarioData?.gameIntroFile?.value === "") {
      console.log("gameIntroFile:", data.gameIntroFile);
      data = {
        ...data,
        gameIntroFile: {
          ...data.gameIntroFile,
          error: "Please enter game intro video",
        },
      };

      // valid = false;
    }
    setScenarioData(data);
    if (!isEmpty) {
      if (valid) {
        let url = defaultIntroFileUrl.url;
        let fileType = defaultIntroFileUrl.type;

        if (scenarioData?.gameIntroFile?.value) {
          console.log(" game intro file is uploaded")
          const formData = new FormData();

          formData.append("Module", "scenario");
          formData.append(
            "contentType",
            scenarioData?.gameIntroFile?.value?.type
          );
          formData.append("FormFile", scenarioData?.gameIntroFile?.value);
          formData.append("ScenarioID", scenarioID); // TODO :: not implemented in backend
          formData.append("Requester.RequestID", generateGUID());
          formData.append("Requester.RequesterID", credentials.data.userID);
          formData.append("Requester.RequesterName", credentials.data.userName);
          formData.append("Requester.RequesterType", credentials.data.role);

          try {
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

              // now dispatch 
              const data = {
                scenarioID: scenarioID ? scenarioID : "",
                scenarioName: scenarioData?.scenarioName?.value,
                description: scenarioData?.scenarioDescription?.value,
                gameIntro: scenarioData?.gameIntroText?.value,
                introFile: url,
                introFileType: fileType,
                status: "Create",
                version: "1",
                baseVersionID: "1",
                // handled by backend :: status, version, baseVersionID
                requester: {
                  requestID: generateGUID(),
                  requesterID: credentials.data.userID,
                  requesterName: credentials.data.userName,
                  requesterType: credentials.data.role,
                },
              };
              dispatch(updateScenario(data));

            } else if (response.data && !response.data.success) {
              toast.error(response.data.message);
              console.log("error message :", response.data.message);
            } else {
              console.log("error message :", response.data.message);
              toast.error("File upload failed.");
            }

          } catch (error) {
            toast.error("An error occurred while uploading the file.");
            console.error("Axios error:", error);
          }
        } else {
          console.log(" game intro file is not uploaded")

          // if (url != "" || url != null || url != undefined) {
          // else if no intro file is uploaded 
          // console.log(" if url is not null, empty or indefiened")
          const data = {
            scenarioID: scenarioID ? scenarioID : "",
            scenarioName: scenarioData?.scenarioName?.value,
            description: scenarioData?.scenarioDescription?.value,
            gameIntro: scenarioData?.gameIntroText?.value,
            introFile: url || "",
            introFileType: fileType || "",
            status: "Create",
            version: "1",
            baseVersionID: "1",
            // handled by backend :: status, version, baseVersionID
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
          };
          dispatch(updateScenario(data));
          // } else {
          //   toast.error("Please upload Game intro file.");
          // }
        }

      }
    } else {
      // toast.error("Please fill all the mandatory details.");
    }
  };

  const onCancel = () => {
    if (scenarioID) {
      setScenarioDetailState();
      navigateTo("/scenario");
      return;
    } else {
      resetScenarioData();
      // setIntroFileDisplay(null);
      setIntroFileDisplay({
        url: null,
        type: null,
        name: null,
      });
    }
    navigateTo("/scenario");
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
            <div>
              <label>Update Scenario</label>
            </div>
            <div className={styles.lastEditedOn}>
              Last edited on {formatDateString(scenarioData?.updateAt?.value)}
            </div>
            {/*TODO:: Last edited On */}
          </div>
          <div className={styles.right}>
            <img src={bg_2} alt="create scenario background 2" />
          </div>
        </div>
        <div className={styles.mainContainer}>
          {/* Create Scenario:: start */}
          <div className={styles.formContainer}>
            <div className={styles.createScenarioFormLeft}></div>
            <div
              className={styles.createScenarioFormRight}
              style={{ backgroundImage: 'url("/images/particles.png")' }}
            >
              <div className={styles.createScenarioLeftInputs}>
                {/* <Input
                  type="text"
                  name="scenarioName"
                  value={scenarioData?.scenarioName?.value}
                  title="Scenario Name"
                  className="custom-input"
                  onChange={onChange}
                  required
                />
                <TextArea
                  type="text"
                  value={scenarioData?.scenarioDescription?.value}
                  name="scenarioDescription"
                  title="Scenario Description"
                  className={styles.gameIntroductionTextAreaInputs}
                  onChange={onChange}
                  required
                /> */}
                {/* <Input
                  labelStyle={styles.inputLabel}
                  type="text"
                  name={"scenarioName"}
                  value={scenarioData?.scenarioName?.value}
                  placeholder="Scenario Name &#128900;"
                  inputStyleClass={styles.inputStyleClass}
                  onChange={onChange}
                />
                <Input
                  value={scenarioData?.scenarioDescription?.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{ height: "15rem" }}
                  name={"scenarioDescription"}
                  placeholder="Scenario Description &#128900;"
                  textAreaStyleClass={styles.gameIntroductionTextAreaInputs}
                  onChange={onChange}
                  textArea
                /> */}
                <CustomInput
                  type="text"
                  name="scenarioName"
                  value={scenarioData?.scenarioName?.value}
                  title="Scenario Name"
                  inputStyleClass={styles.scenarioNameInput}
                  onChange={onChange}
                  required
                  error={scenarioData.scenarioName.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {scenarioData.scenarioName.error}
                    </div>
                  )}
                  maxLength={100}
                />
                <CustomInput
                  type="text"
                  value={scenarioData?.scenarioDescription?.value}
                  name="scenarioDescription"
                  title="Scenario Description"
                  // className={styles.gameIntroductionTextAreaInputs}
                  // customInputStyles={{ height: "15rem"  }}
                  onChange={onChange}
                  required
                  textArea={true}
                  error={scenarioData.scenarioDescription.error}
                  errorNode={(
                    <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                      {scenarioData.scenarioDescription.error}
                    </div>
                  )}
                  maxLength={3000}
                />
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.createScenarioRightInputs}></div>
            </div>
          </div>
          {/* Create Scenario:: end */}

          {/* Game Introdution:: start */}
          <div className={styles.formContainer}>
            <div className={styles.gameIntroductionFormLeft}></div>
            <div
              className={styles.gameIntroductionFormRight}
              style={{ backgroundImage: 'url("/images/particles.png")' }}
            >
              <div className={styles.gameIntroductionLeftInputs}>
                <label>Game Introduction</label>
                {/*Rich Text Editor */}
                {/* <RichTextEditor
                  customContaierClass={styles.customRichTextEditorContaierClass}
                  customEditorStyles={styles.customRichTextEditorStyleClass}
                  onChange={onGameIntroTextChange}
                  placeholder="Game Introduction &#128900;"
                  value={scenarioData?.gameIntroText?.value}
                /> */}
                <RichTextEditor
                  sampleConfig={sampleConfig}
                  title="Game Introduction"
                  data={scenarioData?.gameIntroText?.value}
                  customContaierClass={styles.customRichTextEditorContaierClass}
                  customEditorStyleClass={styles.customEditorStyleClass}
                  onChange={(event, value, htmlContent) => {
                    onGameIntroTextChange(htmlContent);
                  }}
                  required
                  error={scenarioData?.gameIntroText?.error}
                />
                {/* <Input
                  value={scenarioData?.gameIntroText?.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{ height: "15rem" }}
                  name={"gameIntroText"}
                  placeholder="Add Game Intro Text"
                  textAreaStyleClass={styles.gameIntroductionTextAreaInputs}
                  onChange={onChange}
                  textArea
                /> */}
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.gameIntroductionRightInputs}>
                <div className={styles.imageDropZoneContainerLeft}>
                  <FileDropZone
                    customstyle={{ marginTop: "1rem" }}
                    customContainerClass={styles.customFileDropzoneContainerClass}
                    label="Upload Game Intro Media"
                    hint="Eligible Formats: Mp4, Mp3, Image and PDF"
                    allowedFileTypes={allowedFileTypesArray}
                    onUpload={onUpload}
                    onResetFile={onResetFile}
                    fileSrc={introFileDisplay.url}
                    setUrl={(file) => {
                      // setIntroFileDisplay(file);
                      setIntroFileDisplay({
                        url: file,
                        type: file && extractFileType(file),
                        name: file && extractFileInfo(file).name,
                      });
                    }}
                    // fileSrcType={
                    //   introFileDisplay && extractFileType(introFileDisplay)
                    // }
                    // fileName={introFileDisplay && extractFileInfo(introFileDisplay).name}
                    fileSrcType={
                      (introFileDisplay) ?
                        introFileDisplay.type : ""
                    }
                    fileName={
                      (introFileDisplay) ?
                        introFileDisplay.name : ""
                    }
                  />
                </div>
                <div className={styles.imageDropZoneContainerRight}></div>
              </div>
            </div>
          </div>
          {/* Game Introdution:: end */}
        </div>
        <div className={styles.buttonContainer}>
          <Button buttonType="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Update Scenario</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default UpdateScenarios;
