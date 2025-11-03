import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    console.log('Debug auth API called')
    
    const session = await getServerSession(authOptions)
    console.log('Session:', session)
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user || null,
      userId: session?.user?.id || null
    })
  } catch (error) {
    console.error('Debug auth error:', error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}