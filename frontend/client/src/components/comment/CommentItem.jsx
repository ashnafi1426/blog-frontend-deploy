import { useState } from "react";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { updateComment, deleteComment, clapComment } from "../../services/CommentService";
import { FaHandsClapping } from "react-icons/fa6";
import { FaReply, FaEdit, FaTrash } from "react-icons/fa";
import CommentForm from "./CommentForm";

const CommentItem = ({ comment, onDelete, onUpdate, isReply = false, postId }) => {
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [clapsCount, setClapsCount] = useState(comment.claps_count || 0);
  const [isClapping, setIsClapping] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const isOwner = String(comment.user_id) === String(currentUserId);
  const author = comment.users || {};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000;

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleClap = async () => {
    if (!token) {
      alert("Please login to clap");
      return;
    }
    if (isClapping) return;
    
    setIsClapping(true);
    try {
      const result = await clapComment(comment.comment_id, token);
      setClapsCount(result.claps_count || clapsCount + 1);
    } catch (err) {
      console.log("Could not clap:", err.message);
      if (err.message?.includes("Invalid token") || err.message?.includes("expired")) {
        alert("Your session has expired. Please login again.");
      }
    } finally {
      setIsClapping(false);
    }
  };

  const handleUpdate = async () => {
    const stripped = content?.replace(/<[^>]*>/g, "").trim();
    if (!stripped) return;
    setLoading(true);
    try {
      await updateComment(comment.comment_id, content, token);
      setEditing(false);
      onUpdate?.();
    } catch (err) {
      alert(err.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this response?")) return;
    setLoading(true);
    try {
      await deleteComment(comment.comment_id, token);
      onDelete?.();
    } catch (err) {
      alert(err.message || "Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline"],
      ["blockquote", "code-block"],
      ["link"],
      [{ color: [] }, { background: [] }],
    ],
  };

  return (
    <div className={`group ${isReply ? "py-4" : "py-6"}`}>
      {/* Comment Card */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Link to={`/profile/${author.user_id}`} className="flex-shrink-0">
            <img
              src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
              alt={author.username}
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${author.user_id}`}
              className="font-semibold text-gray-900 hover:text-green-600 transition"
            >
              {author.display_name || author.username || "Anonymous"}
            </Link>
            <p className="text-sm text-gray-500">
              {formatDate(comment.created_at)}
            </p>
          </div>
        </div>

        {/* Content */}
        {editing ? (
          <div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg">
              <ReactQuill
                value={content}
                onChange={setContent}
                modules={quillModules}
                formats={["bold", "italic", "underline", "blockquote", "code-block", "link", "color", "background"]}
                theme="snow"
                className="comment-editor-dark"
              />
              <div className="flex items-center justify-end gap-2 px-4 py-3 bg-gray-800 border-t border-gray-700">
                <button
                  onClick={() => {
                    setEditing(false);
                    setContent(comment.content);
                  }}
                  className="px-4 py-2 text-gray-400 text-sm font-medium hover:text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Comment content */}
            <div
              className="comment-content text-gray-800 text-base leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: comment.content }}
            />

            {/* Actions */}
            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              {/* Clap button */}
              <button 
                onClick={handleClap}
                disabled={!token || isClapping}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  clapsCount > 0 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                } ${!token ? "cursor-not-allowed opacity-50" : "hover:scale-105"}`}
                title={token ? "Clap for this response" : "Sign in to clap"}
              >
                <FaHandsClapping 
                  size={16} 
                  className={isClapping ? "animate-bounce" : ""}
                />
                <span>{clapsCount}</span>
              </button>

              {/* Reply button */}
              {!isReply && token && (
                <button
                  onClick={() => setReplying(!replying)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                    replying 
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  <FaReply size={14} />
                  <span>Reply</span>
                </button>
              )}

              {/* Owner actions */}
              {isOwner && token && (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-blue-100 hover:text-blue-700 transition"
                  >
                    <FaEdit size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700 transition"
                  >
                    <FaTrash size={12} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Reply form */}
      {replying && (
        <div className="mt-4 ml-6">
          <CommentForm
            postId={postId || comment.post_id}
            parentId={comment.comment_id}
            onSuccess={() => {
              setReplying(false);
              onUpdate?.();
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
