import { useState } from "react";
import { Link } from "react-router-dom";
import ClapButton from "../like/ClapButton";
import BookmarkButton from "../ui/BookmarkButton";
import FollowButton from "../ui/FollowButton";
import CommentForm from "../comment/CommentForm";
import { FaRegComment, FaRegClock } from "react-icons/fa";

const PostCard = ({ post, showAuthor = true, variant = "default" }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const author = post.users || {};
  const topics = post.post_topics?.map(pt => pt.topics).filter(Boolean) || [];
  
  // Use post_number if available, fallback to post_id
  const postUrl = post.post_number ? `/post/${post.post_number}` : `/post/${post.post_id}`;
  
  const getPreview = (html, maxLength = 120) => {
    const text = html?.replace(/<[^>]*>/g, '') || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Different card styles based on variant
  const cardStyles = {
    default: "bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300",
    featured: "bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300",
    minimal: "bg-gray-800 border border-gray-700 rounded-xl p-5 hover:bg-gray-750 hover:shadow-md transition-all duration-300",
  };

  return (
    <article className={`group ${cardStyles[variant] || cardStyles.default}`}>
      {/* Cover image - full width on top if exists */}
      {post.cover_image && (
        <Link to={postUrl} className="block mb-4 -mx-6 -mt-6">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        </Link>
      )}

      {/* Author info */}
      {showAuthor && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${author.user_id}`}>
              <img
                src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
                alt={author.display_name || author.username}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </Link>
            <div>
              <Link 
                to={`/profile/${author.user_id}`}
                className="font-semibold text-white hover:text-green-400 transition block"
              >
                {author.display_name || author.username}
              </Link>
              <span className="text-sm text-gray-400">
                {formatDate(post.published_at || post.created_at)}
              </span>
            </div>
          </div>
          <FollowButton 
            userId={author.user_id} 
            size="sm" 
            variant="outline"
            className="bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
          />
        </div>
      )}

      {/* Title */}
      <Link to={postUrl}>
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
          {post.title || "Untitled"}
        </h2>
      </Link>

      {/* Subtitle or preview */}
      <Link to={postUrl}>
        <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
          {post.subtitle || getPreview(post.content)}
        </p>
      </Link>

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {topics.slice(0, 3).map((topic) => (
            <Link 
              key={topic.topic_id || topic.slug}
              to={`/topic/${topic.slug}`}
              className="px-3 py-1 bg-gray-700 text-gray-200 text-xs font-medium rounded-full hover:bg-green-600 hover:text-white transition"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      )}

      {/* Comments Preview */}
      {post.comments && post.comments.length > 0 && (
        <div className="mb-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase">Recent Comments</p>
          <div className="space-y-2">
            {post.comments.slice(0, 2).map((comment, idx) => (
              <div key={idx} className="text-sm">
                <p className="font-medium text-gray-200">
                  {comment.users?.display_name || comment.users?.username || 'Anonymous'}
                </p>
                <p className="text-gray-400 line-clamp-2">
                  {comment.content}
                </p>
              </div>
            ))}
            {post.comments.length > 2 && (
              <p className="text-xs text-gray-500 pt-1">
                +{post.comments.length - 2} more comment{post.comments.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Comment Form Toggle */}
      {showCommentForm && (
        <div className="mb-4">
          <CommentForm 
            postId={post.post_id}
            onSuccess={() => {
              setShowCommentForm(false);
              // Optionally refresh comments here
            }}
            onCancel={() => setShowCommentForm(false)}
          />
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <FaRegClock size={14} />
            {post.reading_time || 1} min
          </span>
          <button
            onClick={() => setShowCommentForm(!showCommentForm)}
            className="flex items-center gap-1 hover:text-green-400 transition cursor-pointer"
          >
            <FaRegComment size={14} />
            {post.comments_count || 0}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ClapButton postId={post.post_id} />
          <Link
            to={`/post/${post.post_id}`}
            className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
          >
            Read Story
          </Link>
          <BookmarkButton postId={post.post_id} />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
