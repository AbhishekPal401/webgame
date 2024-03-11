import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./uploadquestions.module.css";
import PageContainer from "../../../../../components/ui/pagecontainer";
import Button from "../../../../../components/common/button";
import FileDropZone from "../../../../../components/common/upload/FileDropzone";
import { baseUrl } from "../../../../../middleware/url.js";
import { generateGUID } from "../../../../../utils/common.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fileTypes } from "../../../../../constants/filetypes.js";
import { extractFileType } from "../../../../../utils/helper";
import { isJSONString } from "../../../../../utils/common.js";

function UploadQuestion() {
  const [uploadQuestionsData, setUploadQuestionsData] = useState({
    questionsExcel: {
      value: "",
      error: "",
      uploaded: false,
    },
  });
  const [excelFileDisplay, setExcelFileDisplay] = useState(null);
  const [uploading, setUploading] = useState(false); // New state for tracking upload operation

  const [resetFile, setResetFile] = useState(false);

  const { credentials } = useSelector((state) => state.login);
  const navigateTo = useNavigate();

  const { scenarioID } = useParams();

  useEffect(() => {
    if (uploadQuestionsData?.questionsExcel?.value === "") return;
    setResetFile(!resetFile);
  }, [uploadQuestionsData]);

  const onUpload = useCallback(
    (file) => {
      console.log("excel file uploaded :", file);
      setUploadQuestionsData((prevUploadQuestionsData) => ({
        ...prevUploadQuestionsData,
        questionsExcel: {
          value: file,
          error: "",
          uploaded: true,
        },
      }));
    },
    [uploadQuestionsData]
  );

  const onResetFile = useCallback(
    (file) => {
      setUploadQuestionsData((prevUploadQuestionsData) => ({
        ...prevUploadQuestionsData,
        questionsExcel: {
          value: "",
          error: "",
          uploaded: true,
        },
      }));
    },
    [uploadQuestionsData]
  );

  // const handleDownload = async () => {
  //   try {
  //     if(!scenarioID || !credentials) 
  //       return;

  //     const formData = new FormData();
  //     formData.append("TemplateType", "QuestionTemplate");

  //     const response = await axios.post(
  //       `${baseUrl}/api/Storage/GetFileTemplate`,
  //       formData
  //     );

  //     if (response.data && response.data.success) {
  //       const responseData = JSON.parse(response.data.data);
  //       console.log("responseData :", responseData)

  //       const data = JSON.parse(responseData.Data);
  //       console.log("data :", data)

  //       const downloadURL = data.DownloadURL;
  //       console.log("downloadURL :", downloadURL)

  //       // Create a link
  //       const link = document.createElement('a');
  //       link.href = downloadURL;
  //       link.setAttribute('download', 'QuestionTemplate.xlsx');

  //       // Trigger a click event
  //       link.click();

  //       // Remove the link
  //       document.body.removeChild(link);
  //     } else {
  //       console.log("Download failed:", response.data.message || "Unknown error");
  //     }
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //   }
  // };

  const handleDownload = async () => {
    try {
      const filePath = '/media/gametemplate/GameTemplate.xlsx'; 

      // Create a link
      const link = document.createElement('a');
      link.href = filePath;
      link.setAttribute('download', 'GameTemplate.xlsx');

      // Trigger a click event
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file:');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("scenarioID :", scenarioID);
    let valid = true;
    let data = uploadQuestionsData;

    if (uploadQuestionsData?.questionsExcel?.value === "") {
      data = {
        ...data,
        questionsExcel: {
          ...data.questionsExcel,
          error: "Please select excel file.",
        },
      };

      valid = false;
    }

    if (valid) {
      setUploading(true); // Set uploading state to true when starting upload
      const formData = new FormData();

      formData.append("Module", "questions");
      formData.append(
        "ContentType",
        uploadQuestionsData.questionsExcel.value.type
      );
      formData.append("FormFile", uploadQuestionsData.questionsExcel.value);
      formData.append("ScenarioID", scenarioID); // TODO :: scenarioID
      formData.append("Requester.RequestID", generateGUID());
      formData.append("Requester.RequesterID", credentials.data.userID);
      formData.append("Requester.RequesterName", credentials.data.userName);
      formData.append("Requester.RequesterType", credentials.data.role);

      try {
        const response = await axios.post(
          `${baseUrl}/api/Scenario/ExcelQuestionUploads`,
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

          const data = JSON.parse(serializedData.Data);
          console.log("response data : ", data);
          toast.success("Excel uploaded successfully.");
          // navigateTo("/scenario");
          navigateTo(`/questions/${scenarioID}`);
        }
        // else if(response.data && !response.data.success) {
        //     toast.error(response.data.message);
        //     console.log("error message :",response.data.message)
        // }
        else {
          toast.error("Excel upload failed.");
          console.log("not uploaded");
        }
      } catch (error) {

        toast.error("An error occurred while uploading the file.");
        console.error("Error uploading file:", error);

      } finally {
        setUploading(false); // Set uploading state to false after upload completion or failure
      }
    } else {
      toast.error("Please upload an excel file.");
    }
  };

  return (
    <PageContainer>
      <div className={styles.conatiner}>
        <div className={styles.topContainer}>
          <div className={styles.left}>
            <label>Question List</label>
          </div>
          <div
            className={styles.right}
            style={{ backgroundImage: 'url("/images/binary.png")' }}
          >
            <img src="./images/questions.png" />
            <div className={styles.buttonContainer}>
              {/* <Button onClick={onSubmit} buttonType="cancel">
                Upload Questions
              </Button> */}
              <Button
                onClick={onSubmit}
                buttonType="cancel"
                disabled={uploading} // Disable the button when uploading
                customStyle={{
                  color: uploading ? "var(--disabled_label)" : null // Change color when disabled
                }}
              >
                Upload Questions
              </Button>

              <Button onClick={handleDownload}>Download Template</Button>
            </div>
          </div>
        </div>
        <div className={styles.mainContainer}>
          <FileDropZone
            label="Upload Question File"
            customstyle={{ color: "#434343" }}
            customContainerClass={styles.customFileContianer}
            customFileNameContainerClass={styles.customFileNameContainerClass}
            hint="Eligible Formats: XLS and XLSX"
            customHintClass={styles.hint}
            onUpload={onUpload}
            onResetFile={onResetFile}
            fileSrc={excelFileDisplay}
            fileSrcType={excelFileDisplay && extractFileType(excelFileDisplay)}
            setUrl={(file) => {
              setExcelFileDisplay(file);
            }}
            resetFile={resetFile}
            allowedFileTypes={[fileTypes.MIME_EXCEL_1, fileTypes.MIME_EXCEL_2]}
          />
        </div>
      </div>
    </PageContainer>
  );
}

export default UploadQuestion;
