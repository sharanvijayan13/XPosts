'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch post')
      }

      setPost(data.post)
    } catch (error) {
      toast.error(error.message)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete post')
      }

      toast.success('Post deleted successfully')
      router.push('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    )
  }

  const isAuthor = user && user.id === post.users.id

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to posts</span>
        </Link>
      </div>

      <article className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>{post.users.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              {post.updated_at !== post.created_at && (
                <span className="text-xs text-gray-400">
                  (Updated {formatDate(post.updated_at)})
                </span>
              )}
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center space-x-2 ml-4">
              <Link 
                href={`/posts/${post.id}/edit`}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </Link>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div className="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  )
}