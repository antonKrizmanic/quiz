import { type NextRequest, NextResponse } from 'next/server';
import { cityForHost } from '@/lib/city-config';

export function proxy(request: NextRequest) {
    const city = cityForHost(request.headers.get('host'));
    const headers = new Headers(request.headers);
    headers.set('x-quiz-city', city);
    const response = NextResponse.next({ request: { headers } });
    response.cookies.set('city', city, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
    });
    return response;
}

export const config = {
    matcher: ['/', '/quiz/:path*'],
};
