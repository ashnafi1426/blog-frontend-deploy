import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, getUserPosts } from "../services/userService";
import { getFollowCounts } from "../services/followService";
import FollowButton from "../components/ui/FollowButton";
import PostList from "../components/post/PostList";
import { 
  FaMapMarkerAlt, FaCalendarAlt, FaLink, FaTwitter, 
  FaGithub, FaLinkedin, FaEdit, FaEye, FaHeart, 
  FaComment, FaFileAlt, FaUsers, FaUserFriends 
} from "react-icons/fa";

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followCounts, setFollowCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isOwnProfile = userId === currentUserId;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const [userProfile, userPosts, counts] = await Promise.all([
          getUserProfile(userId, token).catch(() => null),
          getUserPosts(userId, token).catch(() => []),
          getFollowCounts(userId).catch(() => ({ followers: 0, following: 0 }))
        ]);

        setProfile(userProfile);
        setPosts(userPosts || []);
        setFollowCounts(counts);
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, token]);

  const handleFollowChange = (isFollowing) => {
    setFollowCounts(prev => ({
      ...prev,
      followers: prev.followers + (isFollowing ? 1 : -1)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600">The user you're looking for doesn't exist.</p>
          <Link to="/" className="text-green-600 hover:underline mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const stats = profile.stats || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>

          {/* Profile Info */}
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Avatar */}
              <img
                src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                alt={profile.display_name || profile.username}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
              />

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.display_name || profile.fullname || profile.username}
                    </h1>
                    <p className="text-lg text-gray-600">@{profile.username}</p>
                    {profile.bio && (
                      <p className="text-gray-700 mt-2 max-w-2xl">{profile.bio}</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {isOwnProfile ? (
                      <Link
                        to="/settings"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
                      >
                        <FaEdit size={14} />
                        Edit Profile
                      </Link>
                    ) : (
                      <FollowButton 
                        userId={userId} 
                        size="lg"
                        onFollowChange={handleFollowChange}
                      />
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt size={12} />
                    <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaFileAlt className="text-purple-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPosts || 0}</p>
              <p className="text-sm text-gray-600">Posts</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaEye className="text-blue-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews || 0}</p>
              <p className="text-sm text-gray-600">Views</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaHeart className="text-red-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClaps || 0}</p>
              <p className="text-sm text-gray-600">Claps</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaComment className="text-green-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalComments || 0}</p>
              <p className="text-sm text-gray-600">Comments</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaUsers className="text-orange-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{followCounts.followers || 0}</p>
              <p className="text-sm text-gray-600">Followers</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <FaUserFriends className="text-indigo-500" size={20} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{followCounts.following || 0}</p>
              <p className="text-sm text-gray-600">Following</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "posts"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Posts ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "about"
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === "posts" && (
          <div>
            {posts.length > 0 ? (
              <PostList posts={posts} layout="list" />
            ) : (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600">
                  {isOwnProfile 
                    ? "Start writing your first story!" 
                    : `${profile.display_name || profile.username} hasn't published any posts yet.`
                  }
                </p>
                {isOwnProfile && (
                  <Link
                    to="/new-story"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                  >
                    <FaEdit size={14} />
                    Write your first story
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "about" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-gray-700">
                  {profile.bio || "No bio available."}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Member Since</h4>
                <p className="text-gray-700">
                  {new Date(profile.created_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;