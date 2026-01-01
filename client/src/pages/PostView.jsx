import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPostByIdDB } from "../services/postService";
import ClapButton from "../components/like/ClapButton";
import BookmarkButton from "../components/ui/BookmarkButton";
import FollowButton from "../components/ui/FollowButton";
import CommentList from "../components/comment/CommentList";
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";

const PostView = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostByIdDB(id, token);
        setPost(data);
      } catch (err) {
        setError(err.message || "Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, token]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "Post not found"}
        </h1>
        <Link to="/dashboard" className="text-green-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  const author = post.users || {};
  const topics = post.post_topics?.map(pt => pt.topics).filter(Boolean) || [];
  const isOwner = currentUserId === author.user_id;

  return (
    <article className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
          {post.title}
        </h1>
        
        {post.subtitle && (
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
            {post.subtitle}
          </p>
        )}

        {/* Author info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/profile/${author.user_id}`}>
              <img
                src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
                alt={author.display_name || author.username}
                className="w-12 h-12 rounded-full"
              />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Link 
                  to={`/profile/${author.user_id}`}
                  className="font-medium text-gray-900 dark:text-white hover:underline"
                >
                  {author.display_name || author.username}
                </Link>
                {!isOwner && <FollowButton userId={author.user_id} />}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{post.reading_time || 1} min read</span>
                <span>·</span>
                <span>{formatDate(post.published_at || post.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                to={`/edit/${post.post_id}`}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 border border-gray-300 dark:border-gray-600 rounded-full"
              >
                Edit
              </Link>
            )}
            <ClapButton postId={post.post_id} />
            <BookmarkButton postId={post.post_id} />
          </div>
        </div>
      </header>

      {/* Cover image */}
      {post.cover_image && (
        <figure className="mb-8 -mx-4 md:mx-0">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full max-h-[500px] object-cover md:rounded-lg"
          />
        </figure>
      )}

      {/* Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Topics */}
      {topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {topics.map((topic) => (
            <Link
              key={topic.topic_id}
              to={`/topic/${topic.slug}`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {topic.name}
            </Link>
          ))}
        </div>
      )}

      {/* Share & actions */}
      <div className="flex items-center justify-between py-6 border-t border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex items-center gap-4">
          <ClapButton postId={post.post_id} />
          <span className="text-sm text-gray-500">
            {post.comments_count || 0} responses
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={copyLink} className="p-2 text-gray-500 hover:text-gray-700">
            <FaLink size={18} />
          </button>
          <a 
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-400"
          >
            <FaTwitter size={18} />
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-600"
          >
            <FaFacebook size={18} />
          </a>
          <a 
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-gray-500 hover:text-blue-700"
          >
            <FaLinkedin size={18} />
          </a>
          <BookmarkButton postId={post.post_id} />
        </div>
      </div>

      {/* Author bio */}
      <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg mb-12">
        <Link to={`/profile/${author.user_id}`}>
          <img
            src={author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${author.username}`}
            alt={author.display_name || author.username}
            className="w-16 h-16 rounded-full"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <Link 
              to={`/profile/${author.user_id}`}
              className="text-lg font-medium text-gray-900 dark:text-white hover:underline"
            >
              {author.display_name || author.username}
            </Link>
            {!isOwner && <FollowButton userId={author.user_id} />}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {author.bio || "No bio available"}
          </p>
        </div>
      </div>

      {/* Comments */}
      <section id="comments">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Responses ({post.comments_count || 0})
        </h2>
        <CommentList postId={post.post_id} />
      </section>
    </article>
  );
};

export default PostView;
