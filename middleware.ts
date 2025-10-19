import { type NextRequest, NextResponse } from 'next/server';

const HOST_TO_CITY: Record<string, string> = {
    'www.kviz.gdckapp.com': 'buje',
    'www.kviz.bnm.gdckapp.com': 'bnm',
    localhost: 'buje',
    '127.0.0.1': 'bnm',
};

const VALID_CITIES = new Set(['buje', 'bnm']);

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const host = request.headers.get('host')?.split(':')[0] || '';

    // Allow override via query param for local/tests: ?city=buje|bnm
    const cityParam = url.searchParams.get('city');
    let city = cityParam && VALID_CITIES.has(cityParam) ? cityParam : undefined;
    if (!city) {
        city = HOST_TO_CITY[host] || 'buje';
    }

    const response = NextResponse.next();
    const existing = request.cookies.get('city');
    if (!existing || existing.value !== city) {
        response.cookies.set('city', city, {
            path: '/',
            httpOnly: false,
        });
    }
    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/|api/).*)'],
};
