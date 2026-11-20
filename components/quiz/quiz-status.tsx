'use client';

import { CircleAlert, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonClass } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusCard } from '@/components/ui/status-card';

export function QuizLoading() {
    return (
        <div className="mx-auto grid max-w-2xl gap-5">
            <span role="status" className="sr-only">
                Učitavanje kviza…
            </span>
            <div className="card grid gap-3 p-5 sm:p-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-4/5" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid gap-2.5">
                {[0, 1, 2, 3].map((key) => (
                    <Skeleton key={key} className="h-15 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

export function QuizUnavailable({
    personal,
    message,
}: {
    personal: boolean;
    message: string | null;
}) {
    return (
        <StatusCard
            icon={<CircleAlert aria-hidden="true" />}
            title={personal ? 'Pokušaj nije dostupan' : 'Kviz nije dostupan'}
            actions={
                <>
                    <Button size="lg" onClick={() => window.location.reload()}>
                        <RotateCcw aria-hidden="true" />
                        Pokušaj ponovno
                    </Button>
                    <Link
                        href="/"
                        className={buttonClass({
                            variant: 'secondary',
                            size: 'lg',
                        })}
                    >
                        <Home aria-hidden="true" />
                        Početna
                    </Link>
                </>
            }
        >
            <p role="alert">
                {message || 'Provjerite poveznicu i pokušajte ponovno.'}
            </p>
        </StatusCard>
    );
}
