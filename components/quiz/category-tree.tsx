'use client';

import {
    Tree,
    TreeGroup,
    TreeItem,
    TreeItemIndicator,
    TreeItemLabel,
} from '@ui-sdk/react/tree';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ancestorsOf, type CategoryIndex } from '@/lib/categories';
import { questionsLabel } from '@/lib/format';

type CategoryTreeProps = {
    index: CategoryIndex;
    selectedId: number | null;
    labelledBy: string;
    onSelect: (id: number) => void;
};

export function CategoryTree({
    index,
    selectedId,
    labelledBy,
    onSelect,
}: CategoryTreeProps) {
    const current = selectedId === null ? null : String(selectedId);
    const ancestorIds = (id: number | null) =>
        id === null
            ? []
            : ancestorsOf(index, id).map((category) => String(category.id));
    const [expanded, setExpanded] = useState(() => ancestorIds(selectedId));
    const [revealedId, setRevealedId] = useState(selectedId);
    if (revealedId !== selectedId) {
        setRevealedId(selectedId);
        const missing = ancestorIds(selectedId).filter(
            (id) => !expanded.includes(id),
        );
        if (missing.length > 0) setExpanded([...expanded, ...missing]);
    }

    return (
        <Tree
            aria-labelledby={labelledBy}
            value={current}
            current={current}
            expanded={expanded}
            onExpandedChange={setExpanded}
            hiddenUntilFound
            onValueChange={(value) => {
                if (typeof value === 'string') onSelect(Number(value));
            }}
            className="grid gap-0.5"
        >
            <CategoryItems index={index} parentId={null} />
        </Tree>
    );
}

function CategoryItems({
    index,
    parentId,
}: {
    index: CategoryIndex;
    parentId: number | null;
}) {
    return (index.children.get(parentId) ?? []).map((category) => {
        const hasChildren = index.children.has(category.id);
        return (
            <TreeItem
                key={category.id}
                value={String(category.id)}
                label={category.name}
            >
                <TreeItemLabel className="group/row flex min-h-12 items-center gap-1 rounded-xl py-1.5 pr-2 pl-[calc((var(--tree-level)-1)*1rem)] text-[0.9375rem] text-fg transition-colors hover:bg-sunken data-selected:bg-primary-soft data-selected:font-semibold data-selected:text-primary">
                    {hasChildren ? (
                        <TreeItemIndicator className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-transform duration-150 data-expanded:rotate-90 motion-reduce:transition-none">
                            <ChevronRight
                                aria-hidden="true"
                                className="size-4"
                            />
                        </TreeItemIndicator>
                    ) : (
                        <span aria-hidden="true" className="size-9 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 leading-snug">
                        {category.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-sunken px-2 py-0.5 text-xs font-semibold text-muted tabular-nums group-data-selected/row:bg-surface group-data-selected/row:text-primary">
                        <span aria-hidden="true">
                            {category.availableQuestionCount}
                        </span>
                        <span className="sr-only">
                            , {questionsLabel(category.availableQuestionCount)}
                        </span>
                    </span>
                </TreeItemLabel>
                {hasChildren && (
                    <TreeGroup className="grid gap-0.5">
                        <CategoryItems index={index} parentId={category.id} />
                    </TreeGroup>
                )}
            </TreeItem>
        );
    });
}
