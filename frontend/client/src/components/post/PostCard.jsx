import { Link } from "react-router-dom";
import ClapButton from "../like/ClapButton";
import BookmarkButton from "../ui/BookmarkButton";
import { FaRegComment, FaRegClock } from "react-icons/fa";

const PostCard = ({ post, showAuthor = true, variant = "default" }) => {
  const author = post.users || {};
  const topics = post.post_topics?.map(pt => pt.topics).filter(Boolean) || [];
  
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
        <Link to={`/post/${post.post_id}`} className="block mb-4 -mx-6 -mt-6">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-2xl"
          />
        </Link>
      )}

      {/* Author info */}
      {showAuthor && (
        <div className="flex items-center gap-3 mb-4">
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
      )}

      {/* Title */}
      <Link to={`/post/${post.post_id}`}>
        <h2 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
          {post.title || "Untitled"}
        </h2>
      </Link>

      {/* Subtitle or preview */}
      <Link to={`/post/${post.post_id}`}>
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <FaRegClock size={14} />
            {post.reading_time || 1} min
          </span>
          <Link 
            to={`/post/${post.post_id}#comments`}
            className="flex items-center gap-1 hover:text-green-400 transition"
          >
            <FaRegComment size={14} />
            {post.comments_count || 0}
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <ClapButton postId={post.post_id} />
          <BookmarkButton postId={post.post_id} />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
