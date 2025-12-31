import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostList from "../components/post/PostList";
import { getUserProfile } from "../services/userService";
import { getAllPostsDB, getFeedDB } from "../services/postService";
import { getTrendingTopics } from "../services/topicService";
import { 
  FaPen, FaBookmark, FaFileAlt, FaCog, FaFire, FaUsers, 
  FaChartLine, FaHeart, FaEye, FaComment, FaArrowRight,
  FaHome, FaHashtag
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0 });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [user, allPosts, topics] = await Promise.all([
          getUserProfile(userId, token),
          activeTab === "following" ? getFeedDB(token) : getAllPostsDB(),
          getTrendingTopics(8)
        ]);

        setProfile(user);
        setPosts(allPosts || []);
        setTrendingTopics(topics || []);
        
        const totalViews = allPosts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
        const totalLikes = allPosts?.reduce((sum, p) => sum + (p.claps_count || 0), 0) || 0;
        const totalComments = allPosts?.reduce((sum, p) => sum + (p.comments_count || 0), 0) || 0;
        setStats({ views: totalViews, likes: totalLikes, comments: totalComments });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, navigate, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar - Fixed */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
            {/* Profile Mini Card */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`}
                  alt={profile?.username}
                  className="w-12 h-12 rounded-full border-2 border-green-500"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {profile?.display_name || profile?.firstname || profile?.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">@{profile?.username}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-3">
              <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-900 bg-green-50 rounded-lg font-medium"
              >
                <FaHome className="text-green-600" size={18} />
                <span>Home Feed</span>
              </Link>
              <Link
                to="/new-story"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FaPen className="text-gray-500" size={18} />
                <span>Write Story</span>
              </Link>
              <Link
                to="/drafts"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FaFileAlt className="text-gray-500" size={18} />
                <span>My Drafts</span>
              </Link>
              <Link
                to="/bookmarks"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FaBookmark className="text-gray-500" size={18} />
                <span>Bookmarks</span>
              </Link>
              <Link
                to={`/profile/${userId}`}
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FaUsers className="text-gray-500" size={18} />
                <span>My Profile</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <FaCog className="text-gray-500" size={18} />
                <span>Settings</span>
              </Link>
            </nav>

            {/* Quick Stats */}
            <div className="p-4 border-t border-gray-100">
              <p className="px-1 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Your Stats</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <FaEye className="mx-auto text-blue-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.views}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <FaHeart className="mx-auto text-red-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.likes}</p>
                  <p className="text-xs text-gray-500">Claps</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <FaComment className="mx-auto text-green-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.comments}</p>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <FaFileAlt className="mx-auto text-purple-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{posts.length}</p>
                  <p className="text-xs text-gray-500">Stories</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-4 py-8">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl relative overflow-hidden mb-8 shadow-lg">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10 px-6 py-12 md:px-8 md:py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {profile?.firstname || profile?.username}! 👋
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  Continue your writing journey and share your stories with the world
                </p>
                <button
                  onClick={() => navigate("/new-story")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition shadow-lg"
                >
                  <FaPen size={16} />
                  Write New Story
                </button>
              </div>
            </div>

            {/* Feed Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("for-you")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition border-b-2 ${
                    activeTab === "for-you"
                      ? "text-green-600 border-green-600 bg-green-50"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaChartLine size={14} />
                  For You
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition border-b-2 ${
                    activeTab === "following"
                      ? "text-green-600 border-green-600 bg-green-50"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FaUsers size={14} />
                  Following
                </button>
              </div>
            </div>

            {/* Posts Feed */}
            <PostList posts={posts} layout="list" />
          </div>
        </main>

        {/* Right Sidebar - Fixed */}
        <aside className="hidden xl:block w-80 flex-shrink-0">
          <div className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] bg-transparent overflow-y-auto p-4">
            {/* Trending Topics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaFire className="text-orange-500" size={16} />
                  <h3 className="font-semibold text-gray-900">Trending Topics</h3>
                </div>
                <Link to="/search" className="text-xs text-green-600 hover:text-green-700 font-medium">
                  See all
                </Link>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic) => (
                    <Link
                      key={topic.topic_id}
                      to={`/topic/${topic.slug}`}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-green-100 hover:text-green-700 transition"
                    >
                      <FaHashtag size={10} />
                      {topic.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
              <div className="h-16 bg-gradient-to-r from-green-500 to-emerald-600"></div>
              <div className="px-4 pb-4">
                <img
                  src={profile?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.username}`}
                  alt={profile?.username}
                  className="w-14 h-14 rounded-full border-4 border-white -mt-7 shadow"
                />
                <h3 className="font-bold text-gray-900 mt-2">
                  {profile?.display_name || profile?.firstname || profile?.username}
                </h3>
                <p className="text-sm text-gray-500 mb-3">@{profile?.username}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {profile?.bio || "No bio yet"}
                </p>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{profile?.followersCount || 0}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-gray-900">{profile?.followingCount || 0}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
                <Link
                  to={`/profile/${userId}`}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  View Profile
                  <FaArrowRight size={10} />
                </Link>
              </div>
            </div>

            {/* Reading List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FaBookmark className="text-yellow-500" size={14} />
                  Reading List
                </h3>
                <Link to="/bookmarks" className="text-xs text-green-600 hover:text-green-700 font-medium">
                  See all
                </Link>
              </div>
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500 py-4">
                  Save stories to read later
                </p>
                <Link
                  to="/bookmarks"
                  className="text-sm text-green-600 hover:underline"
                >
                  View bookmarks →
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
