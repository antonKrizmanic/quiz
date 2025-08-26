interface QuestionHeaderProps {
    questionIndex: number;
    questionCount: number;
    questionText: string;
    helperText: string;
}

function QuestionHeader({ questionIndex, questionCount, questionText, helperText }: QuestionHeaderProps) {
    return (
        <div className="mb-4 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-semibold leading-tight">
                    {questionIndex + 1}. {questionText}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {helperText}
                </p>
            </div>
            <span className="text-sm text-muted-foreground">
                {questionIndex + 1}/{questionCount}
            </span>
        </div>
    );
}

export default QuestionHeader;