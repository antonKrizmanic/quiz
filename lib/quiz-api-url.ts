export function getPublicQuizApiUrl() {
    const configuredUrl = (
        process.env.QUIZ_API_URL ?? 'http://localhost:5010'
    ).replace(/\/+$/, '');
    return /\/api\/Quiz\/Public$/i.test(configuredUrl)
        ? configuredUrl
        : `${configuredUrl.replace(/\/api$/i, '')}/api/Quiz/Public`;
}
