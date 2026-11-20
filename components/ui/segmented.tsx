import {
    SegmentedControl,
    SegmentedControlIndicator,
    SegmentedControlItem,
} from '@ui-sdk/react/segmented-control';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

type SegmentedItem<T extends string> = {
    value: T;
    label: ReactNode;
    ariaLabel?: string;
};

type SegmentedProps<T extends string> = {
    items: SegmentedItem<T>[];
    value: T | null;
    onValueChange: (value: T) => void;
    'aria-label': string;
    block?: boolean;
    className?: string;
};

export function Segmented<T extends string>({
    items,
    value,
    onValueChange,
    block,
    className,
    ...props
}: SegmentedProps<T>) {
    return (
        <SegmentedControl<T>
            aria-label={props['aria-label']}
            value={value}
            onValueChange={(next) => {
                if (next !== null) onValueChange(next);
            }}
            className={cx(
                'relative isolate rounded-xl bg-sunken p-1',
                block ? 'flex' : 'inline-flex',
                className,
            )}
        >
            <SegmentedControlIndicator className="absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) -z-10 h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) rounded-lg bg-surface shadow-card transition-[left,width] duration-200 ease-out motion-reduce:transition-none" />
            {items.map((item) => (
                <SegmentedControlItem
                    key={item.value}
                    value={item.value}
                    aria-label={item.ariaLabel}
                    className={cx(
                        'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold whitespace-nowrap text-muted transition-colors focus-visible:outline-offset-0 data-checked:text-fg [&_svg]:size-4',
                        block && 'flex-1',
                    )}
                >
                    {item.label}
                </SegmentedControlItem>
            ))}
        </SegmentedControl>
    );
}
