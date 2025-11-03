"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import PostCard from "@/components/PostCard";
import Logo from "@/components/Logo";
import { Feather } from "lucide-react";

export default function HomePage() {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch posts");
      }

      setPosts(data.posts);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!token) {
      toast.error("Please login to delete posts");
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete post");
      }

      setPosts(posts.filter((post) => post.id !== postId));
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600 animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-secondary-50/30 to-accent-100/50 rounded-3xl"></div>
        <div className="relative text-center py-20 px-8">
          <div className="flex justify-center mb-6">
            <Logo size="xl" showText={false} />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Welcome to XPosts</span>
          </h1>

          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Where every voice is heard. Discover inspiring posts, share your
            journey, and connect with a community of passionate creators.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {token ? (
              <a
                href="/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Feather className="h-5 w-5" />
                <span>Write your blog</span>
              </a>
            ) : (
              <>
                <a
                  href="/register"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <span>Join the Community</span>
                </a>
                <a
                  href="/login"
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <span>Sign In</span>
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Latest Posts
            </h2>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full blur-lg opacity-20"></div>
            </div>

            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              No posts yet
            </h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Write your first post and pour your heart out.
            </p>

            {token ? (
              <a
                href="/create"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Feather className="h-5 w-5" />
                <span>Write your first blog</span>
              </a>
            ) : (
              <a
                href="/register"
                className="btn-primary inline-flex items-center space-x-2"
              >
                <span>Join to Write</span>
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <div
                key={post.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PostCard post={post} onDelete={handleDeletePost} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button for mobile */}
      {token && (
        <a href="/create" className="floating-action md:hidden">
          <Feather className="h-6 w-6" />
        </a>
      )}
    </div>
  );
}
