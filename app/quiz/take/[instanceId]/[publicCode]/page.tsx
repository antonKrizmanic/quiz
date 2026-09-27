import { notFound } from 'next/navigation';
import { QuizExperience } from '@/components/quiz/quiz-experience';

export default async function QuizTakePage({
    params,
}: {
    params: Promise<{ instanceId: string; publicCode: string }>;
}) {
    const { instanceId: rawId, publicCode } = await params;
    const instanceId = Number(rawId);
    if (
        !Number.isSafeInteger(instanceId) ||
        instanceId <= 0 ||
        !/^[A-Za-z0-9_-]+$/.test(publicCode)
    ) {
        notFound();
    }

    return <QuizExperience instanceId={instanceId} publicCode={publicCode} />;
}
