import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./uploadquestions.module.css";
import PageContainer from "../../../../../components/ui/pagecontainer";
import Button from "../../../../../components/common/button";
import FileDropZone from "../../../../../components/common/upload/FileDropZone";
import { baseUrl } from "../../../../../middleware/url.js";
import { generateGUID } from "../../../../../utils/common.js";
import axios from "axios";
import { useParams } from "react-router-dom";
import { fileTypes } from "../../../../../constants/filetypes.js";
import { extractFileType } from "../../../../../utils/helper";


function UploadQuestion() {

    const [uploadQuestionsData, setUploadQuestionsData] = useState({
        questionsExcel: {
            value: "",
            error: "",
            uploaded: false,
        },
    })
    const [excelFileDisplay, setExcelFileDisplay] = useState(null);

    const [resetFile, setResetFile] = useState(false);

    const { credentials } = useSelector((state) => state.login);
    const navigateTo = useNavigate();

    const { scenarioID } = useParams();

    useEffect(() => {
        if (uploadQuestionsData?.questionsExcel?.value === "")
            return;
        setResetFile(!resetFile);

    }, [uploadQuestionsData]);

    const onUpload = useCallback((file) => {
        console.log("excel file uploaded :", file);
        setUploadQuestionsData((prevUploadQuestionsData) => ({
            ...prevUploadQuestionsData,
            questionsExcel: {
                value: file,
                error: "",
                uploaded: true,
            },
        }));

    }, [uploadQuestionsData]);




    const onSubmit = async (event) => {
        event.preventDefault();

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
            const formData = new FormData();

            formData.append("Module", "questions");
            formData.append("ContentType", uploadQuestionsData.questionsExcel.value.type);
            formData.append("FormFile", uploadQuestionsData.questionsExcel.value);
            formData.append("ScenarioID", scenarioID); // TODO :: scenarioID
            formData.append("Requester.RequestID", generateGUID());
            formData.append("Requester.RequesterID", credentials.data.userID);
            formData.append("Requester.RequesterName", credentials.data.userName);
            formData.append("Requester.RequesterType", credentials.data.role);


            const response = await axios.post(
                `${baseUrl}/api/Scenario/ExcelQuestionUploads`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data && response.data.success) {
                const serializedData = JSON.parse(response.data.data);

                const data = JSON.parse(serializedData.Data);
                console.log("response data : ", data);
                toast.success("Excel uploaded successfully.");
                navigateTo("/scenario");
            }
            // else if(response.data && !response.data.success) {
            //     toast.error(response.data.message);
            //     console.log("error message :",response.data.message)
            // }
            else {
                toast.error("Excel upload failed.");
                console.log("not uploaded")
            }
        }
    }

    return (
        <PageContainer>
            <div className={styles.conatiner}>
                <div className={styles.topContainer}>
                    <div className={styles.left}>
                        <label>Question List</label>
                    </div>
                    <div className={styles.right}>
                        <img src="./images/questions.png" />
                        <div className={styles.buttonContainer}>
                            <Button
                                onClick={onSubmit}
                                buttonType="cancel"
                            >
                                Upload Questions
                            </Button>
                            <Button >Download Template</Button>
                        </div>
                    </div>
                </div>
                <div className={styles.mainContainer}>
                    <FileDropZone
                        label="Upload Question File"
                        customstyle={{ color: "#434343" }}
                        customContainerClass={styles.customFileContianer}
                        hint="Eligible Formats: XLS and XLSX"
                        customHintClass={styles.hint}
                        onUpload={onUpload}
                        fileSrc={excelFileDisplay}
                        fileSrcType={excelFileDisplay && extractFileType(excelFileDisplay)}
                        setUrl={(file) => {
                            setExcelFileDisplay(file);
                        }}
                        resetFile={resetFile}
                        allowedFileTypes={[
                            fileTypes.MIME_EXCEL_1,
                            fileTypes.MIME_EXCEL_2,
                        ]}
                    />
                </div>
            </div>

        </PageContainer>
    );
}

export default UploadQuestion;