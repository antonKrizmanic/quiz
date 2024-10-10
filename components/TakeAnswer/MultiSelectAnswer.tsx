'use client'

import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface Answer {
    id: number;
    questionId: number;
    text: string;
    isCorrect: boolean;
}

interface MultiSelectAnswerProps {
    givenAnswers?: any[];
    questionId: number;
}

const MultiSelectAnswer: React.FC<MultiSelectAnswerProps> = ({ givenAnswers, questionId }) => {
    
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchAnswers = async () => {            
            const response = await get(`Quizzes/publicAnswer/GetList?QuestionId=${questionId}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);            
            setAnswers(response.data.list);
        };        
        fetchAnswers();
    },[]);

    return (
        <div>
            {!givenAnswers ? (
                <p className="font-semibold">
                    Na ovo pitanje nije odgovoreno! <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                </p>
            ) : null}
            {answers.map((answer) => {
                const isChecked = givenAnswers && givenAnswers.some(x => x.answerId
                     === answer.id);
                return (
                    <div key={answer.id}>
                        <input
                            type="checkbox"
                            name={String(answer.questionId)}
                            id={`checkbox${answer.id}`}
                            value={answer.id}
                            checked={isChecked}
                            disabled
                        />
                        <label htmlFor={`checkbox${answer.id}`}>
                            {answer.text}  &nbsp;
                            {answer.isCorrect ? (
                                <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                            ) : (
                                givenAnswers && !answer.isCorrect && givenAnswers.some(x => x.id === answer.id) && (
                                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                                )
                            )}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

export default MultiSelectAnswer;