import { Button as BaseButton } from '@ui-sdk/react/button';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft';
type Size = 'sm' | 'md' | 'lg' | 'icon';

type ButtonStyle = { variant?: Variant; size?: Size; block?: boolean };

const variants: Record<Variant, string> = {
    primary:
        'bg-primary text-on-primary shadow-sm hover:bg-primary-hover data-pending:bg-primary-hover',
    secondary: 'border border-line bg-surface text-fg hover:bg-sunken',
    ghost: 'text-fg hover:bg-sunken',
    soft: 'bg-primary-soft text-primary hover:bg-primary-soft/70',
};

const sizes: Record<Size, string> = {
    sm: 'min-h-10 rounded-xl px-3 text-sm',
    md: 'min-h-11 rounded-xl px-4 text-[0.9375rem]',
    lg: 'min-h-13 rounded-2xl px-5 text-base',
    icon: 'size-11 shrink-0 rounded-xl',
};

export function buttonClass({
    variant = 'primary',
    size = 'md',
    block = false,
}: ButtonStyle = {}) {
    return cx(
        'inline-flex select-none items-center justify-center gap-2 font-semibold whitespace-nowrap transition-[background-color,color,scale] duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
        'disabled:pointer-events-none disabled:opacity-50 data-disabled:opacity-50 data-pending:cursor-progress',
        '[&_svg]:size-[1.125rem] [&_svg]:shrink-0',
        variants[variant],
        sizes[size],
        block && 'w-full',
    );
}

type ButtonProps = Omit<ComponentProps<typeof BaseButton>, 'className'> &
    ButtonStyle & { className?: string };

export function Button({
    variant,
    size,
    block,
    className,
    ...props
}: ButtonProps) {
    return (
        <BaseButton
            {...props}
            className={cx(buttonClass({ variant, size, block }), className)}
        />
    );
}

export function PendingIcon({ icon: Icon }: { icon: LucideIcon }) {
    return (
        <>
            <Icon aria-hidden="true" className="in-data-pending:hidden" />
            <LoaderCircle
                aria-hidden="true"
                className="hidden animate-spin in-data-pending:block"
            />
        </>
    );
}

export function Spinner({ className }: { className?: string }) {
    return (
        <LoaderCircle
            aria-hidden="true"
            className={cx('animate-spin', className)}
        />
    );
}
