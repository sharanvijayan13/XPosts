"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import PostForm from "@/components/PostForm";
import { Edit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [post, setPost] = useState(null);
  const [postLoading, setPostLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (params.id && user) {
      fetchPost();
    }
  }, [params.id, user, loading]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch post");
      }

      // Check if user is the author
      if (data.post.users.id !== user.id) {
        toast.error("You are not authorized to edit this story");
        router.push(`/posts/${params.id}`);
        return;
      }

      setPost(data.post);
    } catch (error) {
      toast.error(error.message);
      router.push("/");
    } finally {
      setPostLoading(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    router.push(`/posts/${updatedPost.id}`);
  };

  if (loading || postLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
          </div>
          <p className="text-neutral-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !post) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/posts/${post.id}`}
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to story</span>
        </Link>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-xl">
              <Edit className="h-8 w-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold gradient-text">
              Edit Your Story
            </h1>
          </div>
        </div>

        {/* Story info */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-neutral-800 mb-1">
                "{post.title}"
              </h2>
              <p className="text-sm text-neutral-600">
                Published on{" "}
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-neutral-500">Last updated</div>
              <div className="font-medium text-neutral-700">
                {new Date(post.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <PostForm post={post} onSubmit={handlePostUpdated} isEditing={true} />
    </div>
  );
}
