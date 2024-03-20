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
import RichTextEditor from "../../../../../components/common/textEditor";
import Dropdown from "../../../../../components/common/dropdown";
import CustomInput from "../../../../../components/common/customInput";

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
  // const [supportFileDisplayURL, setSupportFileDisplayURL] = useState(null);
  const [supportFileDisplayURL, setSupportFileDisplayURL] = useState({
    url: null,
    type: null,
    name: null,
  });


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
        // setSupportFileDisplayURL(null);
        setSupportFileDisplayURL({
          url: null,
          type: null,
          name: null,
        });
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
      // setSupportFileDisplayURL(null);
      setSupportFileDisplayURL({
        url: null,
        type: null,
        name: null,
      });
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
  const setQuestionDetailState = useCallback(async () => {
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
          // isOptimal: {
          //   // value: [answer.IsOptimalAnswer, !answer.IsOptimalAnswer],
          //   value: {
          //     value: answer.IsOptimalAnswer,
          //     label: answer.IsOptimalAnswer ? "Yes" : "No",
          //   },
          //   error: "",
          // },
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
      // console.log("SupportFileDisplay:", data.Question.SupportFileDisplay);
      // setSupportFileDisplayURL(data.Question.SupportFileDisplay);
      setSupportFileDefaultUrl((previous) => ({
        ...previous,
        url: data.Question.SupportFile,
        type: data.Question.SupportFileType,
      }));
      console.log("newData to set : ", newData);
      setQuestionData(newData);

      // call the stream api to get the tram for the default url
      if (data.Question.SupportFile) {
        try {
          // Define the body parameters
          const requestBody = {
            fileName: data.Question.SupportFile,
            module: "Question"
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
            console.log("responce  :",)
            const fileStream = response.data;

            // Generate URL for the file stream
            const fileUrl = URL.createObjectURL(new Blob([fileStream]));
            console.log("fileUrl  :", fileUrl)
            // Set the intro file display URL
            // setIntroFileDisplay(fileUrl);
            setSupportFileDisplayURL((previousState) => ({
              ...previousState,
              url: fileUrl,
              type: extractFileType(data.Question.SupportFile),
              name: extractFileInfo(data.Question.SupportFile).name,
            }));

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
  }, [questionByIdDetails]);

  useEffect(() => {
    if (questionByIdDetails === null || questionByIdDetails === undefined)
      return;

    if (!scenarioID && !questionID) return;

    setQuestionDetailState();
    console.log("questionByIdDetails :", questionByIdDetails);

    return () => {
      // Cleanup function
      source.cancel("Request canceled by cleanup");
    };
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

  const onSelectDecisionMaker = (value) => {
    console.log("onDecisionMakerSelect ", value);
    setQuestionData({
      ...questionData,
      decisionMaker: {
        value: value,
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

  const onChangeAnswer = (value, index, field) => {
    console.log("selcted option : ", value);
    setQuestionData((prevQuestionData) => {
      const updatedAnswers = [...prevQuestionData.answers];
      updatedAnswers[index][field].value = value;
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

    let isEmpty = false;
    let valid = true;
    let data = { ...questionData };
    let updatedAnswers = [...questionData.answers];
    let answerError = false;
    let scoreError = false;
    let nextQuestionError = false;
    let consequenceError = false;

    // validate the question fields
    if (
      questionData?.question?.value?.trim() === "" ||
      questionData.question.value.replace(/<\/?[^>]+(>|$)/g, "").trim() === ""
    ) {
      console.log("question:", data.question);
      data = {
        ...data,
        question: {
          ...data.question,
          error: "Please enter question",
        },
      };
      isEmpty = true;
      valid = false;
    } else if (questionData?.question?.value !== questionData?.question?.value?.trim()) {
      console.log("question:", data.question);
      data = {
        ...data,
        question: {
          ...data.question,
          error: "Please enter a valid question",
        },
      };
      valid = false;
    }


    if (questionData?.decisionMaker?.value?.trim() === "") {
      console.log("decisionMaker:", data.decisionMaker);
      // data = {
      //   ...data,
      //   question: {
      //     ...data.decisionMaker,
      //     error: "Please select Decision Maker",
      //   },
      // };

      // valid = false;
    }

    if (!supportFileDisplayURL &&
      questionData?.narrativeMedia?.value === "") {
      // console.log("narrativeMedia:", data.narrativeMedia);
      // data = {
      //   ...data,
      //   narrativeMedia: {
      //     ...data.narrativeMedia,
      //     error: "Please select Narrative Media",
      //   },
      // };

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
        isEmpty = true;

      } else if (answer?.option?.value !== answer?.option?.value?.trim()) {
        updatedAnswer.option.error = "Please enter the valid answer text.";
        console.log("option:", answer.option);
        valid = false;
        // toast.error("Please enter the valid answer text.");
        answerError = true;
      }

      if (answer?.optimal?.value === "") {
        updatedAnswer.optimal.error = "Please select optimal.";
        console.log("optimal:", answer.optimal);
        valid = false;
        isEmpty = true;

      }

      if (answer?.score?.value?.trim() === "") {
        updatedAnswer.score.error = "Please enter the score.";
        console.log("score:", answer.score);
        valid = false;
        isEmpty = true;

      } else if (!/^\d+$/.test(answer.score.value)) {
        updatedAnswer.score.error = "Score should only contain numeric characters.";
        console.log("score:", answer.score);
        valid = false;
        // toast.error("Score should only contain numeric characters without any spaces.");
        scoreError = true;
      }

      if (answer?.nextQuestion?.value === "") {
        updatedAnswer.nextQuestion.error = "Please select next question.";
        console.log("nextQuestion:", answer.nextQuestion);
        valid = false;
        isEmpty = true;

      } else if (!/^\d+$/.test(answer.nextQuestion.value)) {
        updatedAnswer.nextQuestion.error = "Next question should only contain numeric characters.";
        console.log("nextQuestion:", answer.nextQuestion);
        valid = false;
        // toast.error("Next question should only contain numeric characters without any spaces.");
        nextQuestionError = true;
      }

      if (answer?.consequence?.value?.trim() === "") {
        updatedAnswer.consequence.error = "Please enter the consequence.";
        console.log("consequence:", answer.consequence);
        // valid = false;
      } else if (
        /\d/.test(answer.consequence.value) ||
        answer?.consequence?.value !== answer?.consequence?.value?.trim()
      ) {
        updatedAnswer.consequence.error = "Consequence should not contain numeric characters.";
        console.log("consequence:", answer.consequence);
        valid = false;
        // toast.error("Consequence should only contain alphabets.");
        consequenceError = true;
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

    setQuestionData(data);

    // TODO:: set the initial state to show errors
    if (!isEmpty) {

      // Display generic error message if any error occurred in each column
      // if (answerError) {
      //   toast.error("Please enter the valid answer.");
      // }
      // if (scoreError) {
      //   toast.error("Please enter valid score.");
      // }

      // if (nextQuestionError) {
      //   toast.error("Please select valid next question.");
      // }

      // if (consequenceError) {
      //   toast.error("Please enter valid consequence.");
      // }

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
                Authorization: `Bearer ${credentials.data.token}`,
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

      }
    } else {
      // toast.error("Please fill all the mandatory details.");
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
                      {/* <RichTextEditor
                        customContaierClass={styles.customRichTextEditorContaierClass}
                        customEditorStyles={styles.customRichTextEditorStyleClass}
                        onChange={onQuestionChange}
                        placeholder="Add question &#128900;"
                        value={questionData.question.value}
                      /> */}
                      <RichTextEditor
                        sampleConfig={sampleConfig}
                        title="Add question"
                        data={questionData.question.value}
                        customContaierClass={styles.customRichTextEditorContaierClass}
                        customEditorStyleClass={styles.customEditorStyleClass}
                        onChange={(event, value, htmlContent) => {
                          onQuestionChange(htmlContent);
                        }}
                        required
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
                    {/* <div>
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
                      value={questionData.decisionMaker.value}
                      valueKey="MasterDisplayName"
                      labelKey="MasterDisplayName"
                      placeholder="Decision Maker"
                      label={"Decision Maker"}
                      labelStyle={styles.inputLabel}
                      selecttStyleClass={styles.selecttStyleClass}
                      customContainerClass={styles.customDropDownContainerClass}
                      onSelect={(value) => { onSelectDecisionMaker(value) }}
                      error={questionData.decisionMaker.error}
                      errorNode={(
                        <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                          {questionData.decisionMaker.error}
                        </div>
                      )}
                      required
                    />
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
                        fileSrc={supportFileDisplayURL.url}
                        setUrl={(file) => {
                          // setSupportFileDisplayURL(file);
                          setSupportFileDisplayURL({
                            url: file,
                            type: file && extractFileType(file),
                            name: file && extractFileInfo(file).name,
                          });
                        }}
                        // fileSrcType={
                        //   supportFileDisplayURL &&
                        //   extractFileType(supportFileDisplayURL)
                        // }
                        // fileName={
                        //   supportFileDisplayURL &&
                        //   extractFileInfo(supportFileDisplayURL).name
                        // }
                        fileSrcType={
                          (supportFileDisplayURL) ?
                            supportFileDisplayURL.type : ""
                        }
                        fileName={
                          (supportFileDisplayURL) ?
                            supportFileDisplayURL.name : ""
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
                      <label></label>
                      {/* <label>Narrative</label> */}
                    </div>
                    {questionData.answers.map((answer, index) => (
                      <div key={index} className={styles.answerInputFields}>
                        {/* Option :: start */}
                        <div>
                          {/* <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`option-${index}`}
                            value={answer.option.value}
                            onChange={(e) => onAnswerChange(e, index, "option")}
                            // placeholder={`Option ${index + 1}`}
                            placeholder={`Option ${index + 1} \u{2022}`}
                          /> */}

                          <CustomInput
                            type="text"
                            value={answer.option.value}
                            // customStyle={{ margin: '0' }}
                            // customInputStyles={{ height: "auto" }}
                            // inputStyleClass={styles.customInputStylesClass}
                            customLabelStyle={{ display: "none" }}
                            name={`option-${index}`}
                            title={`Option ${index + 1}`}
                            onChange={(value, e) => onChangeAnswer(value, index, "option")}
                            required
                            error={answer.option.error}
                            errorNode={(
                              <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                                {answer.option.error}
                              </div>
                            )}
                            maxLength={500}

                          />
                        </div>
                        {/* Option :: end */}

                        {/* Optimal :: start */}
                        <div>
                          {/* <div>
                            <select
                              id={`dropdown_optimal-${index}`}
                              value={answer.optimal.value}
                              className="select_input"
                              name={`optimal-${index}`}
                              onChange={(e) =>
                                onAnswerChange(e, index, "optimal")
                              }
                            >
                              <option value={""}>Optimal</option> 
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
                          </div> */}

                          <Dropdown
                            data={
                              answer.optimal.value === false ? (
                                [
                                  { value: false, label: 'No' },
                                  { value: true, label: 'Yes' }
                                ]
                              ) : (
                                [
                                  { value: true, label: 'Yes' },
                                  { value: false, label: 'No' },
                                ]
                              )
                            }
                            value={answer.optimal.value}
                            valueKey="value"
                            labelKey="label"
                            placeholder="Optimal"
                            onSelect={(value, e) => onChangeAnswer(value, index, "optimal")}
                            error={answer.optimal.error}
                            errorNode={(
                              <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                                {answer.optimal.error}
                              </div>
                            )}
                            required
                          />
                        </div>
                        {/* Optimal :: end  */}

                        {/* Score :: start  */}
                        <div>
                          {/* <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`score-${index}`}
                            value={answer.score.value}
                            onChange={(e) => onAnswerChange(e, index, "score")}
                            placeholder={`Score ${index + 1} \u{2022}`}
                          /> */}
                          <CustomInput
                            type="text"
                            value={answer.score.value}
                            // customStyle={{ margin: '0' }}
                            // customInputStyles={{ height: "auto" }}
                            // inputStyleClass={styles.customInputStylesClass}
                            customLabelStyle={{ display: "none" }}
                            name={`score-${index}`}
                            title={`Score ${index + 1}`}
                            onChange={(value, e) => onChangeAnswer(value, index, "score")}
                            required
                            error={answer.score.error}
                            errorNode={(
                              <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                                {answer.score.error}
                              </div>
                            )}
                          />
                        </div>
                        {/* Score :: end  */}

                        {/* Next Question :: start  */}
                        <div>
                          <div>
                            {/* <Input
                              labelStyle={styles.inputLabel}
                              customStyle={{}}
                              name={`nextQuestion-${index}`}
                              value={answer.nextQuestion.value}
                              onChange={(e) =>
                                onAnswerChange(e, index, "nextQuestion")
                              }
                              placeholder={`Next Question ${index + 1} \u{2022}`}
                            /> */}
                            <CustomInput
                              type="text"
                              value={answer.nextQuestion.value}
                              // customStyle={{ margin: '0' }}
                              // customInputStyles={{ height: "auto" }}
                              // inputStyleClass={styles.customInputStylesClass}
                              customLabelStyle={{ display: "none" }}
                              name={`nextQuestion-${index}`}
                              title={`Next Question ${index + 1}`}
                              onChange={(value, e) => onChangeAnswer(value, index, "nextQuestion")}
                              required
                              error={answer.nextQuestion.error}
                              errorNode={(
                                <div id="errormessage" aria-live="polite" className="ap-field-email-validation-error">
                                  {answer.nextQuestion.error}
                                </div>
                              )}
                            />
                          </div>
                        </div>
                        {/* Next Question :: end  */}

                        {/* Consequence :: start  */}
                        <div>
                          {/* <Input
                            labelStyle={styles.inputLabel}
                            customStyle={{}}
                            name={`consequence-${index}`}
                            value={answer?.consequence?.value}
                            onChange={(e) =>
                              onAnswerChange(e, index, "consequence")
                            }
                            placeholder={`Consequence ${index + 1}`}
                          /> */}
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
