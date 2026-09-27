import { notFound } from 'next/navigation';
import { QuizExperience } from '@/components/quiz/quiz-experience';

export default async function PersonalAttemptPage({
    params,
}: {
    params: Promise<{ attemptId: string }>;
}) {
    const { attemptId: rawId } = await params;
    const attemptId = Number(rawId);
    if (!Number.isSafeInteger(attemptId) || attemptId <= 0) notFound();
    return <QuizExperience attemptId={attemptId} />;
}
