import React, { useEffect, useState } from "react";
import PostForm from "../post/PostForm";
import CommentList from "../comment/CommentList";
import LikeButton from "../like/LikeButton";
import { deletePostDB, getAllPostsDB } from "../../services/postService";

const PostFeed = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(!initialPosts);

  const fetchPosts = async () => {
    try {
      const data = await getAllPostsDB();
      setPosts(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialPosts) fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("You must be logged in");

      const result = await deletePostDB(token, postId);
      if (result?.message === "Post deleted successfully") {
        setPosts(posts.filter((post) => post.post_id !== postId));
      } else {
        alert(result?.message || "Failed to delete post");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading posts...</p>;

  if (!posts.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        No posts yet. Be the first to write one!
      </p>
    );

  return (
    <div className="space-y-8">
      {editingPost && (
        <PostForm post={editingPost} onSuccess={() => setEditingPost(null)} />
      )}

      {posts.map((post) => (
        <div key={post.post_id} className="post-card">
          <div className="flex justify-between items-start mb-3">
            <h2>{post.title}</h2>
            <small className="text-gray-400">
              By {post.users?.username || "Unknown"}
            </small>
          </div>

          <p>{post.content}</p>

          <div className="post-actions mt-3">
            <LikeButton postId={post.post_id} />
            {localStorage.getItem("token") && (
              <>
                <button
                  onClick={() => setEditingPost(post)}
                  className="px-3 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition ml-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.post_id)}
                  className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 transition ml-2"
                >
                  Delete
                </button>
              </>
            )}
          </div>

          <CommentList postId={post.post_id} />
        </div>
      ))}
    </div>
  );
};
export default PostFeed;
