import { Box, Typography } from '@mui/material';

interface QuestionHeaderProps {
    questionIndex: number;
    questionCount: number;
    questionText: string;
    helperText: string;
}

function QuestionHeader({ questionIndex, questionCount, questionText, helperText }: QuestionHeaderProps) {
    return (
        <Box sx={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Typography
                    variant="subtitle1"
                    sx={{ lineHeight: 1, fontWeight: 600 }}>
                    {questionIndex + 1}. {questionText}
                </Typography>
                <Typography
                    variant="caption">
                    {helperText}
                </Typography>
            </Box>
            <Typography
                variant="caption">
                {questionIndex + 1}/{questionCount}
            </Typography>
        </Box>
    );
}

export default QuestionHeader;