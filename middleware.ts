import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
    let res = NextResponse.next({
        request: {
            headers: req.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        req.cookies.set(name, value);
                    });
                    res = NextResponse.next({
                        request: req,
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    const { pathname } = req.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/admin/login'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    // Static assets and API routes - skip middleware
    if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
        return res;
    }

    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    // Log for debugging
    console.log(`[Middleware] Path: ${pathname}, Session: ${session ? 'yes' : 'no'}, Error: ${sessionError?.message || 'none'}`);

    // If user is not authenticated and trying to access protected route
    if (!session && !isPublicRoute && pathname !== '/') {
        const loginUrl = pathname.startsWith('/admin')
            ? '/admin/login'
            : '/login';
        console.log(`[Middleware] No session, redirecting to ${loginUrl}`);
        return NextResponse.redirect(new URL(loginUrl, req.url));
    }

    // If user is authenticated and trying to access login pages
    if (session && isPublicRoute) {
        // Get user role from profiles table
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        console.log(`[Middleware] Profile fetch - Role: ${profile?.role}, Error: ${profileError?.message || 'none'}`);

        const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'instructor';

        // Redirect to appropriate dashboard
        const dashboardUrl = isAdmin ? '/admin/dashboard' : '/dashboard';
        console.log(`[Middleware] Authenticated user on login page, redirecting to ${dashboardUrl}`);
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }

    // Check role-based access for admin routes
    if (session && pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        console.log(`[Middleware] Admin route check - Role: ${profile?.role}, Error: ${profileError?.message || 'none'}`);

        // If profile fetch fails, allow access (RLS issue) - the page will handle auth
        if (profileError) {
            console.log(`[Middleware] Profile fetch failed, allowing access to check on page level`);
            return res;
        }

        const isAdmin = profile?.role === 'super_admin' || profile?.role === 'admin' || profile?.role === 'instructor';

        if (!isAdmin) {
            // Redirect learners to their dashboard
            console.log(`[Middleware] Non-admin user, redirecting to /dashboard`);
            return NextResponse.redirect(new URL('/dashboard', req.url));
        }
    }

    return res;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|logo.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
