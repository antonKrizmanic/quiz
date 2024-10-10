'use client'

import React, { useEffect, useState } from 'react';
import { get } from '../../services/HttpService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    text: string;
}

interface QuizTakeQuestion {
    questionId: number;
    answers: Answer[];
}

interface MatchTermAnswerProps {
    questionId: number;
    quizTakeChildren: QuizTakeQuestion[];
}

const MatchTermAnswer: React.FC<MatchTermAnswerProps> = ({ questionId, quizTakeChildren }) => {
    const [questionAnswerDictionary, setQuestionAnswerDictionary] = useState<Map<Question, Answer>>(new Map());
    const [answers, setAnswers] = useState<Answer[]>([]);

    useEffect(() => {
        const fetchQuestionAnswers = async () => {
            try {                                
                const childQuestionsResponse = await get(`Quizzes/PublicQuestion/getList/1?parentId=${questionId}&ActiveStatusId=0&QuizCategoryId=0&QuizId=0&QuizTheme=None&QuestionType=None&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=True&PerPage=10`);
                const childQuestions = childQuestionsResponse.data.list;

                const questionAnswerDict = new Map();
                const allAnswers: Answer[] = [];

                for (const childQuestion of childQuestions) {                    
                    const answersResponse = await get(`Quizzes/PublicAnswer/GetList?questionId=${childQuestion.id}&Page=0&SearchTerm=&Type=&Field=&IgnorePageSize=False&PerPage=10`);
                    const answersData = answersResponse.data.list;
                    console.log(answersData);
                    if (!questionAnswerDict.has(childQuestion)) {
                        questionAnswerDict.set(childQuestion, answersData[0]);
                    }
                    allAnswers.push(...answersData);
                }

                setQuestionAnswerDictionary(questionAnswerDict);
                setAnswers(allAnswers);
            } catch (error) {
                console.error('Error fetching question answers:', error);
            }
        };

        fetchQuestionAnswers();
    }, [questionId]);

    return (
        <>
            {Array.from(questionAnswerDictionary.entries()).map(([question, correctAnswer], index) => {
                const questionTake = quizTakeChildren.find(x => x.questionId === question.id);
                const answer = questionTake?.answers[0];

                return (
                    <div key={index} className="pb-4">
                        <div className="grid grid-cols-4">
                            <div>
                                {question.text}
                            </div>
                            <div className="col-span-3">
                                {answer ? (
                                    answer.isCorrect ? (
                                        <div>
                                            <p className="font-semibold">Točan odgovor!</p>
                                            <p>{correctAnswer.text} <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" /></p>
                                        </div>
                                    ) : (
                                        <>
                                            {answers.find(x => x.id === answer.id)?.text ? (
                                                <div>
                                                    <p className="font-semibold">Tvoj odgovor:</p>
                                                    <p>{answers.find(x => x.id === answer.id)?.text} <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" /></p>
                                                    <p className="font-semibold">Točan odgovor:</p>
                                                    <p>{correctAnswer.text}</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-semibold">Nisi odgovorio!</p>
                                                    <p className="font-semibold">Točan odgovor:</p>
                                                    <p>{correctAnswer.text}</p>
                                                </div>
                                            )}
                                        </>
                                    )
                                ) : (
                                    <div>
                                        <p className="font-semibold">Nisi odgovorio!</p>
                                        <p className="font-semibold">Točan odgovor:</p>
                                        <p>{correctAnswer.text}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default MatchTermAnswer;