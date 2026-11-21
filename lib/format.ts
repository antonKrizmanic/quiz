const pluralRules = new Intl.PluralRules('hr-HR');
const numberFormat = new Intl.NumberFormat('hr-HR', {
    maximumFractionDigits: 2,
});

export function formatNumber(value: number) {
    return numberFormat.format(value);
}

type PluralForms = { one: string; few: string; other: string };

export function plural(count: number, forms: PluralForms) {
    const category = pluralRules.select(count);
    const word =
        category === 'one'
            ? forms.one
            : category === 'few'
              ? forms.few
              : forms.other;
    return `${formatNumber(count)} ${word}`;
}

export const questionsLabel = (count: number) =>
    plural(count, { one: 'pitanje', few: 'pitanja', other: 'pitanja' });

export const pointsLabel = (count: number) =>
    plural(count, { one: 'bod', few: 'boda', other: 'bodova' });

export const quizzesLabel = (count: number) =>
    plural(count, { one: 'kviz', few: 'kviza', other: 'kvizova' });
