import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./missioncompleted.module.css";
import Button from "../../../../components/common/button";
import OptimalTree from "../../../../components/trees/mission";
import {
  getInstanceSummaryById,
  resetInstanceSummaryByIDState,
} from "../../../../store/app/admin/gameinstances/instanceSummary";
import {
  getInstanceProgressyById,
  resetInstanceProgressByIDState,
} from "../../../../store/app/admin/gameinstances/getInstanceProgress";
import { useDispatch, useSelector } from "react-redux";
import { generateGUID } from "../../../../utils/common";
import SelectedTree from "../../../../components/trees/selectedTree";
import { signalRService } from "../../../../services/signalR";
import { resetNextQuestionDetailsState } from "../../../../store/app/user/questions/getNextQuestion";
import { resetAnswerDetailsState } from "../../../../store/app/user/answers/postAnswer";
import { resetSessionDetailsState } from "../../../../store/app/user/session/getSession";
import { toPng, toSvg } from "html-to-image";
import { convertSecondsToHMS, formatTime } from "../../../../utils/helper";
import {
  getReport,
  resetReportState,
} from "../../../../store/app/admin/report/getReport";
import Progress from "../../../../components/progress";
import QuestionLoader from "../../../../components/loader/questionLoader";
import {
  postImage,
  resetpostImageState,
} from "../../../../store/app/admin/report/postImages";
import { resetFileStreamState } from "../../../../store/app/admin/fileStream/getFileStream";

