import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DOMPurify from "dompurify";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./questionlist.module.css";
import Button from "../../../../../components/common/button";
import Checkbox from "../../../../../components/ui/checkbox";
import { useParams } from "react-router-dom";
import { getQuestionsByScenarioId } from "../../../../../store/app/admin/questions/getQuestionsByScenarioId.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../../../../../middleware/url.js";
import ModalContainer from "../../../../../components/modal/index.jsx";
import { generateGUID, isJSONString } from "../../../../../utils/common.js";
import {
  deleteQuestionByID,
  resetDeleteQuestionState
} from "../../../../../store/app/admin/questions/deleteQuestions.js";
import { toast } from "react-toastify";
import { extractFirstElementHTML, extractTextContent, isHTML } from "../../../../../utils/helper.js";
import Pagination from "../../../../../components/ui/pagination/index.jsx";


function QuestionList() {
  const [pageCount, setPageCount] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);

  const dispatch = useDispatch();

  const { credentials } = useSelector((state) => state.login);
  const { questionsByScenarioIdDetails } = useSelector(
    (state) => state.getQuestionsByScenarioId
  );
  const { deleteQuestionResponse } = useSelector((state) => state.deleteQuestions);

  const { scenarioID } = useParams();
  const navigate = useNavigate();

  console.log("scenarioID", scenarioID);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (credentials) {
      // const data = {
      //   scenarioID: scenarioID,
      // };
      const data = {
        scenarioID: scenarioID,
        pageNumber: pageNumber,
        pageCount: pageCount,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getQuestionsByScenarioId(data)).finally(() =>
        setIsLoading(false)
      );
    }
  }, [credentials, scenarioID, dispatch]);

  useEffect(() => {
    if (questionsByScenarioIdDetails && isJSONString(questionsByScenarioIdDetails?.data)) {
      const newPageNumber = JSON.parse(questionsByScenarioIdDetails?.data)?.CurrentPage;

      if (newPageNumber && typeof newPageNumber === "number") {
        setPageNumber(newPageNumber);
      }
    }
  }, [questionsByScenarioIdDetails]);

  useEffect(() => {
    if (!questionsByScenarioIdDetails) return;

    console.log(
      "parsed questionsByScenarioIdDetails :",
      JSON.parse(questionsByScenarioIdDetails?.data).questionDetails
    );

    const questionsData = JSON.parse(questionsByScenarioIdDetails?.data).questionDetails;

    if (questionsData?.length <= 0 && !isLoading) {
      navigate(`/questions/uploadquestions/${scenarioID}`);
    }
  }, [questionsByScenarioIdDetails, navigate, scenarioID, isLoading]);

  useEffect(() => {
    if (deleteQuestionResponse === null || deleteQuestionResponse === undefined) return;

    if (deleteQuestionResponse.success) {
      toast.success(deleteQuestionResponse.message);

      // const data = {
      //   scenarioID: scenarioID,
      // };

      const data = {
        scenarioID: scenarioID,
        pageNumber: pageNumber,
        pageCount: pageCount,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getQuestionsByScenarioId(data)).finally(() =>
        setIsLoading(false)
      );

      dispatch(resetDeleteQuestionState());
      setShowDeleteModal(null);

    } else if (!deleteQuestionResponse.success) {
      toast.error(deleteQuestionResponse.message);
    }
  }, [deleteQuestionResponse]);

  // const handleDownload = async () => {
  //   try {
  //     if (!scenarioID || !credentials)
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

  const handleCheckboxChange = (questionId) => {
    const isSelected = selectedCheckboxes.includes(questionId);
    const updatedRows = isSelected
      ? selectedCheckboxes.filter((row) => row !== questionId)
      : [...selectedCheckboxes, questionId];

    setSelectedCheckboxes(updatedRows);
  };

  const onDeleteQuestion = () => {
    const data = {
      questionID: showDeleteModal.QuestionID,
    };

    dispatch(deleteQuestionByID(data));
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
              {/* <Button buttonType="cancel">Upload Questions</Button> */}
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
                  {/* <th>Level</th> */}
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
                  JSON.parse(questionsByScenarioIdDetails?.data).questionDetails?.map(
                    (question, index) => {
                      const isSelected = selectedCheckboxes.includes(question.QuestionID);
                      return (
                        <tr key={index}>
                          <td>
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleCheckboxChange(question.QuestionID)}
                            />
                          </td>
                          {/* <td>{index + 1}</td> */}
                          <td>{index + pageCount * (pageNumber - 1) + 1}</td>
                          {/* {typeof question.QuestionText === 'string' && isHTML(question.QuestionText) ? (
                            <div dangerouslySetInnerHTML={{ __html: extractFirstElementHTML(question.QuestionText) || '' }}></div>
                          ) : (
                            <div>{question.QuestionText}</div>
                          )} */}
                          {/* <td className={styles.tableContentCell}>
                            <div dangerouslySetInnerHTML={{ __html:  DOMPurify.sanitize(question.QuestionText) || '' }}></div>
                          </td> */}

                          {question.QuestionText && isHTML(question.QuestionText) ?
                            (
                              <td className={styles.tableContentCell}>
                                <div dangerouslySetInnerHTML={{ __html: extractFirstElementHTML(question.QuestionText) || '' }}></div>
                              </td>
                            ) :
                            (
                              <td className={styles.tablePlainCell}>
                                <div  >{question.QuestionText}</div>
                              </td>
                            )
                          }
                          {/* <td>
                            {question.QuestionText}
                          </td> */}

                          {/* <td className={styles.scenarioDescription}>
                            Levels
                          </td> */}
                          <td>{question.Answers}</td>
                          <td>{question.DelegatedTo}</td>
                          <td>{question.NarativeMedia}</td>
                          <td>
                            <div className={styles.actions}>
                              <div className={styles.circleSvg}
                                onClick={() => {
                                  if (isSelected) {
                                    navigate(
                                      `/questions/${scenarioID}/questionbuilder/${question.QuestionID}`
                                    );
                                  }
                                }}
                              >
                                <svg
                                  height="12"
                                  width="12"
                                  style={{ opacity: isSelected ? "1" : "0.3" }}
                                >
                                  <use xlinkHref="sprite.svg#edit_icon" />
                                </svg>
                              </div>
                              <div
                                className={styles.circleSvg}
                                onClick={() => {
                                  if (isSelected) {
                                    setShowDeleteModal(question);
                                  }
                                }}
                              >
                                <svg
                                  height="14"
                                  width="12"
                                  style={{ opacity: isSelected ? "1" : "0.3" }}
                                >
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
            {questionsByScenarioIdDetails && questionsByScenarioIdDetails.success && questionsByScenarioIdDetails.data && (
              <div className={styles.paginationContainer}>
                <Pagination
                  totalCount={JSON.parse(questionsByScenarioIdDetails.data)?.TotalCount}
                  pageNumber={pageNumber}
                  countPerPage={pageCount}
                  onPageChange={(pageNumber) => {
                    const data = {
                      scenarioID: scenarioID,
                      pageNumber: pageNumber,
                      pageCount: pageCount,
                      requester: {
                        requestID: generateGUID(),
                        requesterID: credentials.data.userID,
                        requesterName: credentials.data.userName,
                        requesterType: credentials.data.role,
                      },
                    };

                    dispatch(getQuestionsByScenarioId(data))
                  }}
                />
              </div>
            )}

          </div>
        </div>



        {/* Questions Table:: end */}
      </div>
      {showDeleteModal && (
        <ModalContainer>
          <div className="modal_content">
            <div className="modal_header">
              <div>Delete Question</div>
              <div>
                <svg
                  className="modal_crossIcon"
                  onClick={() => {
                    setShowDeleteModal(null);
                  }}
                >
                  <use xlinkHref={"sprite.svg#crossIcon"} />
                </svg>
              </div>
            </div>
            <div className="modal_description">
              Are you sure you want to delete this question ?
            </div>

            <div className="modal_buttonContainer">
              <Button
                buttonType={"cancel"}
                onClick={() => {
                  setShowDeleteModal(null);
                }}
              >
                Cancel
              </Button>
              <Button
                customStyle={{
                  marginLeft: "1rem",
                }}
                onClick={onDeleteQuestion}
              >
                Delete
              </Button>
            </div>
          </div>
        </ModalContainer>
      )}
    </PageContainer>
  );
}

export default QuestionList;
