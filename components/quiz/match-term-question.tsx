'use client';

import { ArrowLeft, ArrowRight, GripVertical, X } from 'lucide-react';
import { type PointerEvent, useRef, useState } from 'react';
import type {
    PublicQuizQuestion,
    QuizAnswer,
    QuizOption,
} from '@/types/quiz-public';

interface MatchTermQuestionProps {
    question: PublicQuizQuestion;
    answer: QuizAnswer;
    onChange: (answer: QuizAnswer) => void;
}

interface DragState {
    pointerId: number;
    rightId: string;
    text: string;
    startX: number;
    startY: number;
    x: number;
    y: number;
    moved: boolean;
}

function findUnmatchedIndex(
    question: PublicQuizQuestion,
    matches: QuizAnswer['matches'],
    afterIndex = -1,
) {
    const next = question.leftOptions.findIndex(
        (left, index) =>
            index > afterIndex &&
            !matches.some((match) => match.leftOptionId === left.id),
    );
    if (next !== -1) return next;
    return question.leftOptions.findIndex(
        (left) => !matches.some((match) => match.leftOptionId === left.id),
    );
}

export function MatchTermQuestion({
    question,
    answer,
    onChange,
}: MatchTermQuestionProps) {
    const [activeIndex, setActiveIndex] = useState(() =>
        Math.max(0, findUnmatchedIndex(question, answer.matches)),
    );
    const [dragged, setDragged] = useState<DragState | null>(null);
    const [overDrop, setOverDrop] = useState(false);
    const dragRef = useRef<DragState | null>(null);
    const dropRef = useRef<HTMLFieldSetElement>(null);
    const activeRef = useRef<HTMLDivElement>(null);
    const left = question.leftOptions[activeIndex];

    if (!left) return null;

    const selectedRightId = answer.matches.find(
        (match) => match.leftOptionId === left.id,
    )?.rightOptionId;
    const selectedRight = question.rightOptions.find(
        (option) => option.id === selectedRightId,
    );
    const matchedCount = question.leftOptions.filter((option) =>
        answer.matches.some((match) => match.leftOptionId === option.id),
    ).length;

    function updateMatches(matches: QuizAnswer['matches']) {
        onChange({ choiceOptionIds: [], text: null, matches });
    }

    function assign(rightId: string) {
        const matches = [
            ...answer.matches.filter(
                (match) =>
                    match.leftOptionId !== left.id &&
                    match.rightOptionId !== rightId,
            ),
            { leftOptionId: left.id, rightOptionId: rightId },
        ];
        updateMatches(matches);
        const next = findUnmatchedIndex(question, matches, activeIndex);
        if (next !== -1) setActiveIndex(next);
    }

    function clearCurrent() {
        updateMatches(
            answer.matches.filter((match) => match.leftOptionId !== left.id),
        );
    }

    function isOverDrop(x: number, y: number) {
        const rect = dropRef.current?.getBoundingClientRect();
        return Boolean(
            rect &&
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom,
        );
    }

    function startDrag(
        event: PointerEvent<HTMLButtonElement>,
        right: QuizOption,
    ) {
        if (event.button !== 0) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        const next: DragState = {
            pointerId: event.pointerId,
            rightId: right.id,
            text: right.text,
            startX: event.clientX,
            startY: event.clientY,
            x: event.clientX,
            y: event.clientY,
            moved: false,
        };
        dragRef.current = next;
        setDragged(next);
    }

    function moveDrag(event: PointerEvent<HTMLButtonElement>) {
        const current = dragRef.current;
        if (!current || current.pointerId !== event.pointerId) return;
        const moved =
            current.moved ||
            Math.hypot(
                event.clientX - current.startX,
                event.clientY - current.startY,
            ) > 6;
        const next = {
            ...current,
            x: event.clientX,
            y: event.clientY,
            moved,
        };
        dragRef.current = next;
        if (moved) {
            setDragged(next);
            setOverDrop(isOverDrop(next.x, next.y));
        }
    }

    function finishDrag(event: PointerEvent<HTMLButtonElement>) {
        const current = dragRef.current;
        if (!current || current.pointerId !== event.pointerId) return;
        if (!current.moved || isOverDrop(event.clientX, event.clientY)) {
            assign(current.rightId);
        }
        dragRef.current = null;
        setDragged(null);
        setOverDrop(false);
    }

    function cancelDrag(event: PointerEvent<HTMLButtonElement>) {
        if (dragRef.current?.pointerId !== event.pointerId) return;
        dragRef.current = null;
        setDragged(null);
        setOverDrop(false);
    }

    function editPair(index: number) {
        setActiveIndex(index);
        activeRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-semibold text-ink">
                    Par {activeIndex + 1} od {question.leftOptions.length}
                </span>
                <span className="text-subtle" aria-live="polite">
                    Povezano {matchedCount} od {question.leftOptions.length}
                </span>
            </div>

            <div className="match-workspace">
                <div className="match-active" ref={activeRef}>
                    <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand">
                        Povežite pojam
                    </p>
                    <h3
                        className="mt-2 text-xl font-bold tracking-tight text-ink"
                        aria-live="polite"
                    >
                        {left.text}
                    </h3>
                    <fieldset
                        className="match-drop mt-5"
                        data-over={overDrop}
                        ref={dropRef}
                    >
                        <legend className="sr-only">
                            Odgovor za {left.text}
                        </legend>
                        {selectedRight ? (
                            <>
                                <span className="font-semibold text-ink">
                                    {selectedRight.text}
                                </span>
                                <button
                                    type="button"
                                    onClick={clearCurrent}
                                    className="match-clear"
                                    aria-label={`Ukloni odgovor ${selectedRight.text} za ${left.text}`}
                                >
                                    <X size={17} aria-hidden="true" />
                                </button>
                            </>
                        ) : (
                            <span className="text-subtle">
                                Povucite odgovor za ručicu ovdje ili dodirnite
                                njegov naziv ispod.
                            </span>
                        )}
                    </fieldset>
                </div>

                <div>
                    <p className="mb-3 text-sm font-semibold text-ink">
                        Odgovori
                    </p>
                    <div className="match-bank">
                        {question.rightOptions.map((right) => {
                            const owner = answer.matches.find(
                                (match) => match.rightOptionId === right.id,
                            );
                            const ownerName = question.leftOptions.find(
                                (option) => option.id === owner?.leftOptionId,
                            )?.text;
                            return (
                                <div
                                    className="match-answer"
                                    data-selected={selectedRightId === right.id}
                                    key={right.id}
                                >
                                    <button
                                        type="button"
                                        onClick={() => assign(right.id)}
                                        className="match-answer-select"
                                        aria-label={`Odaberi ${right.text}${ownerName ? `, povezano s ${ownerName}` : ''}`}
                                    >
                                        <span className="font-semibold text-ink">
                                            {right.text}
                                        </span>
                                        {ownerName && (
                                            <span className="text-xs text-subtle">
                                                Povezano: {ownerName}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="match-drag-handle"
                                        aria-label={`Povucite ${right.text} na označeno mjesto`}
                                        onPointerDown={(event) =>
                                            startDrag(event, right)
                                        }
                                        onPointerMove={moveDrag}
                                        onPointerUp={finishDrag}
                                        onPointerCancel={cancelDrag}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault();
                                                assign(right.id);
                                            }
                                        }}
                                    >
                                        <GripVertical
                                            size={19}
                                            aria-hidden="true"
                                        />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex - 1)}
                    disabled={activeIndex === 0}
                    className="quiz-button-secondary inline-flex items-center gap-2 px-4 py-2 disabled:opacity-40"
                >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Prethodni
                </button>
                <button
                    type="button"
                    onClick={() => setActiveIndex(activeIndex + 1)}
                    disabled={activeIndex === question.leftOptions.length - 1}
                    className="quiz-button-secondary inline-flex items-center gap-2 px-4 py-2 disabled:opacity-40"
                >
                    Sljedeći
                    <ArrowRight size={16} aria-hidden="true" />
                </button>
            </div>

            <div className="match-review">
                <h3 className="text-base font-bold text-ink">Pregled parova</h3>
                <p className="mt-1 text-sm text-subtle">
                    Dodirnite par za promjenu odgovora.
                </p>
                <div className="mt-4 space-y-2">
                    {question.leftOptions.map((option, index) => {
                        const rightId = answer.matches.find(
                            (match) => match.leftOptionId === option.id,
                        )?.rightOptionId;
                        const rightText = question.rightOptions.find(
                            (right) => right.id === rightId,
                        )?.text;
                        return (
                            <button
                                key={option.id}
                                type="button"
                                className="match-review-row"
                                data-active={index === activeIndex}
                                onClick={() => editPair(index)}
                                aria-label={`Uredi par ${option.text}, ${rightText ?? 'bez odgovora'}`}
                            >
                                <span className="font-semibold text-ink">
                                    {index + 1}. {option.text}
                                </span>
                                <span
                                    className={
                                        rightText ? 'text-brand' : 'text-subtle'
                                    }
                                >
                                    {rightText ?? 'Bez odgovora'}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {dragged?.moved && (
                <div
                    className="match-drag-ghost"
                    style={{ left: dragged.x, top: dragged.y }}
                    aria-hidden="true"
                >
                    {dragged.text}
                </div>
            )}
        </div>
    );
}
