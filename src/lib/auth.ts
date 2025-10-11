import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * NextAuth.js v5 (Auth.js) Configuration
 *
 * Simple email/password authentication for single user app
 * Credentials stored in environment variables
 */

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Simple Email/Password Authentication
    // For single user app - credentials stored in environment variables
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check against environment variables (single user)
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@socialcat.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          return {
            id: '1',
            email: adminEmail,
            name: 'Admin',
          };
        }

        return null;
      },
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },

  callbacks: {
    async signIn({ user, account }) {
      // You can add custom logic here, e.g., check if user is allowed
      console.log('🔐 Sign in:', { user: user.email, provider: account?.provider });
      return true;
    },

    async session({ session, token }) {
      // Add user id to session
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },

    async jwt({ token, user }) {
      // Add user id to token on first sign in
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: process.env.NODE_ENV === 'development',
});
