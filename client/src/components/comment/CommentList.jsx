import { useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { getComments } from "../../services/CommentService";
import { FaComments } from "react-icons/fa";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(postId, token);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {token ? (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a response</h3>
          <CommentForm postId={postId} onSuccess={fetchComments} />
        </div>
      ) : (
        <div className="mb-8 p-6 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl text-center border border-gray-200">
          <FaComments className="mx-auto text-gray-400 mb-3" size={32} />
          <p className="text-gray-700 font-medium">
            <a href="/login" className="text-green-600 hover:text-green-700 hover:underline">
              Sign in
            </a>
            {" "}to join the conversation
          </p>
        </div>
      )}

      {/* Section title */}
      {comments.length > 0 && (
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-3">
          {comments.length} {comments.length === 1 ? "Response" : "Responses"}
        </h3>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* No comments */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
            <FaComments className="text-gray-400" size={24} />
          </div>
          <p className="text-gray-700 font-medium">
            No responses yet
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Comments */}
      {!loading && comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.comment_id}>
              <CommentItem
                comment={comment}
                postId={postId}
                onDelete={fetchComments}
                onUpdate={fetchComments}
              />
              
              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="ml-8 mt-2 pl-4 border-l-3 border-green-300 space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.comment_id}
                      comment={reply}
                      postId={postId}
                      onDelete={fetchComments}
                      onUpdate={fetchComments}
                      isReply
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;
