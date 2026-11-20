import type { PublicQuestionCategory } from '@/types/quiz-public';

export const CATEGORY_PARAM = 'kategorija';

export type CategoryIndex = {
    byId: Map<number, PublicQuestionCategory>;
    children: Map<number | null, PublicQuestionCategory[]>;
};

export function indexCategories(
    categories: PublicQuestionCategory[],
): CategoryIndex {
    const byId = new Map(categories.map((category) => [category.id, category]));
    const children = new Map<number | null, PublicQuestionCategory[]>();
    for (const category of categories) {
        const parent =
            category.parentCategoryId !== null &&
            byId.has(category.parentCategoryId)
                ? category.parentCategoryId
                : null;
        const siblings = children.get(parent) ?? [];
        siblings.push(category);
        children.set(parent, siblings);
    }
    return { byId, children };
}

export function ancestorsOf(index: CategoryIndex, id: number) {
    const path: PublicQuestionCategory[] = [];
    const seen = new Set<number>([id]);
    let parentId = index.byId.get(id)?.parentCategoryId ?? null;
    while (parentId !== null && !seen.has(parentId)) {
        const parent = index.byId.get(parentId);
        if (!parent) break;
        path.unshift(parent);
        seen.add(parentId);
        parentId = parent.parentCategoryId;
    }
    return path;
}

export function parseCategoryId(value: string | null) {
    if (!value) return null;
    const id = Number(value);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export function errorMessage(cause: unknown, fallback: string) {
    return cause instanceof Error && cause.message ? cause.message : fallback;
}
