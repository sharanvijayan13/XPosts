"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PostForm from "@/components/PostForm";
import { Feather, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handlePostCreated = (post) => {
    router.push(`/posts/${post.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>{" "}
          </div>
          <p className="text-neutral-600 animate-pulse">
            Preparing your board...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>

        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-sm opacity-75"></div>
            <div className="relative bg-gradient-to-r from-primary-600 to-secondary-600 p-3 rounded-xl">
              <Feather className="h-8 w-8 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold gradient-text">Add Blog</h1>
            <p className="text-neutral-600 mt-2">
              Write from your heart and share your experiences
            </p>
          </div>
        </div>

        {/* Writing tips */}
      </div>

      {/* Form */}
      <PostForm onSubmit={handlePostCreated} />
    </div>
  );
}
