import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail, verifyPassword, getUserById } from '@/lib/db/models/User';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    console.log('🔐 Authorization attempt for:', credentials?.email);

                    if (!credentials?.email || !credentials?.password) {
                        console.log('❌ Missing credentials');
                        throw new Error('Email and password required');
                    }

                    const user = await findUserByEmail(credentials.email);
                    if (!user) {
                        console.log('❌ User not found');
                        throw new Error('No user found with this email');
                    }

                    const isValid = await verifyPassword(user, credentials.password);
                    if (!isValid) {
                        console.log('❌ Invalid password');
                        throw new Error('Invalid password');
                    }

                    console.log('✅ Authorization successful');
                    return {
                        id: user._id!.toString(),
                        email: user.email,
                        name: user.name,
                    };
                } catch (error: any) {
                    console.error('❌ Authorization error:', error.message);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                console.log('✅ JWT token created for user:', user.email);
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                console.log('✅ Session created for user:', session.user.email);
            }
            return session;
        },
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signin',
        error: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
