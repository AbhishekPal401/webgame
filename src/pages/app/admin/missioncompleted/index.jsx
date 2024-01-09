import React, { useEffect, useState } from "react";
import styles from "./missioncompleted.module.css";
import Button from "../../../../components/common/button";
import MissionTree from "../../../../components/trees/mission";
import { getInstanceSummaryById } from "../../../../store/app/admin/gameinstances/instanceSummary";
import { useDispatch, useSelector } from "react-redux";
import { generateGUID } from "../../../../utils/common";

const SelectTree = ({ clicked = 0, onSelect = () => {} }) => {
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
        <div
          className={clicked === 1 ? styles.selected : ""}
          onClick={() => {
            onSelect(1);
          }}
        >
          Optimal
        </div>
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

const data = {
  name: "First Question awdwawda dawd aw daw dawd aw dawdawda daw dawd ad ad awdaw da  awdawd awd awd awd aw ad aw dawd aw dawd awd awd awda d wd  ad awd ad rrrr rrrr rrrrr rrrrr rr rrr rrr",
  attributes: {
    QuestionNo: 1,
    Isoptimal: false,
    IsQuestion: true,
    ToolTipTitle: "Title1",
    ToolTipDescr: "description",
  },
  children: [
    {
      name: "First Answer",
      attributes: {
        QuestionNo: 2,
        Isoptimal: false,
        IsQuestion: false,
        ToolTipTitle: "Title1 adwa ",
        ToolTipDescr: "description adw a",
      },
      children: [],
    },
    {
      name: "Second Answer",
      attributes: {
        QuestionNo: 3,
        Isoptimal: true,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      children: [
        {
          name: "This is the second question for the table top",
          attributes: {
            QuestionNo: 2,
            Isoptimal: false,
            IsQuestion: true,
            ToolTipTitle: "Title1",
            ToolTipDescr: "description",
          },
          children: [
            {
              name: "assdasda",
              attributes: {
                QuestionNo: 2,
                Isoptimal: false,
                IsQuestion: false,
                ToolTipTitle: "Title1",
                ToolTipDescr: "description",
              },
              children: [],
            },
            {
              name: "lrem ipsum ad a asda  awd",
              attributes: {
                QuestionNo: 2,
                Isoptimal: false,
                IsQuestion: false,
                ToolTipTitle: "Title1",
                ToolTipDescr: "description",
              },
              children: [],
            },
            {
              name: "third option for assdasda",
              attributes: {
                QuestionNo: 2,
                Isoptimal: true,
                IsQuestion: false,
                ToolTipTitle: "Title1",
                ToolTipDescr: "description",
              },
              children: [
                {
                  name: "third Question for ada  lorem ispsum ",
                  attributes: {
                    QuestionNo: 2,
                    Isoptimal: false,
                    IsQuestion: true,
                    ToolTipTitle: "Title1",
                    ToolTipDescr: "description",
                  },
                  children: [
                    {
                      name: "First Option",
                      attributes: {
                        QuestionNo: 2,
                        Isoptimal: true,
                        IsQuestion: false,
                        ToolTipTitle: "Title1",
                        ToolTipDescr: "description",
                      },
                      children: [],
                    },
                    {
                      name: "Second Option",
                      attributes: {
                        QuestionNo: 2,
                        Isoptimal: false,
                        IsQuestion: false,
                        ToolTipTitle: "Title1",
                        ToolTipDescr: "description",
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              name: "fourth option for assdasda",
              attributes: {
                QuestionNo: 2,
                Isoptimal: false,
                IsQuestion: false,
                ToolTipTitle: "Title1",
                ToolTipDescr: "description",
              },
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "Third Answer",
      attributes: {
        QuestionNo: 4,
        Isoptimal: false,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      children: [],
    },
    {
      name: "fourth Answer",
      attributes: {
        QuestionNo: 4,
        Isoptimal: false,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      children: [],
    },
  ],
};

const data2 = {
  name: "Q1",
  attributes: {
    questionNo: 0,
    isOptimal: false,
    isAdminOptimal: false,
    isQuestion: true,
    toolTipTitle: null,
    toolTipDescr: null,
  },
  children: [
    {
      name: "3Ans",
      attributes: {
        questionNo: 0,
        isOptimal: false,
        isAdminOptimal: false,
        isQuestion: false,
        toolTipTitle: null,
        toolTipDescr: null,
      },
      children: [],
    },
    {
      name: "1 Ans",
      attributes: {
        questionNo: 0,
        isOptimal: true,
        isAdminOptimal: false,
        isQuestion: false,
        toolTipTitle: null,
        toolTipDescr: null,
      },
      children: [
        {
          name: "Q2",
          attributes: {
            questionNo: 0,
            isOptimal: false,
            isAdminOptimal: false,
            isQuestion: true,
            toolTipTitle: null,
            toolTipDescr: null,
          },
          children: [
            {
              name: "5Ans",
              attributes: {
                questionNo: 0,
                isOptimal: false,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [],
            },
            {
              name: "6Ans",
              attributes: {
                questionNo: 0,
                isOptimal: false,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [],
            },
            {
              name: "4Ans",
              attributes: {
                questionNo: 0,
                isOptimal: true,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [
                {
                  name: "Q3",
                  attributes: {
                    questionNo: 0,
                    isOptimal: false,
                    isAdminOptimal: false,
                    isQuestion: true,
                    toolTipTitle: null,
                    toolTipDescr: null,
                  },
                  children: [
                    {
                      name: "8Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: false,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [],
                    },
                    {
                      name: "9Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: false,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [],
                    },
                    {
                      name: "7Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: true,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [
                        {
                          name: "Q4",
                          attributes: {
                            questionNo: 0,
                            isOptimal: false,
                            isAdminOptimal: false,
                            isQuestion: true,
                            toolTipTitle: null,
                            toolTipDescr: null,
                          },
                          children: [
                            {
                              name: "11Ans",
                              attributes: {
                                questionNo: 0,
                                isOptimal: false,
                                isAdminOptimal: false,
                                isQuestion: false,
                                toolTipTitle: null,
                                toolTipDescr: null,
                              },
                              children: [],
                            },
                            {
                              name: "10Ans",
                              attributes: {
                                questionNo: 0,
                                isOptimal: true,
                                isAdminOptimal: false,
                                isQuestion: false,
                                toolTipTitle: null,
                                toolTipDescr: null,
                              },
                              children: [],
                            },
                            {
                              name: "12Ans",
                              attributes: {
                                questionNo: 0,
                                isOptimal: false,
                                isAdminOptimal: false,
                                isQuestion: false,
                                toolTipTitle: null,
                                toolTipDescr: null,
                              },
                              children: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "2Ans",
      attributes: {
        questionNo: 0,
        isOptimal: false,
        isAdminOptimal: false,
        isQuestion: false,
        toolTipTitle: null,
        toolTipDescr: null,
      },
      children: [
        {
          name: "Q5",
          attributes: {
            questionNo: 0,
            isOptimal: false,
            isAdminOptimal: false,
            isQuestion: true,
            toolTipTitle: null,
            toolTipDescr: null,
          },
          children: [
            {
              name: "13Ans",
              attributes: {
                questionNo: 0,
                isOptimal: false,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [],
            },
            {
              name: "15Ans",
              attributes: {
                questionNo: 0,
                isOptimal: false,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [],
            },
            {
              name: "14Ans",
              attributes: {
                questionNo: 0,
                isOptimal: false,
                isAdminOptimal: false,
                isQuestion: false,
                toolTipTitle: null,
                toolTipDescr: null,
              },
              children: [
                {
                  name: "Q6",
                  attributes: {
                    questionNo: 0,
                    isOptimal: false,
                    isAdminOptimal: false,
                    isQuestion: true,
                    toolTipTitle: null,
                    toolTipDescr: null,
                  },
                  children: [
                    {
                      name: "17Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: false,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [],
                    },
                    {
                      name: "16Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: false,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [],
                    },
                    {
                      name: "18Ans",
                      attributes: {
                        questionNo: 0,
                        isOptimal: false,
                        isAdminOptimal: false,
                        isQuestion: false,
                        toolTipTitle: null,
                        toolTipDescr: null,
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const MissionCompleted = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const { sessionDetails } = useSelector((state) => state.getSession);
  const { credentials } = useSelector((state) => state.login);
  const { instanceSummary } = useSelector((state) => state.instanceSummary);

  console.log("instanceSummary", instanceSummary);

  const dispatch = useDispatch();

  useEffect(() => {
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

      dispatch(getInstanceSummaryById(data));
    }
  }, []);

  return (
    <div
      className={styles.container}
      style={{ backgroundImage: 'url("/images/user_background.png")' }}
    >
      <div className={styles.missionContainer}>
        <div
          className={styles.header}
          style={{ backgroundImage: 'url("/images/particles2.png")' }}
        >
          <div>Mission Accomplished!</div>
          <div>
            Thank You For Taking Part In This Game, We Hope You Have Enjoyed It.
            Here's A Summary Of How You Did.
          </div>
          <div>
            Player Name <span>CTO</span>
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
            {instanceSummary && instanceSummary.data && (
              <>
                {currentTab === 0 ? (
                  <MissionTree data={instanceSummary.data} />
                ) : (
                  <MissionTree data={instanceSummary.data} />
                )}
              </>
            )}
            <div className={styles.right}>
              <div>Time Spent</div>
              <div className={styles.circle}>
                23 <span>min</span>
              </div>
              <div>Score</div>
              <div className={styles.circle}>128</div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <Button customClassName={styles.export}>Export</Button>
          <Button customClassName={styles.end}>End</Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCompleted;
