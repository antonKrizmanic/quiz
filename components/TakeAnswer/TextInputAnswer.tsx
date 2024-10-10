'use client';

import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface Answer {
    questionId: number;
    answerId: number;
    text: string;
    isCorrect: boolean;
}

interface TextInputAnswerProps {
    givenAnswer?: Answer;
    questionId: number;
}

const TextInputAnswer: React.FC<TextInputAnswerProps> = ({ givenAnswer, questionId }) => {

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
            {(!givenAnswer || !givenAnswer.text) ? (
                <p className="font-semibold">Nisi odgovorio!</p>
            ) : (
                <>
                    <p className="font-semibold">Tvoj odgovor:</p>
                    <p>
                        {givenAnswer.text}  &nbsp;
                        {givenAnswer.isCorrect ? (
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />                            
                        ) : (
                            <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
                        )}
                    </p>
                </>
            )}

            <p className="font-semibold">Odgovori koji se priznaju:</p>
            <ul className="list-disc list-inside">
                {answers.map((correctAnswer, index) => (
                    <li key={index}>{correctAnswer.text}</li>
                ))}
            </ul>
        </div>
    );
};

export default TextInputAnswer;