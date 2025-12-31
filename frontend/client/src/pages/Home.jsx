import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostList from "../components/post/PostList";
import { getAllPostsDB } from "../services/postService";
import { getTrendingTopics } from "../services/topicService";
import { FaPen, FaFire, FaBookOpen } from "react-icons/fa";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsData, topicsData] = await Promise.all([
          getAllPostsDB(),
          getTrendingTopics(8)
        ]);
        setPosts(postsData || []);
        setTrendingTopics(topicsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Where good ideas find you.
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
              Read and share new perspectives on just about any topic. Everyone's welcome.
            </p>
            {!isLoggedIn ? (
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="px-8 py-3 bg-white text-green-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                >
                  Get started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full text-lg font-semibold hover:bg-white/10 transition"
                >
                  Sign in
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/new-story")}
                className="px-8 py-3 bg-white text-green-600 rounded-full text-lg font-semibold hover:bg-gray-100 transition shadow-lg flex items-center gap-2"
              >
                <FaPen size={16} />
                Write a story
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="bg-white border-b border-gray-200 py-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 whitespace-nowrap">
              <FaFire className="text-orange-500" />
              Trending:
            </span>
            {trendingTopics.map((topic) => (
              <Link
                key={topic.topic_id}
                to={`/topic/${topic.slug}`}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full whitespace-nowrap hover:bg-green-100 hover:text-green-700 transition"
              >
                {topic.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaBookOpen className="text-green-600" />
            Latest Stories
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-full">
              All
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-300 transition">
              Popular
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-300 transition">
              Recent
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <PostList posts={posts} layout="grid" />

        {/* Sidebar for larger screens */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Discover topics */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              Discover Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.slice(0, 8).map((topic) => (
                <Link
                  key={topic.topic_id}
                  to={`/topic/${topic.slug}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full hover:bg-green-100 hover:text-green-700 transition"
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CTA for non-logged in users */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-xl mb-2">
                Start Writing Today
              </h3>
              <p className="text-green-100 mb-4">
                Share your ideas with millions of readers.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-3 bg-white text-green-600 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Create account
              </button>
            </div>
          )}

          {/* Stats or info */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              Community
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Stories</span>
                <span className="font-bold text-gray-900">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Topics</span>
                <span className="font-bold text-gray-900">{trendingTopics.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
