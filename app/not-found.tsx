import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="mx-auto max-w-xl quiz-card p-8 text-center shadow-panel sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">
                404
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-ink">
                Stranica nije pronađena
            </h1>
            <p className="mt-3 text-subtle">
                Provjerite poveznicu koju ste dobili i pokušajte ponovno.
            </p>
            <Link
                href="/"
                className="mt-7 inline-flex quiz-button-primary px-5 py-3 font-semibold text-on-brand hover:bg-brand-hover"
            >
                Početna stranica
            </Link>
        </div>
    );
}
