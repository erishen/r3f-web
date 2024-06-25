import { NextResponse, userAgent } from 'next/server'

export function middleware(request) {
    const url = request.nextUrl
    const { device } = userAgent(request)
    // console.log('middleware', device, url)

    const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
    url.searchParams.set('viewport', viewport)
    return NextResponse.rewrite(url)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        {
            source: '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\..*).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
}