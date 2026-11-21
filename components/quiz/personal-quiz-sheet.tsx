'use client';

import {
    NumberInput,
    NumberInputControl,
    NumberInputDecrement,
    NumberInputGroup,
    NumberInputIncrement,
} from '@ui-sdk/react/number-input';
import { ArrowRight, Minus, Plus, Shuffle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useId, useState } from 'react';
import { useConfig, useQuizApi } from '@/components/quiz/config-provider';
import { Button, buttonClass, Spinner } from '@/components/ui/button';
import {
    controlClass,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    TextInput,
} from '@/components/ui/field';
import { Notice } from '@/components/ui/notice';
import { Segmented } from '@/components/ui/segmented';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { errorMessage } from '@/lib/categories';
import { cx } from '@/lib/cx';
import { questionsLabel } from '@/lib/format';
import { savePersonalSession } from '@/lib/quiz-session';
import type { PublicQuestionCategory } from '@/types/quiz-public';

const presets = [5, 10, 20];

export function PersonalQuizSheet({
    category,
}: {
    category: PublicQuestionCategory;
}) {
    const city = useConfig();
    const quizApi = useQuizApi();
    const router = useRouter();
    const formId = useId();
    const maxCount = Math.min(100, category.availableQuestionCount);
    const [name, setName] = useState('');
    const [count, setCount] = useState<number | null>(Math.min(10, maxCount));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (maxCount < 1) {
        return (
            <Notice>
                Ova kategorija još nema pitanja za sastavljanje vlastitog kviza.
            </Notice>
        );
    }

    const choices = presets.filter((preset) => preset <= maxCount);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const personName = name.trim();
        if (busy) return;
        if (!personName) {
            setError('Upišite ime i prezime.');
            return;
        }
        const questionCount = Math.min(
            Math.max(Math.round(count ?? 1), 1),
            maxCount,
        );
        setBusy(true);
        setError(null);
        try {
            const started = await quizApi.startPersonal(
                city.cityAssociationId,
                category.id,
                personName,
                questionCount,
            );
            savePersonalSession({
                attemptId: started.attemptId,
                accessToken: started.accessToken,
            });
            router.push(`/quiz/attempt/${started.attemptId}`);
        } catch (cause) {
            setError(errorMessage(cause, 'Kviz nije moguće sastaviti.'));
            setBusy(false);
        }
    }

    return (
        <Sheet>
            <SheetTrigger className={buttonClass({ size: 'lg', block: true })}>
                <Shuffle aria-hidden="true" />
                Sastavi svoj kviz
            </SheetTrigger>
            <SheetContent
                title="Sastavi svoj kviz"
                description={`Nasumična pitanja iz kategorije „${category.name}”.`}
                footer={
                    <Button
                        type="submit"
                        form={formId}
                        size="lg"
                        block
                        disabled={busy}
                        focusableWhenDisabled
                    >
                        {busy ? <Spinner /> : null}
                        {busy ? 'Sastavljanje…' : 'Započni kviz'}
                        {busy ? null : <ArrowRight aria-hidden="true" />}
                    </Button>
                }
            >
                <form
                    id={formId}
                    onSubmit={(event) => void submit(event)}
                    className="grid gap-5 pt-1"
                >
                    <Field>
                        <FieldLabel>Ime i prezime</FieldLabel>
                        <TextInput
                            value={name}
                            onValueChange={(value) => {
                                setName(value);
                                setError(null);
                            }}
                            required
                            maxLength={200}
                            autoComplete="name"
                            autoCapitalize="words"
                            enterKeyHint="go"
                            placeholder="npr. Ana Horvat"
                        />
                        <FieldDescription>
                            Prikazuje se uz vaš rezultat.
                        </FieldDescription>
                        <FieldError match="valueMissing">
                            Upišite ime i prezime.
                        </FieldError>
                    </Field>

                    <Field>
                        <FieldLabel>Broj pitanja</FieldLabel>
                        <NumberInput
                            value={count}
                            onValueChange={setCount}
                            min={1}
                            max={maxCount}
                            required
                        >
                            <NumberInputGroup className="flex items-stretch gap-2">
                                <NumberInputDecrement
                                    aria-label="Manje pitanja"
                                    className={cx(
                                        buttonClass({
                                            variant: 'secondary',
                                            size: 'icon',
                                        }),
                                        'size-12',
                                    )}
                                >
                                    <Minus aria-hidden="true" />
                                </NumberInputDecrement>
                                <NumberInputControl
                                    inputMode="numeric"
                                    className={cx(
                                        controlClass,
                                        'min-h-12 min-w-0 flex-1 px-3 text-center text-lg font-semibold tabular-nums',
                                    )}
                                />
                                <NumberInputIncrement
                                    aria-label="Više pitanja"
                                    className={cx(
                                        buttonClass({
                                            variant: 'secondary',
                                            size: 'icon',
                                        }),
                                        'size-12',
                                    )}
                                >
                                    <Plus aria-hidden="true" />
                                </NumberInputIncrement>
                            </NumberInputGroup>
                        </NumberInput>
                        <FieldDescription>
                            Najviše {maxCount} za ovu kategoriju.
                        </FieldDescription>
                    </Field>

                    {choices.length > 1 && (
                        <Segmented
                            aria-label="Brzi odabir broja pitanja"
                            block
                            value={
                                count !== null && choices.includes(count)
                                    ? String(count)
                                    : null
                            }
                            onValueChange={(value) => setCount(Number(value))}
                            items={choices.map((choice) => ({
                                value: String(choice),
                                label: String(choice),
                                ariaLabel: questionsLabel(choice),
                            }))}
                        />
                    )}

                    {error && <Notice tone="danger">{error}</Notice>}
                </form>
            </SheetContent>
        </Sheet>
    );
}
