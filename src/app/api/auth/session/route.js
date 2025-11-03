import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { generateToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Session API called')
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET)
    
    const session = await getServerSession(authOptions)
    console.log('Session from NextAuth:', session)
    
    if (!session?.user) {
      console.log('No session found')
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Generate JWT token for NextAuth users
    const token = generateToken({ 
      userId: session.user.id, 
      email: session.user.email 
    })

    console.log('Generated token successfully')

    return NextResponse.json({
      user: session.user,
      token,
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}