const SelectTree = ({ clicked = 1, onSelect = () => {} }) => {
  return (
    <div className={styles.selectTree}>
      <div className={styles.selectButtonContainer}>
        <div
          className={clicked === 0 ? styles.selected : ""}
          onClick={() => {
            onSelect(0);
          }}
        >
          Selected
        </div>
        {/* <div
          className={clicked === 1 ? styles.selected : ""}
          onClick={() => {
            onSelect(1);
          }}
        >
          Optimal
        </div> */}
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

const getFullTreeNode = (node) => {
  let duplicate = node.cloneNode(true);
  console.log("duplicate", duplicate);

  console.log("children", duplicate.children);
};

const downloadPDF = (pdf, name = "report") => {
  // console.log("pdf", pdf);
  // console.log("name", name);

  const linkSource = `data:application/pdf;base64,${pdf}`;
  const downloadLink = document.createElement("a");
  const fileName = `${name}.pdf`;
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
};

const MissionCompleted = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);

  const { instanceSummary, loading: instanceinstanceSummary } = useSelector(
    (state) => state.instanceSummary
  );
  const { instanceProgress, loading: instanceProgressLoading } = useSelector(
    (state) => state.getInstanceProgress
  );

  const { reportData, loading: reportLoading } = useSelector(
    (state) => state.getReport
  );

  const { progressImage } = useSelector((state) => state.gameplay);

  const { postImageResponse } = useSelector((state) => state.postImages);

  // console.log("instanceSummary", instanceSummary);
  // console.log("postImageResponse", postImageResponse);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(resetNextQuestionDetailsState());

    setTimeout(() => {
      const sessionData = JSON.parse(sessionDetails.data);

      if (sessionData && credentials) {
        var node = document.getElementById("progressmeter");

        if (node) {
          toPng(node, {
            filter: (node) => {
              return node.tagName !== "i";
            },
          })
            .then(function (dataUrl) {
              // var link = document.createElement("a");
              // link.download = "progressmeter.png";
              // link.href = dataUrl;
              // link.click();

              console.log("dataUrl", dataUrl);

              if (dataUrl.includes("image/png")) {
                const data = {
                  instanceID: sessionData.InstanceID,
                  scoreMeterImage: dataUrl,
                  treeImage: "",
                  progressBarImage: "",

                  requester: {
                    requestID: generateGUID(),
                    requesterID: credentials.data.userID,
                    requesterName: credentials.data.userName,
                    requesterType: credentials.data.role,
                  },
                };

                console.log("upload speedometer data", data);

                dispatch(postImage(data));
              }
            })
            .catch(function (error) {});
        }
      }
    }, 1000);

    return () => {
      dispatch(resetInstanceSummaryByIDState());
      dispatch(resetInstanceProgressByIDState());
    };
  }, [sessionDetails, credentials]);

  useEffect(() => {
    if (postImageResponse?.success) {
      dispatch(resetpostImageState());
    }
  }, [postImageResponse]);

  useEffect(() => {
    dispatch(resetFileStreamState());

    const sessionData = JSON.parse(sessionDetails.data);

    if (sessionData && credentials) {
      const data = {
        instanceID: sessionData.InstanceID,
        userID: credentials.data.userID,
        isAdmin: true,
        requester: {
          requestID: generateGUID(),
          requesterID: credentials.data.userID,
          requesterName: credentials.data.userName,
          requesterType: credentials.data.role,
        },
      };
      dispatch(resetInstanceSummaryByIDState());
      dispatch(resetInstanceProgressByIDState());
      dispatch(getInstanceProgressyById(data));
      dispatch(getInstanceSummaryById(data));
    }
  }, []);

  const resetAll = useCallback(() => {
    dispatch(resetNextQuestionDetailsState());
    dispatch(resetAnswerDetailsState());
    dispatch(resetSessionDetailsState());
    navigate("/");
  }, []);

  const missionCompleted = useCallback(() => {
    if (sessionDetails?.data) {
      const sessionData = JSON.parse(sessionDetails.data);

      resetAll();

      signalRService.MissionCompletedInvoke(sessionData.InstanceID);
    }
  }, [sessionDetails]);

  useEffect(() => {
    if (reportData && reportData.success) {
      if (reportData?.data?.Report) {
        const name = instanceSummary?.data?.GameInstance
          ? instanceSummary?.data?.GameInstance
          : "report";
        downloadPDF(reportData?.data?.Report, name);
      }
      dispatch(resetReportState());
    }
  }, [reportData, instanceSummary]);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/user_background.png")' }}
    >
      <div className={styles.missionContainer}>
        {instanceinstanceSummary || instanceProgressLoading ? (
          <QuestionLoader size={120} />
        ) : (
          <div className={styles.innerCotainer}>
            <div
              className={styles.header}
              style={{ backgroundImage: 'url("/images/particles2.png")' }}
            >
              <div>Mission Accomplished!</div>
              <div>
                Thank You For Taking Part In This Game, We Hope You Have Enjoyed
                It. Here's A Summary Of How You Did.
              </div>
              <div className={styles.details_row}>
                <div>
                  {instanceSummary?.data?.GameInstance
                    ? instanceSummary?.data?.GameInstance
                    : ""}
                </div>
                <div>
                  {instanceSummary?.data?.OrganizationName
                    ? instanceSummary?.data?.OrganizationName
                    : ""}
                </div>
                <div>
                  {instanceSummary?.data?.GameScenario
                    ? instanceSummary?.data?.GameScenario
                    : ""}
                </div>
              </div>
            </div>
            <div className={styles.treeContainer}>
              <SelectTree
                clicked={currentTab}
                onSelect={(value) => {
                  setCurrentTab(value);
                }}
              />
              <div className={styles.tree}>
                {instanceProgress &&
                  instanceProgress.data &&
                  instanceProgress.data.Summary && (
                    <SelectedTree
                      data={instanceProgress.data.Summary}
                      userType="admin"
                    />
                  )}
                <div className={styles.right}>
                  <div>Time Spent</div>
                  <div className={styles.circle}>
                    <div>
                      {instanceSummary?.data?.TimeTaken
                        ? convertSecondsToHMS(instanceSummary?.data?.TimeTaken)
                        : ""}{" "}
                    </div>
                    {/* <span>min</span> */}
                  </div>
                  <Progress
                    progress={
                      instanceSummary?.data?.ScorePercentage
                        ? Number(instanceSummary?.data?.ScorePercentage)
                        : 0
                    }
                    scoreMaster={
                      instanceSummary?.data?.ScoreMaster
                        ? instanceSummary?.data?.ScoreMaster
                        : []
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <Button
                customClassName={styles.export}
                onClick={() => {
                  const sessionData = JSON.parse(sessionDetails.data);

                  if (sessionData && credentials) {
                    var node = document.getElementById("progressmeter");

                    if (node) {
                      toPng(node, {
                        filter: (node) => {
                          return node.tagName !== "i";
                        },
                      })
                        .then(function (dataUrl) {
                          // var link = document.createElement("a");
                          // link.download = "progressmeter.png";
                          // link.href = dataUrl;
                          // link.click();

                          console.log("dataUrl", dataUrl);

                          if (dataUrl.includes("image/png")) {
                            const data = {
                              instanceID: sessionData.InstanceID,
                              scoreMeterImage: dataUrl,
                              treeImage: "",
                              progressBarImage: "",

                              requester: {
                                requestID: generateGUID(),
                                requesterID: credentials.data.userID,
                                requesterName: credentials.data.userName,
                                requesterType: credentials.data.role,
                              },
                            };

                            console.log("upload speedometer data", data);

                            dispatch(postImage(data));

                            var node =
                              document.getElementsByClassName("rd3t-svg");
                            if (node[0]) {
                              toPng(node[0], {
                                filter: (node) => {
                                  return node.tagName !== "i";
                                },
                              })
                                .then(function (dataUrl) {
                                  const sessionData = JSON.parse(
                                    sessionDetails.data
                                  );

                                  const data = {
                                    instanceID: sessionData.InstanceID,
                                    scoreImage: "",
                                    treeImage: dataUrl,
                                    requester: {
                                      requestID: generateGUID(),
                                      requesterID: credentials.data.userID,
                                      requesterName: credentials.data.userName,
                                      requesterType: credentials.data.role,
                                    },
                                  };

                                  // var link = document.createElement("a");
                                  // link.download = "tree.png";
                                  // link.href = dataUrl;
                                  // link.click();

                                  // var link = document.createElement("a");
                                  // link.download = "progress.png";
                                  // link.href = progressImage;
                                  // link.click();

                                  console.log("Download data", data);

                                  dispatch(getReport(data));
                                })
                                .catch(function (error) {
                                  console.error(
                                    "oops, something went wrong!",
                                    error
                                  );
                                });
                            }
                          }
                        })
                        .catch(function (error) {});
                    }
                  }
                }}
              >
                {reportLoading ? "Downloading.." : "Export"}
              </Button>
              <Button customClassName={styles.end} onClick={missionCompleted}>
                End
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionCompleted;
