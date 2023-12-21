import React, { useCallback, useEffect, useState } from "react";
import styles from "./createscenarios.module.css";
import bg_2 from "../../../../../public/images/create_scenario_bg_2.png";
import PageContainer from "../../../../components/ui/pagecontainer";
import Input from "../../../../components/common/input";
import ImageDropZone from "../../../../components/common/upload/ImageDropzone";
import FileDropZone from "../../../../components/common/upload/FileDropZone";
import Button from "../../../../components/common/button";
import { getAllMasters } from "../../../../store/app/admin/users/masters";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../../../utils/validators";
import { baseUrl } from "../../../../middleware/url";
import { toast } from "react-toastify";
import {
  createScenario,
  resetCreateScenarioState,
} from "../../../../store/app/admin/scenario/createScenario.js";
import { getUsersbyPage } from "../../../../store/app/admin/users/users.js";
import { generateGUID } from "../../../../utils/common.js";
import axios from "axios";

const CreateUser = () => {
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

  const { credentials } = useSelector((state) => state.login);

  const {createScenario} = useSelector((state => state.createScenario));  
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getAllMasters());
  // }, []);

  useEffect(() => {
    console.log("scenarioData :",scenarioData);
    if (createScenario === null) return;

    if (createScenario?.success) {
      toast.success(createScenario.message);
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
      dispatch(resetCreateScenarioState());
    } else if (!createScenario.success) {
      toast.error(createScenario.message);
      dispatch(resetCreateScenarioState());
    } else {
      dispatch(resetCreateScenarioState());
    }
  }, [createScenario, resetFile]);

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

    let valid = true;
    let data = scenarioData;

    if (scenarioData.scenarioName.value === "") {
      data = {
        ...data,
        scenarioName: {
          ...data.scenarioName,
          error: "Please enter scenario name",
        },
      };

      valid = false;
    }

    if (scenarioData.scenarioDescription.value === "") {
      data = {
        ...data,
        scenarioDescription: {
          ...data.scenarioDescription,
          error: "Please enter scenario description",
        },
      };

      valid = false;
    }

    if (scenarioData.gameIntroVideo.value === "") {
      data = {
        ...data,
        gameIntroVideo: {
          ...data.gameIntroVideo,
          error: "Please select game intro video",
        },
      };

      valid = false;
    }

    if (valid) {
      const formData = new FormData();

      formData.append("Module", "scenario");
      formData.append("contentType", scenarioData.gameIntroVideo.value.type);
      formData.append("FormFile", scenarioData.gameIntroVideo.value);

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
        console.log("serializedData :",serializedData);

        const url = JSON.parse(serializedData.Data).URL;
        console.log("url :",url);

        const data = {
          scenarioName: scenarioData.scenarioName.value,
          description: scenarioData.scenarioDescription.value,
          // not accepting :: gameIntroText: scenarioData.gameIntroText.value,
          introFile: url,
          // todo:: introFileType: type 
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

        console.log("data :",data);

        dispatch(createScenario(data));
      }
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
  };

  return (
    <PageContainer>
      <div className={styles.topContainer}>
        <div className={styles.left}>
          <label>Create Scenario</label>
          <div className={styles.lastEditedOn}>{}</div>{/* Last edited On */}
        </div>
        <div className={styles.right}>
          <img src={bg_2} alt="create scenario background 2" />
        </div>
      </div>
      <div className={styles.mainContainer}>

        {/* Create Scenario:: start */}
        <div className={styles.formContainer}>
          <div className={styles.createScenarioFormLeft}></div>
          <div className={styles.createScenarioFormRight}>
            <div className={styles.createScenarioLeftInputs}>
              <Input
                labelStyle={styles.inputLabel}
                type="text"
                name={"scenarioName"}
                value={setScenarioData?.scenarioName?.value}
                placeholder="Scenario Name"
                onChange={onChange}
              />
              {/* Rich Text Editor */}
              <Input
                labelStyle={styles.inputLabel}
                customStyle={{ height: '70%' }}
                name={"scenarioDescription"}
                value={setScenarioData?.scenarioDescription?.value}
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
          <div className={styles.gameIntroductionFormRight}>
            <div className={styles.gameIntroductionLeftInputs}>
            <label>Game Introduction</label>
              <Input
                labelStyle={styles.inputLabel}
                customStyle={{ height: '80%' }}
                type="text"
                name={"gameIntroText"}
                value={setScenarioData?.gameIntroText?.value}
                placeholder="Add Game Intro Text"
                textAreaStyleClass={styles.gameIntroductionTextAreaInputs}
                onChange={onChange}
                textArea
              />
            </div>
            <div className={styles.gameIntroductionRightInputs}>
              <div className={styles.imageDropZoneContainerLeft}>
              <FileDropZone
                customstyle={{ marginTop: "1rem" }}
                label="Upload Game Intro Video"
                onUpload={onUpload}
                resetFile={resetFile}
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
        <Button onClick={onSubmit}>Create</Button>
      </div>
    </PageContainer>
  );
};

export default CreateUser;
