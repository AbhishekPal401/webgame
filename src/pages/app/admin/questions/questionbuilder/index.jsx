import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import styles from "./questionbuilder.module.css";
import PageContainer from "../../../../../components/ui/pagecontainer";
import Button from "../../../../../components/common/button";
import InputDataContainer from "../../../../../components/ui/inputdatacontainer";
import Input from "../../../../../components/common/input";
import FileDropZone from "../../../../../components/common/upload/FileDropzone";
import { fileTypes } from "../../../../../constants/filetypes";
import { generateGUID, isJSONString } from "../../../../../utils/common";
import { baseUrl } from "../../../../../middleware/url";
import { getAllMasters } from "../../../../../store/app/admin/users/masters";
import {
  getQuestionDetailsByID,
  resetQuestionDetailState,
} from "../../../../../store/app/admin/questions/getQuestionDetailsById";
import {
  updateQuestion,
  resetUpdateQuestionState,
} from "../../../../../store/app/admin/questions/updateQuestion";
import { extractFileInfo, extractFileType } from "../../../../../utils/helper";
import RichTextEditor from "../../../../../components/common/richtexteditor";

function QuestionBuilder() {
  const [questionData, setQuestionData] = useState({
    question: {
      value: "",
      error: "",
    },
    decisionMaker: {
      value: "",
      error: "",
    },
    narrativeMedia: {
      value: "",
      error: "",
    },
    answers: [],
  });

  // const [resetFile, setResetFile] = useState(false);
  const [supportFIleDefaultUrl, setSupportFileDefaultUrl] = useState({
    url: null,
    type: null,
  });
  const [supportFileDisplayURL, setSupportFileDisplayURL] = useState(null);

  const { questionByIdDetails, loading: questionByIdDetailsLoading } =
    useSelector((state) => state.getQuestionDetailsByid);

  const { masters, loading: masterLoading } = useSelector(
    (state) => state.masters
  );

  const { credentials } = useSelector((state) => state.login);

  const { updateQuestionResponse, loading: updateQuestionLoading } =
    useSelector((state) => state.updateQuestion);

  const { scenarioID, questionID } = useParams();
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

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

  const resetQuestionData = () => {
    setQuestionData({
      question: {
        value: "",
        error: "",
      },
      decisionMaker: {
        value: "",
        error: "",
      },
      narrativeMedia: {
        value: "",
        error: "",
      },
      answers: [],
    });
  };

  //dispatch request to get the the masters and questionDetailsById
  useEffect(() => {
    dispatch(getAllMasters());
    // dispatch(resetQuestionDetailState());
  }, []);

  // update question details
  useEffect(() => {
    if (updateQuestionResponse === null || updateQuestionResponse === undefined)
      return;

    if (updateQuestionResponse?.success) {
      toast.success(updateQuestionResponse?.message);
      if (questionID && scenarioID) {
        console.log("update success and ID's ae present:");
        const data = {
          scenarioID: scenarioID,
          questionID: questionID,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };

        dispatch(getQuestionDetailsByID(data));

        navigateTo(`/questions/${scenarioID}`);
      } else {
        setSupportFileDisplayURL(null);
        resetQuestionData();
      }

      dispatch(resetUpdateQuestionState());
      dispatch(resetQuestionDetailState());
    } else if (!updateQuestionResponse.success) {
      if (questionID && scenarioID) {
        const data = {
          scenarioID: scenarioID,
          questionID: questionID,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
        };
        dispatch(getQuestionDetailsByID(data));
      }
      toast.error(updateQuestionResponse?.message);
      dispatch(resetUpdateQuestionState());
    } else {
      dispatch(resetUpdateQuestionState());
    }
  }, [updateQuestionResponse]);

  // check the questionID & scenarioID are not present and reset else getQuestionDetailsByID
  useEffect(() => {
    if (
      questionID === null ||
      questionID === undefined ||
      scenarioID === null ||
      scenarioID === undefined
    ) {
      resetQuestionData();
      setSupportFileDisplayURL(null);
    } else {
      const data = {
        scenarioID: scenarioID,
        questionID: questionID,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };

      dispatch(getQuestionDetailsByID(data));
    }
  }, [questionID, scenarioID]);

  // //DEBUG
  //     // check the questionID & scenarioID are not present and reset else getQuestionDetailsByID
  //     useEffect(() => {
  //         if (questionID != null ||
  //             questionID != undefined ||
  //             scenarioID != null ||
  //             scenarioID != undefined) {

  //                 console.log("questionByIdDetails :",questionByIdDetails);
  //                 const data = JSON.parse(questionByIdDetails?.data);
  //                 console.log("questionByIdDetails data:",data);
  //         }
  //     }, [questionID, scenarioID]);

  // set the updated data into Question state
  const setQuestionDetailState = useCallback(() => {
    // if (isJSONString(masters.data)) {
    //     const data = JSON.parse(masters.data);
    //     console.log("master data :", data);
    // }

    if (isJSONString(questionByIdDetails.data)) {
      const data = JSON.parse(questionByIdDetails.data);
      console.log("questionByIdDetails data:", data);

      // map answers from questionByIdDetails
      const answers = data.Answers.map((answer) => {
        return {
          answerId: {
            value: answer.AnswerID,
            error: "",
          },
          option: {
            value: answer.AnswerText,
            error: "",
          },
          optimal: {
            value: answer.IsOptimalAnswer,
            error: "",
          },
          score: {
            value: answer.AnswerScore,
            error: "",
          },
          nextQuestion: {
            value: answer.NextQuestionNo,
            error: "",
          },
          consequence: {
            value: answer.Content,
            // answer.Content == null ? "Dummy consequence" : answer.Content, // TODO:: the consequence is null from backedn for now
            error: "",
          },
          narrative: {
            value: "", // Fill this with appropriate value
            error: "",
          },
        };
      });

      const newData = {
        question: {
          value: data.Question.QuestionText,
          error: "",
        },
        decisionMaker: {
          value: data.Question.DelegatedTo, // will be set on Select the decisiom maker from masters
          error: "",
        },
        narrativeMedia: {
          value: "",
          error: "",
        },
        answers: answers,
      };
      console.log("SupportFileDisplay:", data.Question.SupportFileDisplay);
      setSupportFileDisplayURL(data.Question.SupportFileDisplay);
      setSupportFileDefaultUrl((previous) => ({
        ...previous,
        url: data.Question.SupportFile,
        type: data.Question.SupportFileType,
      }));
      console.log("newData to set : ", newData);
      setQuestionData(newData);
    }
  }, [questionByIdDetails]);

  useEffect(() => {
    if (questionByIdDetails === null || questionByIdDetails === undefined)
      return;

    if (!scenarioID && !questionID) return;

    setQuestionDetailState();
    console.log("questionByIdDetails :", questionByIdDetails);
  }, [questionByIdDetails]);

  // useEffect(() => {
  //     console.log("check questionByIdDetails", questionByIdDetails);
  //     console.log("check data", JSON.parse(questionByIdDetails.data));
  //     console.log("check data ans :", questionByIdDetails.data.Answers);
  //     {questionByIdDetails &&
  //         questionByIdDetails.data &&
  //         questionByIdDetails.data.Answers &&
  //         isJSONString(questionByIdDetails.data) &&
  //         Array.isArray(JSON.parse(questionByIdDetails.data.Answers)) &&
  //         JSON.parse(questionByIdDetails.data.Answers).map((item, index) => {
  //             // if (item.MasterType !== "Role") return;

  //                 console.log("is OPtimal : ",item.IsOptimalAnswer? 'Yes' : 'No');

  //         })}
  // }, [questionByIdDetails]);

  const onChange = (event) => {
    setQuestionData({
      ...questionData,
      [event.target.name]: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onQuestionChange = (htmlContent) => {
    console.log("Game Intro text ", htmlContent)
    setQuestionData((prevQuestionData) => ({
      ...prevQuestionData,
      question: {
        value: htmlContent,
        error: "",
      },
    }));
  };


  const onDecisionMakerSelect = (event) => {
    console.log("onDecisionMakerSelect ", event.target.value);
    setQuestionData({
      ...questionData,
      decisionMaker: {
        value: event.target.value,
        error: "",
      },
    });
  };

  const onAnswerChange = (event, index, field) => {
    console.log("selcted option : ", event.target.value);
    setQuestionData((prevQuestionData) => {
      const updatedAnswers = [...prevQuestionData.answers];
      updatedAnswers[index][field].value = event.target.value;
      return {
        ...prevQuestionData,
        answers: updatedAnswers,
      };
    });
  };

  const onUpload = useCallback(
    (file) => {
      console.log("onUpload type : ", file.type);
      setQuestionData((prevQUestionData) => ({
        ...prevQUestionData,
        narrativeMedia: {
          value: file,
          error: "",
        },
      }));

      // setSupportFileDisplayURL(file);
    },
    [questionData]
  );

  const onResetFile = useCallback(
    (file) => {
      setQuestionData((prevQUestionData) => ({
        ...prevQUestionData,
        narrativeMedia: {
          value: "",
          error: "",
        },
      }));
      setSupportFileDefaultUrl({
        url: "",
        type: "",
      })
      // setSupportFileDisplayURL(file);
    },
    [questionData]
  );

  // Update Question on submit
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("on submit");
    if (!scenarioID && !questionID) return;

    let valid = true;
    let data = { ...questionData };
    let updatedAnswers = [...questionData.answers];

    // validate the question fields
    if (questionData?.question?.value?.trim() === "") {
      console.log("question:", data.question);
      data = {
        ...data,
        question: {
          ...data.question,
          error: "Please enter question",
        },
      };

      valid = false;
    }

    if (questionData?.decisionMaker?.value?.trim() === "") {
      console.log("decisionMaker:", data.decisionMaker);
      data = {
        ...data,
        question: {
          ...data.decisionMaker,
          error: "Please select Decision Maker",
        },
      };

      // valid = false;
    }

    if (!supportFileDisplayURL &&
      questionData?.narrativeMedia?.value === "") {
      console.log("narrativeMedia:", data.narrativeMedia);
      data = {
        ...data,
        narrativeMedia: {
          ...data.narrativeMedia,
          error: "Please select Narrative Media",
        },
      };

      // valid = false; narrative media is not madatory 
    }

    // Validate each answer in the updatedAnswers array
    updatedAnswers = updatedAnswers.map((answer) => {
      let updatedAnswer = { ...answer };

      // Perform validation checks on each field of the answer object

      if (answer?.option?.value?.trim() === "") {
        updatedAnswer.option.error = "Please enter the answer text.";
        console.log("option:", answer.option);
        valid = false;
      }

      if (answer?.optimal?.value === "") {
        updatedAnswer.optimal.error = "Please select optimal.";
        console.log("optimal:", answer.optimal);
        valid = false;
      }

      if (answer?.score?.value?.trim() === "") {
        updatedAnswer.score.error = "Please enter the score.";
        console.log("score:", answer.score);
        valid = false;
      }

      if (answer?.nextQuestion?.value === "") {
        updatedAnswer.nextQuestion.error = "Please select next question.";
        console.log("nextQuestion:", answer.nextQuestion);
        valid = false;
      }

      if (answer?.consequence?.value?.trim() === "") {
        updatedAnswer.consequence.error = "Please enter the consequence.";
        console.log("consequence:", answer.consequence);
        // valid = false;
      }

      // TODO:: add choose Narrative file | not handled on backend
      // if (answer.narrative.value === "") {
      //     updatedAnswer.narrative.error = "Please choose the narrative file.";
      //     valid = false;
      // }

      return updatedAnswer;
    });

    // Update the answers array in the state with the validated answers
    data = {
      ...data,
      answers: updatedAnswers,
    };

    // TODO:: set the initial state to show errors

    if (valid) {
      let url = supportFIleDefaultUrl.url;
      let fileType = supportFIleDefaultUrl.type;

      if (questionData?.narrativeMedia?.value) {
        console.log("narrative media is uploaded")
        const formData = new FormData();

        formData.append("Module", "Question");
        formData.append("ContentType", questionData.narrativeMedia.value.type);
        formData.append("FormFile", questionData.narrativeMedia.value);
        formData.append("ScenarioID", scenarioID);
        formData.append("Requester.RequestID", generateGUID());
        formData.append("Requester.RequesterID", credentials.data.userID);
        formData.append("Requester.RequesterName", credentials.data.userName);
        formData.append("Requester.RequesterType", credentials.data.role);

        const response = await axios.post(
          `${baseUrl}/api/Storage/FileUpload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("response :", response);
        if (response.data && response.data.success) {
          const serializedData = JSON.parse(response.data.data);

          console.log("upload success");
          url = JSON.parse(serializedData.Data).URL;

          const data = {
            questionID: questionID ? questionID : "",
            scenarioID: scenarioID ? scenarioID : "",
            questionText: questionData?.question?.value,
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
            delegatedTo: questionData?.decisionMaker?.value,
            supportFile: url,
            supportFileType: fileType,
            answersData: questionData.answers.map((answer) => ({
              answerID: answer.answerId.value,
              answerText: answer.option.value,
              isOptimalAnswer: answer.optimal.value,
              answerScore: answer.score.value,
              nextQuestionNo: answer.nextQuestion.value,
              content: answer.consequence.value, // TODO :: consequence for now is null || not implemented in backend
              requester: {
                requestID: generateGUID(),
                requesterID: credentials.data.userID,
                requesterName: credentials.data.userName,
                requesterType: credentials.data.role,
              },
            })),
          };

          console.log("data to update : ", data);
          dispatch(updateQuestion(data));

        } else if (!response.data && !response.data.success) {
          toast.error(response.data.message);
          console.log("upload error");
        } else {
          console.log("error message :", response.data.message);
          toast.error("File upload failed.");
        }
      } else {
        console.log(" no narrative media is uploaded")

        // else no narrative media is uploaded
        const data = {
          questionID: questionID ? questionID : "",
          scenarioID: scenarioID ? scenarioID : "",
          questionText: questionData?.question?.value,
          requester: {
            requestID: generateGUID(),
            requesterID: credentials.data.userID,
            requesterName: credentials.data.userName,
            requesterType: credentials.data.role,
          },
          delegatedTo: questionData?.decisionMaker?.value,
          // supportFile: url, narrative media is not madatory 
          // supportFileType: fileType,
          supportFile: url || "",
          supportFileType: fileType || "",
          answersData: questionData.answers.map((answer) => ({
            answerID: answer.answerId.value,
            answerText: answer.option.value,
            isOptimalAnswer: answer.optimal.value,
            answerScore: answer.score.value,
            nextQuestionNo: answer.nextQuestion.value,
            content: answer.consequence.value, // TODO :: consequence for now is null || not implemented in backend
            requester: {
              requestID: generateGUID(),
              requesterID: credentials.data.userID,
              requesterName: credentials.data.userName,
              requesterType: credentials.data.role,
            },
          })),
        };

        console.log("data to update : ", data);
        dispatch(updateQuestion(data));
      }

    } else {
      toast.error("Please fill all the details.");
    }
  };

  const onCancel = () => {
    if (questionID && scenarioID) {
      setQuestionDetailState();
      navigateTo(`/questions/${scenarioID}`);
      return;
    } else {
      resetQuestionData();
      supportFileDisplayURL(null);
    }

    navigateTo(`/questions/${scenarioID}`);
  };

  return (
    <PageContainer>
      <div
        style={{
          background: 'url("./images/particles-yellow.png") top right no-repeat',
          backgroundSize: '80%',
        }}>
        {/* Top container:: start */}
        <div className={styles.topContainer}>
          <div className={styles.left}>
            <label>Question Builder</label>
          </div>
          <div className={styles.right}>
            <img src="./images/questions1.png" />
          </div>
        </div>
        {/* Top container:: end */}

        {/* Question builder input:: start */}
        <div className={styles.mainContainer}>
          <InputDataContainer
            customRightContainerStyles={{
              transform: "scaleY(-1)",
              backgroundPosition: "bottom right",
            }}
          >
            <div className={styles.mainInputContainer}>
              <div className={styles.questionContainer}>
                <label className={styles.innerLabel}>Question</label>
                <div className={styles.questionInputContainer}>
                  <div className={styles.questionInputLeft}>
                    <div
                      className={styles.question}
                      // style={{ margin: '0' }}
                    >
                      <label
                        className={styles.inputLabel}
                      >
                        Question
                      </label>
                      <RichTextEditor
                        customContaierClass={styles.customRichTextEditorContaierClass}
                        customEditorStyles={styles.customRichTextEditorStyleClass}
                        onChange={onQuestionChange}
                        placeholder="Add question &#128900;"
                        value={questionData.question.value}
                      />
                    </div>

                    {/* <Input
                      label="Question"
                      labelStyle={styles.inputLabel}
                      customStyle={{ margin: "0" }}
                      name={"question"}
                      value={questionData.question.value}
                      placeholder="Add question"
                      textAreaStyleClass={styles.questionTextarea}
                      onChange={onChange}
                      textArea
                    /> */}
                  </div>
                  <div className={styles.questionInputRight}>
                    {/* Decisin Maker :: start */}
                    <div>
                      <label
                        htmlFor="dropdown_decision_maker"
                        className="select_label"
                        style={{ margin: '0' }}
                      >
                        Decision Maker
                      </label>
                      <select
                        id="dropdown_decision_maker"
                        value={questionData.decisionMaker.value}
                        className="select_input"
                        onChange={onDecisionMakerSelect}
                      >
                        <option value={""}>Decision Maker</option>

                        {masters &&
                          masters.data &&
                          isJSONString(masters.data) &&
                          Array.isArray(JSON.parse(masters.data)) &&
                          JSON.parse(masters.data).map((item, index) => {
                            if (item.MasterType !== "Designation") return;
                            return (
                              <option value={item.MasterDisplayName} key={index}>
                                {/* change item.MasterID to 
                                                            MasterDisplayName inorder to
                                                             send the name insed of id to backend */}
                                {item.MasterDisplayName}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    {/* Decisin Maker :: end */}

                    {/* Narrative Media :: start */}
                    <div className={styles.fileDropZone}>
                      <FileDropZone
                        label="Narrative Media"
                        customstyle={{}}
                        customContainerClass={styles.customFileContianer}
                        hint="Eligible Formats: Mp4, Mp3, Image and PDF"
                        customHintClass={styles.hint}
                        allowedFileTypes={allowedFileTypesArray}
                        onUpload={onUpload}
                        onResetFile={onResetFile}
                        fileSrc={supportFileDisplayURL}
                        fileSrcType={
                          supportFileDisplayURL &&
                          extractFileType(supportFileDisplayURL)
                        }
                        setUrl={(file) => {
                          setSupportFileDisplayURL(file);
                        }}
                        fileName={
                          supportFileDisplayURL &&
                          extractFileInfo(supportFileDisplayURL).name
                        }
                      />
                    </div>
                    {/* Narrative Media :: end */}
                  </div>
                  <div className={styles.questionInputEmptyRight}></div>
                </div>
              </div>
              <div className={styles.answersContainer}>
                <label className={styles.innerLabel}>Answers</label>
                <div className={styles.answerInputContainer}>
                  <div className={styles.answerInputLeft}>
                    <div className={styles.answerInputLabels}>
                      <label>Options</label>
                      <label>Optimal</label>
                      <label>Score</label>
                      <label>Next Question</label>
                      <label>Consequence</label>
                      {/* <label>Narrative</label> */}
                    </div>
                    {questionData.answers.map((answer, index) => (
                      <div key={index} className={styles.answerInputFields}>
                        {/* Option :: start */}
                        <div>
                          <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`option-${index}`}
                            value={answer.option.value}
                            onChange={(e) => onAnswerChange(e, index, "option")}
                            // placeholder={`Option ${index + 1}`}
                            placeholder={`Option ${index + 1} \u{2022}`} 
                          />
                        </div>
                        {/* Option :: end */}

                        {/* Optimal :: start */}
                        <div>
                          <div>
                            <select
                              id={`dropdown_optimal-${index}`}
                              value={answer.optimal.value}
                              className="select_input"
                              name={`optimal-${index}`}
                              onChange={(e) =>
                                onAnswerChange(e, index, "optimal")
                              }
                            >
                              {/* <option value={""}>Optimal</option> */}
                              {answer.optimal.value === false ? (
                                <>
                                  <option value={false}>No</option>
                                  <option value={true}>Yes</option>
                                </>
                              ) : (
                                <>
                                  <option value={true}>Yes</option>
                                  <option value={false}>No</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>
                        {/* Optimal :: end  */}

                        {/* Score :: start  */}
                        <div>
                          <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`score-${index}`}
                            value={answer.score.value}
                            onChange={(e) => onAnswerChange(e, index, "score")}
                            placeholder={`Score ${index + 1} \u{2022}`}
                          />
                        </div>
                        {/* Score :: end  */}

                        {/* Next Question :: start  */}
                        <div>
                          <div>
                            <Input
                              labelStyle={styles.inputLabel}
                              customStyle={{}}
                              name={`nextQuestion-${index}`}
                              value={answer.nextQuestion.value}
                              onChange={(e) =>
                                onAnswerChange(e, index, "nextQuestion")
                              }
                              placeholder={`Next Question ${index + 1} \u{2022}`}
                            />
                          </div>
                        </div>
                        {/* Next Question :: end  */}

                        {/* Consequence :: start  */}
                        <div>
                          <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`consequence-${index}`}
                            value={answer?.consequence?.value}
                            onChange={(e) =>
                              onAnswerChange(e, index, "consequence")
                            }
                            placeholder={`Consequence ${index + 1}`}
                          />
                        </div>
                        {/* Consequence :: end  */}

                        {/* Narrative :: start  */}
                        {/* <div className={styles.narrative}>
                          <p>Choose File</p>
                        </div> */}
                        {/* Narrative :: end  */}
                      </div>
                    ))}
                  </div>
                  <div className={styles.answerInputEmptyRight}></div>
                </div>
              </div>
            </div>
          </InputDataContainer>

          {/* Button container:: start */}
          <div className={styles.buttonContainer}>
            <Button buttonType="cancel" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Save</Button>
          </div>
          {/* Button container:: end */}
        </div>
        {/* Question builder input:: end */}
      </div>
    </PageContainer>
  );
}

export default QuestionBuilder;
