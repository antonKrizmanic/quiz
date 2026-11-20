import {
    Field as BaseField,
    FieldDescription as BaseFieldDescription,
    FieldError as BaseFieldError,
    FieldLabel as BaseFieldLabel,
} from '@ui-sdk/react/field';
import { Input } from '@ui-sdk/react/input';
import { Textarea } from '@ui-sdk/react/textarea';
import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

type WithClass<T> = Omit<T, 'className'> & { className?: string };

export const controlClass =
    'w-full rounded-xl border border-control bg-surface text-base text-fg placeholder:text-muted transition-[border-color,box-shadow] duration-150 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 data-invalid:border-danger';

export function Field({
    className,
    ...props
}: WithClass<ComponentProps<typeof BaseField>>) {
    return <BaseField {...props} className={cx('grid gap-1.5', className)} />;
}

export function FieldLabel({
    className,
    ...props
}: WithClass<ComponentProps<typeof BaseFieldLabel>>) {
    return (
        <BaseFieldLabel
            {...props}
            className={cx('text-sm font-semibold text-fg', className)}
        />
    );
}

export function FieldDescription({
    className,
    ...props
}: WithClass<ComponentProps<typeof BaseFieldDescription>>) {
    return (
        <BaseFieldDescription
            {...props}
            className={cx('text-sm text-muted', className)}
        />
    );
}

export function FieldError({
    className,
    ...props
}: WithClass<ComponentProps<typeof BaseFieldError>>) {
    return (
        <BaseFieldError
            {...props}
            className={cx('text-sm font-medium text-danger', className)}
        />
    );
}

export function TextInput({
    className,
    ...props
}: WithClass<ComponentProps<typeof Input>>) {
    return (
        <Input
            {...props}
            className={cx(controlClass, 'min-h-12 px-4', className)}
        />
    );
}

export function TextArea({
    className,
    ...props
}: WithClass<ComponentProps<typeof Textarea>>) {
    return (
        <Textarea
            {...props}
            className={cx(
                controlClass,
                'min-h-32 max-h-80 resize-none px-4 py-3 leading-relaxed',
                className,
            )}
        />
    );
}
