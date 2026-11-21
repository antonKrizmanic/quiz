'use client';

import { Button } from '@ui-sdk/react/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from '@ui-sdk/react/field';
import { Input } from '@ui-sdk/react/input';
import {
    ArrowRight,
    CircleAlert,
    ListChecks,
    Save,
    Trophy,
} from 'lucide-react';
import { type FormEvent, useId, useState } from 'react';
import { useConfig } from '@/components/quiz/config-provider';
import { Spinner } from '@/components/ui/button';
import { cx } from '@/lib/cx';
import { questionsLabel } from '@/lib/format';
import { storyCover } from '@/lib/story';
import type { PublicQuizInstance } from '@/types/quiz-public';
import {
    StoryCloseLink,
    StoryNotice,
    StorySegments,
    StoryShell,
    storyButton,
} from './story-shell';

type QuizStartProps = {
    instance: PublicQuizInstance;
    error: string | null;
    onStart: (personName: string) => Promise<void>;
};

export function QuizStart({ instance, error, onStart }: QuizStartProps) {
    const city = useConfig();
    const formId = useId();
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [nameError, setNameError] = useState(false);
    const title = instance.name || 'Kviz Crvenog križa';

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const personName = name.trim();
        if (busy) return;
        if (!personName) {
            setNameError(true);
            return;
        }
        setBusy(true);
        try {
            await onStart(personName);
        } finally {
            setBusy(false);
        }
    }

    const facts = [
        { icon: ListChecks, text: questionsLabel(instance.questionCount) },
        { icon: Save, text: 'Odgovori se spremaju' },
        { icon: Trophy, text: 'Rezultat na kraju' },
    ];

    return (
        <StoryShell
            color={storyCover}
            title={city.title}
            subtitle="Pripremljeni kviz"
            watermark="?"
            progress={
                <div
                    aria-hidden="true"
                    className="flex h-1.5 items-center gap-1"
                >
                    <StorySegments
                        segments={Array.from(
                            { length: Math.max(instance.questionCount, 1) },
                            (_, position) => ({
                                key: position,
                                fill: 'faint' as const,
                            }),
                        )}
                    />
                </div>
            }
            actions={<StoryCloseLink />}
            footer={
                <Button
                    type="submit"
                    form={formId}
                    disabled={busy}
                    focusableWhenDisabled
                    className={storyButton({ block: true })}
                >
                    {busy ? <Spinner /> : null}
                    {busy ? 'Pokretanje…' : 'Započni kviz'}
                    {busy ? null : <ArrowRight aria-hidden="true" />}
                </Button>
            }
        >
            <form
                id={formId}
                onSubmit={(event) => void submit(event)}
                className="flex flex-1 flex-col gap-6"
            >
                <header className="flex flex-1 flex-col justify-center gap-4 py-4">
                    <p className="self-start rounded-full bg-white/16 px-3 py-1.5 text-[0.8125rem] font-bold tracking-wide">
                        Spremni za kviz?
                    </p>
                    <h1
                        className={cx(
                            'leading-[1.04] font-extrabold tracking-tight text-balance',
                            title.length > 40
                                ? 'text-[1.875rem]'
                                : 'text-[2.5rem]',
                        )}
                    >
                        {title}
                    </h1>
                    {instance.description && (
                        <p className="text-[1.0625rem] leading-relaxed text-white/90">
                            {instance.description}
                        </p>
                    )}
                    <ul className="mt-1 flex flex-wrap gap-2">
                        {facts.map(({ icon: Icon, text }) => (
                            <li
                                key={text}
                                className="flex items-center gap-2 rounded-full bg-white/16 py-2 pr-3.5 pl-3 text-sm font-bold"
                            >
                                <Icon
                                    aria-hidden="true"
                                    className="size-4 shrink-0"
                                />
                                {text}
                            </li>
                        ))}
                    </ul>
                </header>

                <Field
                    invalid={nameError ? true : undefined}
                    className="grid gap-2"
                >
                    <FieldLabel className="text-sm font-bold text-white/90">
                        Vaše ime i prezime
                    </FieldLabel>
                    <Input
                        value={name}
                        onValueChange={(value) => {
                            setName(value);
                            setNameError(false);
                        }}
                        required
                        maxLength={200}
                        autoComplete="name"
                        autoCapitalize="words"
                        enterKeyHint="go"
                        placeholder="npr. Ana Horvat"
                        className="h-14 w-full rounded-[1.25rem] border-0 bg-white px-5 text-lg font-semibold text-ink placeholder:font-normal placeholder:text-ink/55 focus-visible:outline-offset-2"
                    />
                    <FieldDescription className="text-sm text-white/85">
                        Prikazuje se uz vaš rezultat. Na ovom uređaju možete
                        nastaviti gdje ste stali.
                    </FieldDescription>
                    <FieldError className="flex items-center gap-2 text-sm font-bold text-white">
                        <CircleAlert aria-hidden="true" className="size-4" />
                        Upišite ime i prezime.
                    </FieldError>
                </Field>
                {error && <StoryNotice>{error}</StoryNotice>}
            </form>
        </StoryShell>
    );
}
