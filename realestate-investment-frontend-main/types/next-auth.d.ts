import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: string;
      status: string;
    };
  }

  interface User {
    id: string;
    role: string;
    status: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    status?: string;
    accessToken?: string;
  }
}
