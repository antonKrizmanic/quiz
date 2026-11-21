'use client';

import { CircleAlert, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonClass } from '@/components/ui/button';
import { StatusCard } from '@/components/ui/status-card';

export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <StatusCard
            icon={<CircleAlert aria-hidden="true" />}
            title="Nešto nije uspjelo"
            actions={
                <>
                    <Button size="lg" onClick={reset}>
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
            <p>Pokušajte ponovno učitati stranicu.</p>
        </StatusCard>
    );
}
