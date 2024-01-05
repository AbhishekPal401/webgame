import React from "react";
import styles from "./missioncompleted.module.css";
import Button from "../../../../components/common/button";
import Tree from "react-d3-tree";
import { useCenteredTree } from "../../../../hooks/UseCenteredTree";

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

const orgChart = {
  name: "CEO",
  children: [
    {
      name: "Manager",
      attributes: {
        department: "Production",
      },
      children: [
        {
          name: "Foreman",
          attributes: {
            department: "Fabrication",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
        {
          name: "Foreman",
          attributes: {
            department: "Assembly",
          },
          children: [
            {
              name: "Worker",
            },
          ],
        },
      ],
    },
  ],
};

const data = {
  Name: "First Question",
  Attributes: {
    QuestionNo: 1,
    Isoptimal: false,
    IsQuestion: true,
    ToolTipTitle: "Title1",
    ToolTipDescr: "description",
  },
  Children: [
    {
      Name: "First Answer",
      Attributes: {
        QuestionNo: 2,
        Isoptimal: false,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      Children: [
        {
          Name: "Second Question",
          Attributes: {
            QuestionNo: 2,
            Isoptimal: false,
            IsQuestion: true,
            ToolTipTitle: "Title1",
            ToolTipDescr: "description",
          },
          Children: [],
        },
      ],
    },
    {
      Name: "Second Answer",
      Attributes: {
        QuestionNo: 3,
        Isoptimal: true,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      Children: [
        {
          Name: "Questionww",
          Attributes: {
            QuestionNo: 2,
            Isoptimal: false,
            IsQuestion: true,
            ToolTipTitle: "Title1",
            ToolTipDescr: "description",
          },
          Children: [
            {
              Name: "assdasda",
              Attributes: {
                QuestionNo: 2,
                Isoptimal: false,
                IsQuestion: false,
                ToolTipTitle: "Title1",
                ToolTipDescr: "description",
              },
              Children: [],
            },
          ],
        },
      ],
    },
    {
      Name: "Third Answer",
      Attributes: {
        QuestionNo: 4,
        Isoptimal: true,
        IsQuestion: false,
        ToolTipTitle: "Title1",
        ToolTipDescr: "description",
      },
      Children: [],
    },
  ],
};

const MissionCompleted = () => {
  const [translate, treeContainerRef] = useCenteredTree();

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
            <div ref={treeContainerRef}>
              <Tree
                translate={translate}
                data={orgChart}
                orientation="vertical"
              />
            </div>
            <div className={styles.right}>
              <div>Time Spent</div>
              <div>
                23 <span>min</span>
              </div>
              <div>Score</div>
              <div>128</div>
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
