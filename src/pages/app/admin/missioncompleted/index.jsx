import React from "react";
import styles from "./missioncompleted.module.css";
import Button from "../../../../components/common/button";
import MissionTree from "../../../../components/trees/mission";

const SelectTree = ({ clicked = 0 }) => {
  return (
    <div className={styles.selectTree}>
      <div className={styles.selectButtonContainer}>
        <div className={clicked === 0 ? styles.selected : ""}>Selected</div>
        <div className={clicked === 1 ? styles.selected : ""}>Optimal</div>
      </div>
      <div className={styles.line}></div>
    </div>
  );
};

const data = {
  name: "First Question awdwawda dawd aw daw dawd aw dawdawda daw dawd ad ad awdaw da  awdawd awd awd awd aw",
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
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
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
          name: "Questionww",
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
                Isoptimal: true,
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
  ],
};

const MissionCompleted = () => {
  return (
    <div className={styles.container}>
      <div className={styles.missionContainer}>
        <div className={styles.header}>
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
          <SelectTree clicked={1} />
          <div className={styles.tree}>
            <MissionTree data={data} />
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
