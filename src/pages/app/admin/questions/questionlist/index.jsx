import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./questionlist.module.css";
import Button from "../../../../../components/common/button";
import Checkbox from "../../../../../components/ui/checkbox";
import { useParams } from "react-router-dom";
import { getQuestionsByScenarioId } from "../../../../../store/app/admin/questions/getQuestionsByScenarioId.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../../middleware/url.js";

function QuestionList() {
  const dispatch = useDispatch();

  const { credentials } = useSelector((state) => state.login);
  const { questionsByScenarioIdDetails } = useSelector(
    (state) => state.getQuestionsByScenarioId
  );

  const { scenarioID } = useParams();
  const navigate = useNavigate();

  console.log("scenarioID", scenarioID);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (credentials) {
      const data = {
        scenarioID: scenarioID,
      };

      dispatch(getQuestionsByScenarioId(data)).finally(() =>
        setIsLoading(false)
      );
    }
  }, [credentials, scenarioID, dispatch]);

  useEffect(() => {
    if (!questionsByScenarioIdDetails) return;

    console.log(
      "parsed questionsByScenarioIdDetails :",
      JSON.parse(questionsByScenarioIdDetails?.data)
    );

    const questionsData = JSON.parse(questionsByScenarioIdDetails?.data);

    if (questionsData?.length <= 0 && !isLoading) {
      navigate(`/questions/uploadquestions/${scenarioID}`);
    }
  }, [questionsByScenarioIdDetails, navigate, scenarioID, isLoading]);

  const handleDownload = async () => {
    try {
      if (!scenarioID || !credentials)
        return;

      const formData = new FormData();
      formData.append("TemplateType", "QuestionTemplate");

      const response = await axios.post(
        `${baseUrl}/api/Storage/GetFileTemplate`,
        formData
      );

      if (response.data && response.data.success) {
        const responseData = JSON.parse(response.data.data);
        console.log("responseData :", responseData)

        const data = JSON.parse(responseData.Data);
        console.log("data :", data)

        const downloadURL = data.DownloadURL;
        console.log("downloadURL :", downloadURL)

        // Create a link
        const link = document.createElement('a');
        link.href = downloadURL;
        link.setAttribute('download', 'QuestionTemplate.xlsx');

        // Trigger a click event
        link.click();

        // Remove the link
        document.body.removeChild(link);
      } else {
        console.log("Download failed:", response.data.message || "Unknown error");
      }
    } catch (error) {
      console.error('Error downloading file:', error);
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
              <Button buttonType="cancel">Upload Questions</Button>
              <Button onClick={handleDownload}>Download Template</Button>
            </div>
          </div>
        </div>
        {/* Questions Table:: start */}
        <div className={styles.mainContainer}>
          <div className={styles.mainTableContainer}>
            <table className={styles.table_content}>
              <thead>
                <tr>
                  <th></th>
                  <th>#</th>
                  <th>Questions</th>
                  <th>Level</th>
                  <th>Answers</th>
                  <th>Decision maker</th>
                  <th>Narrative Media</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {questionsByScenarioIdDetails &&
                  questionsByScenarioIdDetails.success &&
                  questionsByScenarioIdDetails.data &&
                  JSON.parse(questionsByScenarioIdDetails?.data).map(
                    (question, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <Checkbox />
                          </td>
                          <td>{index + 1}</td>
                          <td>
                            {question.QuestionText}
                          </td>
                          <td className={styles.scenarioDescription}>
                            Levels{/* TODO :: get levels */}
                          </td>
                          <td>{question.Answers}</td>
                          <td>{question.DelegatedTo}</td>
                          <td>{question.NarativeMedia}</td>
                          <td>
                            <div className={styles.actions}>
                              <div className={styles.circleSvg}
                                onClick={() => {
                                  navigate(
                                    `/questions/${scenarioID}/questionbuilder/${question.QuestionID}`
                                  );
                                }}
                              >
                                <svg height="14" width="14">
                                  <use xlinkHref="sprite.svg#edit_icon" />
                                </svg>
                              </div>
                              <div className={styles.circleSvg}>
                                <svg height="14" width="14">
                                  <use xlinkHref="sprite.svg#delete_icon" />
                                </svg>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Questions Table:: end */}
      </div>
    </PageContainer>
  );
}

export default QuestionList;
