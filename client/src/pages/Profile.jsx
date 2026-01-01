import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserProfile, getUserPosts } from "../services/userService";
import { getFollowCounts, getFollowers, getFollowing } from "../services/followService";
import PostList from "../components/post/PostList";
import FollowButton from "../components/ui/FollowButton";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");
  const isOwnProfile = id === currentUserId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profile, userPosts, counts] = await Promise.all([
          getUserProfile(id, token),
          getUserPosts(id, token),
          getFollowCounts(id)
        ]);

        setUser({ ...profile, ...counts });
        setPosts(userPosts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const fetchFollowers = async () => {
    try {
      const data = await getFollowers(id, token);
      setFollowers(data);
    } catch (err) {
      console.error("Failed to fetch followers:", err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const data = await getFollowing(id, token);
      setFollowing(data);
    } catch (err) {
      console.error("Failed to fetch following:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "followers") fetchFollowers();
    if (activeTab === "following") fetchFollowing();
  }, [activeTab, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || "User not found"}
        </h1>
        <Link to="/dashboard" className="text-green-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile header */}
      <header className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
        <img
          src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
          alt={user.username}
          className="w-24 h-24 rounded-full"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.display_name || user.fullname || user.username}
            </h1>
            {!isOwnProfile && <FollowButton userId={id} />}
            {isOwnProfile && (
              <Link
                to="/settings"
                className="px-4 py-1.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Edit profile
              </Link>
            )}
          </div>
          
          <p className="text-gray-500 mb-3">@{user.username}</p>
          
          {user.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
          )}

          <div className="flex gap-6 text-sm">
            <button 
              onClick={() => setActiveTab("followers")}
              className="hover:underline"
            >
              <span className="font-bold text-gray-900 dark:text-white">{user.followers || 0}</span>
              <span className="text-gray-500 ml-1">Followers</span>
            </button>
            <button 
              onClick={() => setActiveTab("following")}
              className="hover:underline"
            >
              <span className="font-bold text-gray-900 dark:text-white">{user.following || 0}</span>
              <span className="text-gray-500 ml-1">Following</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 dark:border-gray-700 mb-8">
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-4 text-sm font-medium transition ${
            activeTab === "posts"
              ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Stories
        </button>
        <button
          onClick={() => setActiveTab("followers")}
          className={`pb-4 text-sm font-medium transition ${
            activeTab === "followers"
              ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setActiveTab("following")}
          className={`pb-4 text-sm font-medium transition ${
            activeTab === "following"
              ? "text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Following
        </button>
      </div>

      {/* Content */}
      {activeTab === "posts" && (
        <PostList posts={posts} showAuthor={false} />
      )}

      {activeTab === "followers" && (
        <div className="space-y-4">
          {followers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No followers yet</p>
          ) : (
            followers.map((follower) => (
              <UserCard key={follower.user_id} user={follower} />
            ))
          )}
        </div>
      )}

      {activeTab === "following" && (
        <div className="space-y-4">
          {following.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Not following anyone yet</p>
          ) : (
            following.map((user) => (
              <UserCard key={user.user_id} user={user} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

// User card component
const UserCard = ({ user }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <Link to={`/profile/${user.user_id}`} className="flex items-center gap-3">
      <img
        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
        alt={user.username}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">
          {user.display_name || user.username}
        </h3>
        {user.bio && (
          <p className="text-sm text-gray-500 line-clamp-1">{user.bio}</p>
        )}
      </div>
    </Link>
    <FollowButton userId={user.user_id} />
  </div>
);

export default Profile;
