import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from './theme';

function Brand({ title }: { title: string }) {
    return (
        <Link
            href="/"
            className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-xl font-bold tracking-tight text-fg"
        >
            <Image
                src="/brand/quiz-logo.svg"
                alt=""
                width={36}
                height={36}
                className="size-8 shrink-0 sm:size-9"
            />
            <span className="truncate">{title}</span>
        </Link>
    );
}

export function SiteHeader({ title }: { title: string }) {
    return (
        <header className="border-b border-line bg-surface pt-[env(safe-area-inset-top)]">
            <div className="gutter mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 sm:h-16">
                <Brand title={title} />
                <p className="hidden text-sm font-medium text-muted sm:block">
                    Provjerite svoje znanje
                </p>
            </div>
        </header>
    );
}

export function SiteFooter({ title }: { title: string }) {
    return (
        <footer className="border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
            <div className="gutter mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 py-5">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-fg">{title}</p>
                    <p className="text-sm text-muted">Kvizovi Crvenog križa</p>
                </div>
                <ThemeSwitcher />
            </div>
        </footer>
    );
}
