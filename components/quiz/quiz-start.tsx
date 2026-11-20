'use client';

import {
    ArrowRight,
    ClipboardList,
    ListChecks,
    Save,
    Trophy,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Button, Spinner } from '@/components/ui/button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    TextInput,
} from '@/components/ui/field';
import { Notice } from '@/components/ui/notice';
import { questionsLabel } from '@/lib/format';
import type { PublicQuizInstance } from '@/types/quiz-public';

type QuizStartProps = {
    instance: PublicQuizInstance;
    error: string | null;
    onStart: (personName: string) => Promise<void>;
};

export function QuizStart({ instance, error, onStart }: QuizStartProps) {
    const [name, setName] = useState('');
    const [busy, setBusy] = useState(false);
    const [nameError, setNameError] = useState(false);

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
        { icon: Save, text: 'Odgovori se spremaju dok rješavate' },
        { icon: Trophy, text: 'Rezultat i točni odgovori nakon završetka' },
    ];

    return (
        <div className="card mx-auto grid max-w-4xl overflow-hidden lg:grid-cols-[1.1fr_1fr]">
            <div className="relative isolate overflow-hidden bg-sunken/50 px-5 py-7 sm:px-9 sm:py-10 lg:p-12">
                <span
                    aria-hidden="true"
                    className="absolute -top-24 -right-24 -z-10 size-64 rounded-full border-[48px] border-primary/6"
                />
                <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
                    <ClipboardList aria-hidden="true" className="size-6" />
                </span>
                <p className="mt-5 text-sm font-bold text-primary">
                    Spremni za kviz?
                </p>
                <h1 className="mt-1 text-[1.75rem]/[1.15] font-extrabold tracking-tight text-balance sm:text-4xl">
                    {instance.name || 'Kviz Crvenog križa'}
                </h1>
                {instance.description && (
                    <p className="mt-3 text-muted sm:text-lg">
                        {instance.description}
                    </p>
                )}
                <ul className="mt-6 grid gap-2.5 text-sm text-fg">
                    {facts.map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-center gap-2.5">
                            <Icon
                                aria-hidden="true"
                                className="size-[1.125rem] shrink-0 text-primary"
                            />
                            {text}
                        </li>
                    ))}
                </ul>
            </div>

            <form
                onSubmit={(event) => void submit(event)}
                className="flex flex-col justify-center gap-5 border-t border-line px-5 py-7 sm:px-9 sm:py-10 lg:border-t-0 lg:border-l lg:p-12"
            >
                <div>
                    <h2 className="text-xl font-bold tracking-tight">
                        Započnite pokušaj
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                        Upišite ime koje će biti prikazano uz vaš rezultat.
                    </p>
                </div>
                <Field invalid={nameError ? true : undefined}>
                    <FieldLabel>Ime i prezime</FieldLabel>
                    <TextInput
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
                    />
                    <FieldDescription>
                        Na ovom uređaju možete nastaviti gdje ste stali.
                    </FieldDescription>
                    <FieldError>Upišite ime i prezime.</FieldError>
                </Field>
                {error && <Notice tone="danger">{error}</Notice>}
                <Button
                    type="submit"
                    size="lg"
                    block
                    disabled={busy}
                    focusableWhenDisabled
                >
                    {busy ? <Spinner /> : null}
                    {busy ? 'Pokretanje…' : 'Započni kviz'}
                    {busy ? null : <ArrowRight aria-hidden="true" />}
                </Button>
            </form>
        </div>
    );
}
