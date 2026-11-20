import type { ReactNode } from 'react';

type StatusCardProps = {
    icon?: ReactNode;
    eyebrow?: string;
    title: string;
    children: ReactNode;
    actions: ReactNode;
};

export function StatusCard({
    icon,
    eyebrow,
    title,
    children,
    actions,
}: StatusCardProps) {
    return (
        <div className="card mx-auto grid max-w-lg justify-items-center gap-3 px-6 py-10 text-center sm:px-10 sm:py-12">
            {icon && (
                <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary [&_svg]:size-7">
                    {icon}
                </span>
            )}
            {eyebrow && (
                <p className="text-sm font-bold tracking-widest text-primary uppercase">
                    {eyebrow}
                </p>
            )}
            <h1 className="text-2xl font-extrabold tracking-tight text-balance">
                {title}
            </h1>
            <div className="text-muted">{children}</div>
            <div className="mt-3 flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                {actions}
            </div>
        </div>
    );
}
