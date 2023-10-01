
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/',
  },
  // Your additional configuration options go here
});

export const config = {
    matcher: '/dashboard/:path*',
};

