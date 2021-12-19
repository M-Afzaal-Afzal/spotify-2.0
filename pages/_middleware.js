import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";

export async function middleware(req) {

    // TOKEN EXISTS IF THE USER LOGGED IN
    const token = await getToken({req,secret: process.env.JWT_SECRET});

    const {pathname} = req.nextUrl;

    // ALLOW THE REQUESTS IF THE FOLLOWING SI TRUE
    //1. IF THE TOKEN EXISTS, ALLOW REQUEST
    if (pathname.includes('/api/auth') || token) {
    return NextResponse.next();
    }

    if (!token && pathname !== '/login') {
        return NextResponse.redirect('/login');
    }

}