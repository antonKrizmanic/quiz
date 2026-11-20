import { Meter, MeterIndicator, MeterTrack } from '@ui-sdk/react/meter';
import {
    Progress,
    ProgressIndicator,
    ProgressTrack,
} from '@ui-sdk/react/progress';
import { cx } from '@/lib/cx';

type BarProps = {
    value: number;
    max: number;
    label: string;
    valueLabel: string;
    className?: string;
};

export function ProgressBar({
    value,
    max,
    label,
    valueLabel,
    className,
}: BarProps) {
    return (
        <Progress
            aria-label={label}
            value={value}
            min={0}
            max={max}
            getValueLabel={() => valueLabel}
            className={className}
        >
            <ProgressTrack className="h-1.5 overflow-hidden rounded-full bg-sunken">
                <ProgressIndicator className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out motion-reduce:transition-none" />
            </ProgressTrack>
        </Progress>
    );
}

export function ScoreMeter({
    value,
    max,
    label,
    valueLabel,
    tone,
    className,
}: BarProps & { tone: 'success' | 'primary' }) {
    return (
        <Meter
            aria-label={label}
            value={value}
            min={0}
            max={max}
            getValueLabel={() => valueLabel}
            className={className}
        >
            <MeterTrack className="h-3 overflow-hidden rounded-full bg-sunken">
                <MeterIndicator
                    className={cx(
                        'h-full rounded-full',
                        tone === 'success' ? 'bg-success' : 'bg-primary',
                    )}
                />
            </MeterTrack>
        </Meter>
    );
}
