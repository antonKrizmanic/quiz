import { cx } from '@/lib/cx';

export function Skeleton({ className }: { className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cx(
                'block animate-pulse rounded-lg bg-sunken motion-reduce:animate-none',
                className,
            )}
        />
    );
}

export function LoadingStatus({ label }: { label: string }) {
    return (
        <span role="status" className="sr-only">
            {label}
        </span>
    );
}
