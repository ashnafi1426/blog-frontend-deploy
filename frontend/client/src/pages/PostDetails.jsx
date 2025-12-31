import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getComments, addComment, updateComment, deleteComment } from "../services/CommentService";
import CommentForm from "../components/comment/CommentForm";
import CommentList from "../components/comment/CommentList";

const PostDetails = () => {
  const { postId } = useParams();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(postId, token);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const handleAddComment = async (content) => {
    try {
      const newComment = await addComment(postId, content, token);
      if (newComment) setComments((prev) => [...prev, newComment]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateComment = async (id, content) => {
    try {
      const updated = await updateComment(id, content, token);
      if (updated) setComments((prev) => prev.map((c) => (c.comment_id === id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (id) => {
    try {
      await deleteComment(id, token);
      setComments((prev) => prev.filter((c) => c.comment_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading comments...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 mt-6">
      <h2 className="text-xl font-bold mb-4">Comments</h2>
      <CommentForm postId={postId} onSuccess={fetchComments} />
      <div className="mt-4 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-800">
                  {comment.users?.username || "Anonymous"}
                </span>
                {String(comment.user_id) === String(currentUserId) && (
                  <div className="flex gap-2 text-xs text-gray-500">
                    <button onClick={() => handleUpdateComment(comment.comment_id, comment.content)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment.comment_id)} className="text-red-500">
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{ __html: comment.content }}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetails;
