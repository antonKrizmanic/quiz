import Image from 'next/image';
import Link from 'next/link';

function Brand({ title }: { title: string }) {
    return (
        <Link
            href="/"
            className="flex min-h-11 min-w-0 items-center gap-3 rounded-full pr-2 font-bold tracking-tight text-white"
        >
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white">
                <Image
                    src="/brand/quiz-logo.svg"
                    alt=""
                    width={30}
                    height={30}
                />
            </span>
            <span className="truncate text-[1.0625rem]">{title}</span>
        </Link>
    );
}

export function SiteHeader({ title }: { title: string }) {
    return (
        <header className="pt-[env(safe-area-inset-top)]">
            <div className="gutter mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 sm:h-20">
                <Brand title={title} />
                <p className="hidden rounded-full bg-white/16 px-3.5 py-1.5 text-sm font-bold sm:block">
                    Provjerite svoje znanje
                </p>
            </div>
        </header>
    );
}

export function SiteFooter({ title }: { title: string }) {
    return (
        <footer className="border-t border-white/15 pb-[env(safe-area-inset-bottom)]">
            <div className="gutter mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-1 py-6 text-sm">
                <p className="font-bold">{title}</p>
                <p className="text-white/80">Kvizovi Crvenog križa</p>
            </div>
        </footer>
    );
}
