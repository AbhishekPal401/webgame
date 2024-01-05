import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PageContainer from "../../../../../components/ui/pagecontainer";
import styles from "./questionlist.module.css";
import Button from "../../../../../components/common/button";
import Checkbox from "../../../../../components/ui/checkbox";
import { useParams } from "react-router-dom";
import { getQuestionsByScenarioId } from "../../../../../store/app/admin/questions/getQuestionsByScenarioId.js";
import { useNavigate } from "react-router-dom";


function QuestionList() {

    const dispatch = useDispatch();

    const { credentials } = useSelector((state) => state.login);
    const { questionsByScenarioIdDetails } = useSelector((state) => state.getQuestionsByScenarioId);

    const { scenarioID } = useParams();
    const navigate = useNavigate();

    console.log("scenarioID", scenarioID);


    useEffect(() => {
        if (credentials) {
            const data = {
                scenarioID: scenarioID,
            };

            dispatch(getQuestionsByScenarioId(data));
        }
    }, []);

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
                                buttonType="cancel"
                            >
                                Upload Questions
                            </Button>
                            <Button >Download Template</Button>
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
                                                    <td
                                                        className={styles.questions}
                                                        onClick={() => {
                                                            navigate(`/questions/${scenarioID}/questionbuilder/${question.QuestionID}`);
                                                          }}
                                                    >
                                                        {question.QuestionText}
                                                    </td>
                                                    <td
                                                        className={styles.scenarioDescription}

                                                    >
                                                        Levels{/* TODO :: get levels */}
                                                    </td>
                                                    <td>{question.Answers}</td>
                                                    <td>{question.DelegatedTo}</td>
                                                    <td>{question.NarativeMedia}</td>
                                                    <td></td>
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