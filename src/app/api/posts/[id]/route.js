import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { validateBlogPost, sanitizeInput } from '@/lib/validation'

export const dynamic = 'force-dynamic'

// GET single post
export async function GET(request, { params }) {
  try {
    const { id } = params

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select(`
        id,
        title,
        content,
        excerpt,
        created_at,
        updated_at,
        users (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Get post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update post
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const { title, content } = await request.json()

    // Validate input
    const validation = validateBlogPost(title, content)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    // Check if post exists and user owns it
    const { data: existingPost } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to update this post' },
        { status: 403 }
      )
    }

    // Sanitize input
    const sanitizedTitle = sanitizeInput(title)
    const sanitizedContent = sanitizeInput(content)
    const excerpt = sanitizedContent.substring(0, 150) + '...'

    // Update post
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .update({
        title: sanitizedTitle,
        content: sanitizedContent,
        excerpt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        id,
        title,
        content,
        excerpt,
        created_at,
        updated_at,
        users (
          id,
          name,
          email
        )
      `)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to update post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Post updated successfully',
      post,
    })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const token = getTokenFromRequest(request)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Check if post exists and user owns it
    const { data: existingPost } = await supabaseAdmin
      .from('posts')
      .select('author_id')
      .eq('id', id)
      .single()

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    if (existingPost.author_id !== decoded.userId) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this post' },
        { status: 403 }
      )
    }

    // Delete post
    const { error } = await supabaseAdmin
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}