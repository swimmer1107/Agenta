import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/auth/signin",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/history/:path*",
        "/profile/:path*",
        "/settings/:path*",
        "/agents/:path*",
        "/api/projects/:path*",
    ],
};
