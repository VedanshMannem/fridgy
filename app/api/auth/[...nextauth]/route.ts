import NextAuth from "next-auth";
import NextAuthOptions from "next-auth";
import GoogleProvider from "next-auth/providers/google"
 
export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    debug: true,
}

const handler = NextAuth(authOptions);

export const GET = await handler;
export const POST = await handler;