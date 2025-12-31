import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopicBySlug, getPostsByTopic } from "../services/topicService";
import { followTopic, unfollowTopic } from "../services/followService";
import PostList from "../components/post/PostList";

const Topic = () => {
  const { slug } = useParams();
  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const topicData = await getTopicBySlug(slug, token);
        setTopic(topicData);
        setIsFollowing(topicData.isFollowing || false);

        if (topicData?.topic_id) {
          const postsData = await getPostsByTopic(topicData.topic_id);
          setPosts(postsData || []);
        }
      } catch (err) {
        console.error("Failed to fetch topic:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug, token]);

  const handleFollow = async () => {
    if (!token) {
      alert("Please login to follow topics");
      return;
    }

    try {
      if (isFollowing) {
        await unfollowTopic(topic.topic_id, token);
        setIsFollowing(false);
      } else {
        await followTopic(topic.topic_id, token);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Follow action failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Topic not found
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Topic header */}
      <header className="text-center mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
        {topic.image_url && (
          <img
            src={topic.image_url}
            alt={topic.name}
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
          />
        )}
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {topic.name}
        </h1>
        
        {topic.description && (
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
            {topic.description}
          </p>
        )}

        <div className="flex items-center justify-center gap-6 mb-6">
          <span className="text-gray-500">
            <span className="font-bold text-gray-900 dark:text-white">
              {topic.followers_count || 0}
            </span> followers
          </span>
          <span className="text-gray-500">
            <span className="font-bold text-gray-900 dark:text-white">
              {topic.posts_count || posts.length}
            </span> stories
          </span>
        </div>

        <button
          onClick={handleFollow}
          className={`px-6 py-2 rounded-full font-medium transition ${
            isFollowing
              ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </header>

      {/* Posts */}
      <PostList posts={posts} />
    </div>
  );
};
export default Topic;