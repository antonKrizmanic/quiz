'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <div className="mx-auto max-w-xl quiz-card p-8 text-center shadow-panel sm:p-12">
            <h1 className="text-3xl font-semibold text-ink">
                Nešto nije uspjelo
            </h1>
            <p className="mt-3 text-subtle">Pokušajte ponovno učitati kviz.</p>
            <button
                type="button"
                onClick={reset}
                className="mt-7 quiz-button-primary px-5 py-3 font-semibold text-on-brand hover:bg-brand-hover"
            >
                Pokušaj ponovno
            </button>
        </div>
    );
}
