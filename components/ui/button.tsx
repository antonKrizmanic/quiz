import { Button as BaseButton } from '@ui-sdk/react/button';
import { LoaderCircle, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

type Variant =
    | 'primary'
    | 'secondary'
    | 'ghost'
    | 'soft'
    | 'inverse'
    | 'ghost-inverse';
type Size = 'sm' | 'md' | 'lg' | 'icon';

type ButtonStyle = { variant?: Variant; size?: Size; block?: boolean };

const variants: Record<Variant, string> = {
    primary:
        'bg-primary text-on-primary hover:bg-primary-hover data-pending:bg-primary-hover',
    secondary: 'border-2 border-line bg-surface text-fg hover:bg-sunken',
    ghost: 'text-fg hover:bg-sunken',
    soft: 'bg-primary-soft text-primary hover:bg-primary-soft/70',
    inverse: 'bg-white text-ink hover:bg-white/90',
    'ghost-inverse': 'text-white hover:bg-white/12',
};

const sizes: Record<Size, string> = {
    sm: 'min-h-10 rounded-full px-4 text-sm',
    md: 'min-h-11 rounded-full px-5 text-[0.9375rem]',
    lg: 'min-h-13 rounded-full px-6 text-[1.0625rem]',
    icon: 'size-11 shrink-0 rounded-full',
};

export function buttonClass({
    variant = 'primary',
    size = 'md',
    block = false,
}: ButtonStyle = {}) {
    return cx(
        'inline-flex select-none items-center justify-center gap-2 font-extrabold whitespace-nowrap transition-[background-color,color,scale] duration-150 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100',
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
