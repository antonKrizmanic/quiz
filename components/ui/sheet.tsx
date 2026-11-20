import {
    DrawerBackdrop,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
} from '@ui-sdk/react/drawer';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from '@/lib/cx';

export {
    createDrawerController as createSheetController,
    Drawer as Sheet,
    DrawerClose as SheetClose,
    DrawerTrigger as SheetTrigger,
} from '@ui-sdk/react/drawer';

type SheetContentProps = Omit<
    ComponentProps<typeof DrawerContent>,
    'className' | 'children' | 'title'
> & {
    title: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
};

export function SheetContent({
    title,
    description,
    footer,
    children,
    className,
    ...props
}: SheetContentProps) {
    return (
        <>
            <DrawerBackdrop className="fixed inset-0 bg-black/50" />
            <DrawerContent
                {...props}
                className={cx(
                    'mx-auto flex max-h-[min(88dvh,calc(var(--visual-viewport-height,100dvh)-1rem))] w-full max-w-lg flex-col rounded-t-3xl bg-surface text-fg shadow-2xl outline-none',
                    'after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-[50vh] after:bg-surface',
                    className,
                )}
            >
                <div
                    aria-hidden="true"
                    className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-control/50"
                />
                <div className="shrink-0 px-5 pt-3 pb-3">
                    <DrawerTitle className="text-lg font-bold tracking-tight text-balance">
                        {title}
                    </DrawerTitle>
                    {description && (
                        <DrawerDescription className="mt-1 text-sm text-muted">
                            {description}
                        </DrawerDescription>
                    )}
                </div>
                <div
                    className={cx(
                        'min-h-0 flex-1 overflow-y-auto overscroll-contain px-5',
                        footer
                            ? 'pb-4'
                            : 'pb-[max(1.25rem,env(safe-area-inset-bottom))]',
                    )}
                >
                    {children}
                </div>
                {footer && (
                    <div className="shrink-0 border-t border-line px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {footer}
                    </div>
                )}
            </DrawerContent>
        </>
    );
}
