'use client'

import React, { useState, useEffect } from 'react';
import { get } from '../../services/HttpService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';


interface Answer {
    id: number;
    questionId: number;
    text: string;
    isCorrect: boolean;
}

interface SingleSelectAnswerProps {
    givenAnswer?: any;
    questionId: number;
}

const SingleSelectAnswer: React.FC<SingleSelectAnswerProps> = ({ givenAnswer, questionId }) => {
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {            
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);            
            setAnswers(response.data.list);
        };
        fetchAnswers();
    },[]);

    return (
        <div className="row">
            <div className="col-md-12">
                {!givenAnswer ? (
                    <p className="font-semibold">
                        Na ovo pitanje nije odgovoreno! <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                    </p>
                ) : null}
                {answers.map((answer) => {
                    const isChecked = givenAnswer && answer.id === givenAnswer.answerId;
                    return (
                        <div key={answer.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name={String(answer.questionId)}
                                id={`radio${answer.id}`}
                                value={answer.id}
                                checked={isChecked}
                                disabled
                            />
                            <label className="form-check-label" htmlFor={`radio${answer.id}`}>
                                {answer.text} &nbsp;
                                {answer.isCorrect ? (
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                                ) : (
                                    givenAnswer && !answer.isCorrect && answer.id === givenAnswer.id && (
                                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                                    )
                                )}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SingleSelectAnswer;