import React from "react";
import "./PostList.css"
const PostItem = ({ post, token, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post.post_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    onDelete(post.post_id);
  };

  return (
    <div className="post-card-dark p-6 rounded-2xl mb-6 shadow-md hover:shadow-lg transition duration-300">
      <h3 className="text-2xl font-bold text-white mb-2">{post.title}</h3>
      <div
        className="text-gray-200 mb-2"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <p className="text-sm text-gray-400 mb-4">By: {post.users?.username || "Unknown"}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(post)}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-medium transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PostItem;
