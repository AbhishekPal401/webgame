import React, { useCallback, useEffect, useState } from "react";
import styles from "./updatescenarios.module.css";
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
import { formatDateString } from "../../../../utils/helper.js";
import { dateFormats } from "../../../../constants/date.js";
import { fileTypes } from "../../../../constants/filetypes.js";
import { extractFileType } from "../../../../utils/helper.js";

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
  const [introFileDisplay, setIntroFileDisplay] = useState(null);

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
        introFileDisplay(null);
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
      setIntroFileDisplay(null);
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
  }, [scenarioID]);

  const setScenarioDetailState = useCallback(() => {
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

      setIntroFileDisplay(data.IntroFileDisplay);
      setDefaultIntroFileUrl((previous) => ({
        ...previous,
        url: data.IntroFile,
        type: data.IntroFileType,
      }));

      setScenarioData(newData);
    }
  }, [scenarioByIdDetails]);

  // update the Scenario Data state with new data and render it
  useEffect(() => {
    if (scenarioByIdDetails === null || scenarioByIdDetails === undefined)
      return;

    if (!scenarioID) return;
    setScenarioDetailState();
  }, [scenarioByIdDetails]);

  const onChange = (event) => {
    setScenarioData({
      ...scenarioData,
      [event.target.name]: {
        value: event.target.value,
        error: "",
      },
    });
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

  // Update scenario on submit
  const onSubmit = async (event) => {
    event.preventDefault();

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
    }

    if (scenarioData?.gameIntroText?.value?.trim() === "") {
      console.log("gameIntroText:", data.gameIntroText);
      data = {
        ...data,
        gameIntroText: {
          ...data.gameIntroText,
          error: "Please select game intro text",
        },
      };

      valid = false;
    }

    if (!scenarioID && scenarioData?.gameIntroFile?.value === "") {
      console.log("gameIntroFile:", data.gameIntroFile);
      data = {
        ...data,
        gameIntroFile: {
          ...data.gameIntroFile,
          error: "Please select game intro video",
        },
      };

      valid = false;
    }

    if (valid) {
      let url = defaultIntroFileUrl.url;
      let fileType = defaultIntroFileUrl.type;

      if (scenarioData?.gameIntroFile?.value) {
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

        if (url != "" || url != null || url != undefined) {
          // else if no intro file is uploaded 
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
        } else {
          toast.error("Please upload Game intro file.");
        }
      }

    } else {
      toast.error("Please fill all the details.");
    }
  };

  const onCancel = () => {
    if (scenarioID) {
      setScenarioDetailState();
      navigateTo("/scenario");
      return;
    } else {
      resetScenarioData();
      setIntroFileDisplay(null);
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
                <Input
                  labelStyle={styles.inputLabel}
                  type="text"
                  name={"scenarioName"}
                  value={scenarioData?.scenarioName?.value}
                  placeholder="Scenario Name"
                  onChange={onChange}
                />
                {/*TODO:: Rich Text Editor */}
                <Input
                  value={scenarioData?.scenarioDescription?.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{ height: "70%" }}
                  name={"scenarioDescription"}
                  placeholder="Scenario Description"
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
              className={styles.gameIntroductionFormRight}
              style={{ backgroundImage: 'url("/images/particles.png")' }}
            >
              <div className={styles.gameIntroductionLeftInputs}>
                <label>Game Introduction</label>
                {/*TODO:: Rich Text Editor */}
                <Input
                  value={scenarioData?.gameIntroText?.value}
                  labelStyle={styles.inputLabel}
                  customStyle={{ height: "80%" }}
                  name={"gameIntroText"}
                  placeholder="Add Game Intro Text"
                  textAreaStyleClass={styles.gameIntroductionTextAreaInputs}
                  onChange={onChange}
                  textArea
                />
              </div>
              <div className={styles.verticalLine}></div>
              <div className={styles.gameIntroductionRightInputs}>
                <div className={styles.imageDropZoneContainerLeft}>
                  <FileDropZone
                    customstyle={{ marginTop: "1rem" }}
                    label="Upload Game Intro Video"
                    hint="Eligible Formats: MP4 and MP3"
                    allowedFileTypes={[
                      fileTypes.AUDIO_EXTENSION,
                      fileTypes.VIDEO_EXTENSION,
                      fileTypes.MIME_AUDIO_1,
                      fileTypes.MIME_AUDIO_2,
                      fileTypes.MIME_VIDEO,
                    ]}
                    onUpload={onUpload}
                    fileSrc={introFileDisplay}
                    setUrl={(file) => {
                      setIntroFileDisplay(file);
                    }}
                    fileSrcType={
                      introFileDisplay && extractFileType(introFileDisplay)
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