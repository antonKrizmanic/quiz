import { CircleAlert, Info } from 'lucide-react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type NoticeProps = {
    tone?: 'danger' | 'info';
    children: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function Notice({
    tone = 'info',
    children,
    action,
    className,
}: NoticeProps) {
    const Icon = tone === 'danger' ? CircleAlert : Info;
    return (
        <div
            role={tone === 'danger' ? 'alert' : 'status'}
            className={cx(
                'flex items-start gap-3 rounded-2xl px-4 py-3 text-sm',
                tone === 'danger'
                    ? 'bg-danger-soft text-danger'
                    : 'bg-sunken text-muted',
                className,
            )}
        >
            <Icon
                aria-hidden="true"
                className="mt-0.5 size-[1.125rem] shrink-0"
            />
            <div className="min-w-0 flex-1 font-medium">{children}</div>
            {action}
        </div>
    );
}
