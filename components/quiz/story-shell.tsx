'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
    type CSSProperties,
    type PointerEventHandler,
    type ReactNode,
    type Ref,
    useEffect,
} from 'react';
import { cx } from '@/lib/cx';

export const storyRoundButton =
    'grid size-11 shrink-0 place-items-center rounded-full bg-white/16 transition-colors hover:bg-white/26 data-disabled:opacity-50 [&_svg]:size-5';

export function storyButton({
    variant = 'solid',
    block = false,
}: {
    variant?: 'solid' | 'outline';
    block?: boolean;
} = {}) {
    return cx(
        'inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full px-6 text-[1.0625rem] font-extrabold whitespace-nowrap transition-[background-color,scale] active:scale-[0.97] motion-reduce:active:scale-100 data-disabled:opacity-60 [&_svg]:size-5',
        variant === 'solid'
            ? 'bg-white text-ink hover:bg-white/90'
            : 'border-2 border-white/75 text-white hover:bg-white/12',
        block && 'w-full',
    );
}

export type StorySegment = {
    key: string | number;
    fill: 'solid' | 'soft' | 'faint';
    tall?: boolean;
};

export function StorySegments({ segments }: { segments: StorySegment[] }) {
    if (segments.length > 30) {
        const filled = segments.filter((item) => item.fill !== 'faint').length;
        return (
            <span className="flex h-1 flex-1 overflow-hidden rounded-full bg-white/28">
                <span
                    className="rounded-full bg-white"
                    style={{ width: `${(filled / segments.length) * 100}%` }}
                />
            </span>
        );
    }
    return segments.map((item) => (
        <span
            key={item.key}
            className={cx(
                'flex-1 rounded-full transition-colors',
                item.tall ? 'h-1.5' : 'h-1',
                item.fill === 'solid'
                    ? 'bg-white'
                    : item.fill === 'soft'
                      ? 'bg-white/70'
                      : 'bg-white/28',
            )}
        />
    ));
}

export function StoryNotice({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <p
            role="alert"
            className={cx(
                'rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#9b0d24]',
                className,
            )}
        >
            {children}
        </p>
    );
}

export function StoryCloseLink({ label = 'Početna stranica' }) {
    return (
        <Link href="/" aria-label={label} className={storyRoundButton}>
            <X aria-hidden="true" />
        </Link>
    );
}

type StoryShellProps = {
    color: string;
    title: ReactNode;
    subtitle?: ReactNode;
    watermark?: string;
    progress?: ReactNode;
    actions?: ReactNode;
    footer?: ReactNode;
    outside?: ReactNode;
    children: ReactNode;
    scrollRef?: Ref<HTMLDivElement>;
    onPointerDown?: PointerEventHandler<HTMLDivElement>;
    onPointerUp?: PointerEventHandler<HTMLDivElement>;
    onPointerCancel?: PointerEventHandler<HTMLDivElement>;
};

export function StoryShell({
    color,
    title,
    subtitle,
    watermark,
    progress,
    actions,
    footer,
    outside,
    children,
    scrollRef,
    onPointerDown,
    onPointerUp,
    onPointerCancel,
}: StoryShellProps) {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add('overflow-hidden');
        return () => root.classList.remove('overflow-hidden');
    }, []);

    useEffect(() => {
        const metas = [
            ...document.querySelectorAll<HTMLMetaElement>(
                'meta[name="theme-color"]',
            ),
        ];
        const previous = metas.map((meta) => meta.content);
        for (const meta of metas) meta.content = color;
        return () => {
            for (const [position, meta] of metas.entries())
                meta.content = previous[position];
        };
    }, [color]);

    const band =
        'bg-(--story) transition-colors duration-300 motion-reduce:transition-none';

    return (
        <div
            className="story fixed inset-0 z-30 flex justify-center bg-[color-mix(in_oklab,var(--story)_55%,#000)] font-story text-white transition-colors duration-300 motion-reduce:transition-none"
            style={{ '--story': color } as CSSProperties}
        >
            <div
                ref={scrollRef}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerCancel}
                className={cx(
                    'relative isolate flex h-full w-full max-w-[30rem] touch-pan-y flex-col overflow-y-auto overscroll-contain sm:my-4 sm:h-[calc(100%-2rem)] sm:rounded-[2rem] sm:shadow-2xl',
                    band,
                )}
            >
                {watermark && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-28 -right-6 -z-10 text-[17rem] leading-none font-extrabold tracking-[-0.07em] text-white/8 select-none"
                    >
                        {watermark}
                    </span>
                )}

                <div
                    className={cx(
                        'sticky top-0 z-10 px-4 pt-[max(0.875rem,env(safe-area-inset-top))] pb-3',
                        band,
                    )}
                >
                    {progress}
                    <div
                        className={cx(
                            'flex items-center gap-3',
                            progress ? 'mt-3.5' : undefined,
                        )}
                    >
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
                            <Image
                                src="/brand/quiz-logo.svg"
                                alt=""
                                width={30}
                                height={30}
                            />
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-[0.9375rem] leading-tight font-bold">
                                {title}
                            </p>
                            {subtitle && (
                                <p className="mt-0.5 text-[0.8125rem] text-white/85 tabular-nums">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {actions}
                    </div>
                </div>

                <div className="flex flex-1 flex-col px-4">{children}</div>

                {footer ? (
                    <div
                        className={cx(
                            'sticky bottom-0 z-10 mt-5 px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]',
                            band,
                        )}
                    >
                        {footer}
                    </div>
                ) : (
                    <div className="h-[max(1.5rem,env(safe-area-inset-bottom))] shrink-0" />
                )}
            </div>
            {outside}
        </div>
    );
}
