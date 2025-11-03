import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback triggered:', { user: user.email, provider: account?.provider })
      
      if (account?.provider === 'google') {
        try {
          console.log('Processing Google sign-in for:', user.email)
          
          // For now, just allow the sign-in without database operations
          // We'll add database integration once basic auth works
          user.dbId = user.id // Use Google ID temporarily
          
          return true
        } catch (error) {
          console.error('Sign in error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.dbId = user.dbId
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.dbId
      return session
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }