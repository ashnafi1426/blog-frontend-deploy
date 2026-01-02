import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import PostList from "../components/post/PostList";
import FollowButton from "../components/ui/FollowButton";
import { getUserProfile, getUserPosts, getUserStats } from "../services/userService";
import { getAllPostsDB, getFeedDB } from "../services/postService";
import { getTrendingTopics } from "../services/topicService";
import { getFollowCounts, getFollowing, followUser } from "../services/followService";
import { 
  FaPen, FaBookmark, FaFileAlt, FaCog, FaFire, FaUsers, 
  FaChartLine, FaHeart, FaEye, FaComment, FaArrowRight,
  FaHome, FaHashtag, FaUserPlus
} from "react-icons/fa";
const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userPostsCount, setUserPostsCount] = useState(0);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("for-you");
  const [stats, setStats] = useState({ views: 0, likes: 0, comments: 0 });
  const [followingUsers, setFollowingUsers] = useState([]);

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
        // Fetch following users first
        const followingData = await getFollowing(userId, token).catch(() => []);
        const followingUserIds = followingData?.map(u => u.user_id) || [];
        setFollowingUsers(followingUserIds);

        // Fetch posts based on active tab
        let postsData = [];
        try {
          if (activeTab === "following") {
            // For "Following" tab, get feed from users they follow
            postsData = await getFeedDB(token);
          } else {
            // For "For You" tab, get all posts
            postsData = await getAllPostsDB();
          }
        } catch (postError) {
          console.error("Error fetching posts:", postError);
          postsData = [];
        }

        // Fetch other data
        const [user, userPosts, topics] = await Promise.all([
          getUserProfile(userId, token).catch(err => {
            console.error("Error fetching user profile:", err);
            return null;
          }),
          getUserPosts(userId, token).catch(err => {
            console.error("Error fetching user posts:", err);
            return [];
          }),
          getTrendingTopics(8).catch(err => {
            console.error("Error fetching trending topics:", err);
            return [];
          })
        ]);

        setProfile(user);
        setPosts(Array.isArray(postsData) ? postsData : []);
        setTrendingTopics(topics || []);
        
        // Use stats from user profile
        console.log("User profile with stats:", user);
        const userStats = user?.stats || {};
        setStats({ 
          views: userStats.totalViews || 0, 
          likes: userStats.totalClaps || 0, 
          comments: userStats.totalComments || 0 
        });
        setUserPostsCount(userStats.totalPosts || 0);

        // Get suggested users (users with most followers, excluding current user and already following)
        const allUsers = (Array.isArray(postsData) ? postsData : [])?.map(p => p.users).filter(Boolean) || [];
        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.user_id, u])).values());
        const suggested = uniqueUsers
          .filter(u => u.user_id !== userId && !followingUserIds.includes(u.user_id))
          .slice(0, 5);
        setSuggestedUsers(suggested);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId, navigate, activeTab]);

  const handleFollowUser = async (targetUserId) => {
    try {
      await followUser(targetUserId, token);
      setFollowingUsers([...followingUsers, targetUserId]);
      setSuggestedUsers(suggestedUsers.filter(u => u.user_id !== targetUserId));
    } catch (err) {
      console.error("Failed to follow user:", err);
    }
  };

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
                <div className="bg-blue-50 rounded-lg p-3 text-center hover:bg-blue-100 transition">
                  <FaEye className="mx-auto text-blue-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.views}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center hover:bg-red-100 transition">
                  <FaHeart className="mx-auto text-red-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.likes}</p>
                  <p className="text-xs text-gray-500">Claps</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center hover:bg-green-100 transition">
                  <FaComment className="mx-auto text-green-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{stats.comments}</p>
                  <p className="text-xs text-gray-500">Comments</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center hover:bg-purple-100 transition">
                  <FaFileAlt className="mx-auto text-purple-500 mb-1" size={16} />
                  <p className="text-lg font-bold text-gray-900">{userPostsCount}</p>
                  <p className="text-xs text-gray-500">Stories</p>
                </div>
              </div>
            </div>

            {/* User Status */}
            <div className="p-4 border-t border-gray-100">
              <p className="px-1 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Status</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900 truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">Member Since</span>
                  <span className="text-sm font-medium text-gray-900">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm text-green-700 font-medium">✓ Active</span>
                  <span className="text-xs text-green-600">Online</span>
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
            {/* Suggested Users */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaUserPlus className="text-blue-500" size={16} />
                  <h3 className="font-semibold text-gray-900">People to Follow</h3>
                </div>
              </div>
              <div className="p-4">
                {suggestedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No suggestions available</p>
                ) : (
                  <div className="space-y-3">
                    {suggestedUsers.map((user) => (
                      <div key={user.user_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <Link to={`/profile/${user.user_id}`} className="flex items-center gap-2 flex-1 min-w-0">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-8 h-8 rounded-full"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.display_name || user.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                          </div>
                        </Link>
                        <FollowButton 
                          userId={user.user_id}
                          size="sm"
                          onFollowChange={(isFollowing) => {
                            if (isFollowing) {
                              setFollowingUsers([...followingUsers, user.user_id]);
                              setSuggestedUsers(suggestedUsers.filter(u => u.user_id !== user.user_id));
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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
                <p className="text-sm text-gray-500 mb-1">@{profile?.username}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-green-600 font-medium">Active</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {profile?.bio || "No bio yet"}
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition">
                    <p className="text-lg font-bold text-gray-900">{userPostsCount}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition">
                    <p className="text-lg font-bold text-gray-900">{profile?.followersCount || 0}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 text-center hover:bg-gray-100 transition">
                    <p className="text-lg font-bold text-gray-900">{profile?.followingCount || 0}</p>
                    <p className="text-xs text-gray-500">Following</p>
                  </div>
                </div>
                <Link
                  to={`/profile/${userId}`}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  View Full Profile
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
