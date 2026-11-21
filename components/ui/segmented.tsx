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
    tone?: 'default' | 'story';
    className?: string;
};

export function Segmented<T extends string>({
    items,
    value,
    onValueChange,
    block,
    tone = 'default',
    className,
    ...props
}: SegmentedProps<T>) {
    const story = tone === 'story';
    return (
        <SegmentedControl<T>
            aria-label={props['aria-label']}
            value={value}
            onValueChange={(next) => {
                if (next !== null) onValueChange(next);
            }}
            className={cx(
                'relative isolate p-1',
                story ? 'rounded-full bg-white/16' : 'rounded-xl bg-sunken',
                block ? 'flex' : 'inline-flex',
                className,
            )}
        >
            <SegmentedControlIndicator
                className={cx(
                    'absolute top-(--segmented-control-indicator-top) left-(--segmented-control-indicator-left) -z-10 h-(--segmented-control-indicator-height) w-(--segmented-control-indicator-width) transition-[left,width] duration-200 ease-out motion-reduce:transition-none',
                    story
                        ? 'rounded-full bg-white'
                        : 'rounded-lg bg-surface shadow-card',
                )}
            />
            {items.map((item) => (
                <SegmentedControlItem
                    key={item.value}
                    value={item.value}
                    aria-label={item.ariaLabel}
                    className={cx(
                        'inline-flex items-center justify-center gap-1.5 px-3 text-sm whitespace-nowrap transition-colors focus-visible:outline-offset-0 [&_svg]:size-4',
                        story
                            ? 'min-h-10 rounded-full font-bold text-white/90 data-checked:text-ink'
                            : 'min-h-9 rounded-lg font-semibold text-muted data-checked:text-fg',
                        block && 'flex-1',
                    )}
                >
                    {item.label}
                </SegmentedControlItem>
            ))}
        </SegmentedControl>
    );
}
