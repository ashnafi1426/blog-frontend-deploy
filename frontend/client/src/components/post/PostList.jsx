import { useState, useEffect } from "react";
import PostCard from "./PostCard";

const PostList = ({ posts: initialPosts = [], onUpdate, onDelete, showAuthor = true, layout = "grid" }) => {
  const [posts, setPosts] = useState(initialPosts);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  if (!posts.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
        <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <p className="text-gray-700 font-semibold text-lg mb-2">
          No stories yet
        </p>
        <p className="text-gray-500">
          Be the first to write one!
        </p>
      </div>
    );
  }

  // Grid layout
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.post_id}
            post={post}
            showAuthor={showAuthor}
            variant={index === 0 ? "featured" : "default"}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // List layout
  if (layout === "list") {
    return (
      <div className="space-y-6">
        {posts.map((post, index) => (
          <PostCard
            key={post.post_id}
            post={post}
            showAuthor={showAuthor}
            variant={index === 0 ? "featured" : "minimal"}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  // Default stacked layout
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.post_id}
          post={post}
          showAuthor={showAuthor}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default PostList;
