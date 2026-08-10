import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        // User is authenticated, allow request
        return;
    },
    {
        pages: {
            signIn: "logsignup/login",
        },
    }
);

export const config = {
    matcher: [
        "/mainarea/:path*",
    ],
};