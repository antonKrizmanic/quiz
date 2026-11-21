import {
    AlertDialog,
    AlertDialogBackdrop,
    AlertDialogClose,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from '@ui-sdk/react/alert-dialog';
import type { ComponentProps, ReactNode } from 'react';
import { buttonClass, PendingIcon } from './button';
import { Notice } from './notice';

export { createAlertDialogController } from '@ui-sdk/react/alert-dialog';

type ConfirmDialogProps = {
    controller: ComponentProps<typeof AlertDialog>['controller'];
    title: ReactNode;
    description: ReactNode;
    cancelLabel: string;
    confirmLabel: string;
    confirmIcon: Parameters<typeof PendingIcon>[0]['icon'];
    pendingAnnouncement: string;
    error?: string | null;
    onConfirm: () => Promise<void>;
};

export function ConfirmDialog({
    controller,
    title,
    description,
    cancelLabel,
    confirmLabel,
    confirmIcon,
    pendingAnnouncement,
    error,
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <AlertDialog
            controller={controller}
            pendingAnnouncement={pendingAnnouncement}
        >
            <AlertDialogBackdrop className="fixed inset-0 bg-black/45 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
            <AlertDialogContent className="fixed inset-x-0 top-auto bottom-0 mx-auto mb-[max(1rem,env(safe-area-inset-bottom))] h-fit w-[min(calc(100%-2rem),26rem)] rounded-3xl sm:inset-0 sm:m-auto bg-surface p-6 text-fg shadow-2xl transition-[opacity,translate,scale] duration-200 ease-out outline-none data-ending-style:translate-y-2 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none">
                <AlertDialogTitle className="text-xl font-bold tracking-tight text-balance">
                    {title}
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-2 text-muted">
                    {description}
                </AlertDialogDescription>
                {error && (
                    <Notice tone="danger" className="mt-4">
                        {error}
                    </Notice>
                )}
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <AlertDialogClose
                        className={buttonClass({
                            variant: 'secondary',
                            size: 'lg',
                        })}
                    >
                        {cancelLabel}
                    </AlertDialogClose>
                    <AlertDialogClose
                        value="confirm"
                        action={onConfirm}
                        className={buttonClass({ size: 'lg' })}
                    >
                        <PendingIcon icon={confirmIcon} />
                        {confirmLabel}
                    </AlertDialogClose>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}
