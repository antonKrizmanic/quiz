import { Home, SearchX } from 'lucide-react';
import Link from 'next/link';
import { buttonClass } from '@/components/ui/button';
import { StatusCard } from '@/components/ui/status-card';

export default function NotFound() {
    return (
        <StatusCard
            icon={<SearchX aria-hidden="true" />}
            eyebrow="404"
            title="Stranica nije pronađena"
            actions={
                <Link href="/" className={buttonClass({ size: 'lg' })}>
                    <Home aria-hidden="true" />
                    Početna stranica
                </Link>
            }
        >
            <p>Provjerite poveznicu koju ste dobili i pokušajte ponovno.</p>
        </StatusCard>
    );
}
