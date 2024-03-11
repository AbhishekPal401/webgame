import React, { useCallback, useEffect, useState } from "react";
import styles from "./createscenarios.module.css";
import bg_2 from "/images/createscenario2.png";
import PageContainer from "../../../../components/ui/pagecontainer";
import Input from "../../../../components/common/input";
import FileDropZone from "../../../../components/common/upload/FileDropzone";
import Button from "../../../../components/common/button";
import { useDispatch, useSelector } from "react-redux";
import { baseUrl } from "../../../../middleware/url";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  createScenario,
  resetCreateScenarioState,
} from "../../../../store/app/admin/scenario/createScenario.js";
import { generateGUID } from "../../../../utils/common.js";
import axios from "axios";
import { fileTypes } from "../../../../constants/filetypes.js";
import { extractFileType } from "../../../../utils/helper.js";
import RichTextEditor from "../../../../components/common/richtexteditor/index.jsx";

const CreateScenario = () => {
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
    gameIntroVideo: {
      value: "",
      error: "",
    },
  });

  const [resetFile, setResetFile] = useState(false);
  const [introFileDisplay, setIntroFileDisplay] = useState(null);

  // console.log(" scenario data :", scenarioData)

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

  const { credentials } = useSelector((state) => state.login);

  const { createScenarioResponse } = useSelector(
    (state) => state.createScenario
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const onResetFile = useCallback(
    (file) => {
      setScenarioData((prevScenarioData) => ({
        ...prevScenarioData,
        gameIntroVideo: {
          value: "",
          error: "",
        },
      }));
    },
    [scenarioData]
  );

  useEffect(() => {
    if (createScenarioResponse === null || createScenarioResponse === undefined)
      return;

    if (createScenarioResponse?.success) {
      toast.success(createScenarioResponse.message);
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
        gameIntroVideo: {
          value: "",
          error: "",
        },
      });
      setIntroFileDisplay(null);
      console.log("createScenarioResponse :", createScenarioResponse);
      console.log(
        " JSON.parse(createScenarioResponse?.data data:",
        JSON.parse(createScenarioResponse?.data)
      );

      //navigate to upload questions excel
      navigateTo(
        `/questions/uploadquestions/${JSON.parse(createScenarioResponse?.data)?.ScenarioID
        }`
      );

      setResetFile(!resetFile);
      dispatch(resetCreateScenarioState());
    } else if (!createScenarioResponse.success) {
      toast.error(createScenarioResponse.message);
      dispatch(resetCreateScenarioState());
    } else {
      dispatch(resetCreateScenarioState());
    }
  }, [createScenarioResponse, resetFile]);

  const onChange = (event) => {
    setScenarioData({
      ...scenarioData,
      [event.target.name]: {
        value: event.target.value,
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
        gameIntroVideo: {
          value: file,
          error: "",
        },
      }));
    },
    [scenarioData]
  );

  // Create scenario on submit
  const onSubmit = async (event) => {
    event.preventDefault();

    let isEmpty = false;
    let valid = true;
    let data = scenarioData;

    if (scenarioData?.scenarioName?.value?.trim() === "") {
      console.log("scenarioName :", scenarioData?.scenarioName?.value);
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
      console.log("scenarioDescription :", scenarioData?.scenarioDescription?.value);
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
      console.log("gameIntroText :", scenarioData?.gameIntroText?.value);
      data = {
        ...data,
        gameIntroText: {
          ...data.gameIntroText,
          error: "Please select game intro text",
        },
      };

      valid = false;
      isEmpty = true;
    }

    if (scenarioData?.gameIntroVideo?.value === "") {
      console.log("gameIntroVideo :", scenarioData?.gameIntroVideo?.value);
      data = {
        ...data,
        gameIntroVideo: {
          ...data.gameIntroVideo,
          error: "Please select game intro video",
        },
      };

      // valid = false;
    }

    if (!isEmpty) {
      if (valid) {

        if (scenarioData?.gameIntroVideo?.value) {
          console.log("Game intro file is uploaded");
          const formData = new FormData();

          formData.append("Module", "scenario");
          formData.append("contentType", scenarioData.gameIntroVideo.value.type);
          formData.append("FormFile", scenarioData.gameIntroVideo.value);
          formData.append("ScenarioID", "file"); // TODO :: not implemented in backend
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

              const url = JSON.parse(serializedData.Data).URL;

              const data = {
                scenarioName: scenarioData?.scenarioName?.value,
                description: scenarioData?.scenarioDescription?.value,
                gameIntro: scenarioData?.gameIntroText?.value,
                introFile: url,
                introFileType: scenarioData?.gameIntroVideo?.value?.type,
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

              console.log("data sent to API :", data);
              dispatch(createScenario(data));
            } else if (response.data && !response.data.success) {
              toast.error(response.data.message);
              console.log("error message :", response.data.message);
            } else {
              console.log("error message :", response);
              toast.error("File upload failed.");
            }
          } catch (error) {
            // Handle Axios or network errors
            toast.error("An error occurred while uploading the file.");
            console.error("Axios error:", error);
          }

        } else {
          console.log("No game intro file is uploaded");
          const data = {
            scenarioName: scenarioData?.scenarioName?.value,
            description: scenarioData?.scenarioDescription?.value,
            gameIntro: scenarioData?.gameIntroText?.value,
            introFile: "",
            introFileType: "",
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

          console.log("data sent to API :", data);
          dispatch(createScenario(data));

        }


      }
    } else {
      toast.error("Please fill all the details.");
    }
  };

  const onCancel = () => {
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
      gameIntroVideo: {
        value: "",
        error: "",
      },
    });

    setResetFile(!resetFile);
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
            <label>Create Scenario</label>
            <div className={styles.lastEditedOn}>{ }</div>
            {/*TODO:: Last edited On */}
          </div>
          <div className={styles.right}>
            <img
              src={"/images/createscenario2.png"}
              alt="create scenario background 2"
            />
          </div>
        </div>
        <div className={styles.mainContainer}>
          {/* Create Scenario:: start */}
          <div className={styles.formContainer}>
            <div className={styles.createScenarioFormLeft}></div>
            <div
              style={{ backgroundImage: 'url("./images/particles.png")' }}
              className={styles.createScenarioFormRight}
            >
              <div className={styles.createScenarioLeftInputs}>
                <Input
                  labelStyle={styles.inputLabel}
                  type="text"
                  name={"scenarioName"}
                  value={scenarioData?.scenarioName?.value}
                  placeholder="Scenario Name &#128900;"
                  inputStyleClass={styles.inputStyleClass}
                  onChange={onChange}
                />
                {/*TODO:: Rich Text Editor */}
                <Input
                  value={scenarioData?.scenarioDescription?.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{ height: "15rem" }}
                  name={"scenarioDescription"}
                  placeholder="Scenario Description &#128900;"
                  textAreaStyleClass={styles.gameIntroductionTextAreaInputs}
                  onChange={onChange}
                  textArea
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
              style={{ backgroundImage: 'url("./images/particles.png")' }}
              className={styles.gameIntroductionFormRight}
            >
              <div className={styles.gameIntroductionLeftInputs}>
                <label>Game Introduction</label>
                {/*TODO:: Rich Text Editor */}
                <RichTextEditor
                  customContaierClass={styles.customRichTextEditorContaierClass}
                  customEditorStyles={styles.customRichTextEditorStyleClass}
                  onChange={onGameIntroTextChange}
                  placeholder="Game Introduction &#128900;"
                  value={scenarioData?.gameIntroText?.value}
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
                    fileSrc={introFileDisplay}
                    setUrl={(file) => {
                      setIntroFileDisplay(file);
                    }}
                    hint="Eligible Formats: Mp4, Mp3, Image and PDF"
                    onUpload={onUpload}
                    onResetFile={onResetFile}
                    resetFile={resetFile}
                    fileSrcType={
                      introFileDisplay && extractFileType(introFileDisplay)
                    }
                    allowedFileTypes={allowedFileTypesArray}
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
          <Button onClick={onSubmit}>Build Scenario</Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateScenario;
