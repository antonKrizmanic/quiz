'use client';

import { Button } from '@ui-sdk/react/button';
import { CircleAlert, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useConfig } from '@/components/quiz/config-provider';
import { storyCover } from '@/lib/story';
import { StoryCloseLink, StoryShell, storyButton } from './story-shell';

const block =
    'block animate-pulse rounded-full bg-white/16 motion-reduce:animate-none';

export function QuizLoading() {
    const city = useConfig();
    return (
        <StoryShell
            color={storyCover}
            title={city.title}
            subtitle="Učitavanje…"
            actions={<StoryCloseLink />}
        >
            <span role="status" className="sr-only">
                Učitavanje kviza…
            </span>
            <div aria-hidden="true" className="flex flex-1 flex-col gap-6">
                <div className="flex flex-1 flex-col justify-center gap-4 py-4">
                    <span className={`${block} h-7 w-36`} />
                    <span className={`${block} h-10 w-11/12 rounded-2xl`} />
                    <span className={`${block} h-10 w-2/3 rounded-2xl`} />
                    <span className={`${block} h-4 w-1/2`} />
                </div>
                <div className="grid gap-2.5">
                    {[0, 1, 2, 3].map((key) => (
                        <span
                            key={key}
                            className={`${block} h-15 rounded-[1.25rem]`}
                        />
                    ))}
                </div>
            </div>
        </StoryShell>
    );
}

export function QuizUnavailable({
    personal,
    message,
}: {
    personal: boolean;
    message: string | null;
}) {
    const city = useConfig();
    return (
        <StoryShell
            color={storyCover}
            title={city.title}
            subtitle={personal ? 'Vlastiti kviz' : 'Pripremljeni kviz'}
            watermark="!"
            actions={<StoryCloseLink />}
            footer={
                <div className="grid gap-2.5">
                    <Button
                        onClick={() => window.location.reload()}
                        className={storyButton({ block: true })}
                    >
                        <RotateCcw aria-hidden="true" />
                        Pokušaj ponovno
                    </Button>
                    <Link
                        href="/"
                        className={storyButton({
                            variant: 'outline',
                            block: true,
                        })}
                    >
                        <Home aria-hidden="true" />
                        Početna
                    </Link>
                </div>
            }
        >
            <div className="flex flex-1 flex-col justify-center gap-4 py-4">
                <span className="grid size-14 place-items-center rounded-full bg-white text-(--story)">
                    <CircleAlert aria-hidden="true" className="size-7" />
                </span>
                <h1 className="text-[2.25rem] leading-[1.04] font-extrabold tracking-tight text-balance">
                    {personal ? 'Pokušaj nije dostupan' : 'Kviz nije dostupan'}
                </h1>
                <p
                    role="alert"
                    className="text-[1.0625rem] leading-relaxed text-white/90"
                >
                    {message || 'Provjerite poveznicu i pokušajte ponovno.'}
                </p>
            </div>
        </StoryShell>
    );
}
