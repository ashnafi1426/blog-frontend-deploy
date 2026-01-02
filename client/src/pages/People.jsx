import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllPostsDB } from "../services/postService";
import FollowButton from "../components/ui/FollowButton";
import { FaUsers, FaSearch, FaUserFriends } from "react-icons/fa";

const People = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Get users from posts (authors)
        const posts = await getAllPostsDB({ limit: 50 });
        
        // Extract unique users
        const uniqueUsers = Array.from(
          new Map(
            posts
              .map(post => post.users)
              .filter(Boolean)
              .map(user => [user.user_id, user])
          ).values()
        );

        setUsers(uniqueUsers);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FaUsers className="text-green-600 mr-3" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">Discover People</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find interesting writers and thought leaders to follow. Discover new perspectives and stay updated with their latest stories.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.user_id} user={user} />
          ))}
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <FaUserFriends className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No people found</h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms." : "No users available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const UserCard = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Avatar and basic info */}
      <div className="text-center mb-4">
        <Link to={`/profile/${user.user_id}`}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
            alt={user.display_name || user.username}
            className="w-16 h-16 rounded-full mx-auto mb-3 border-2 border-gray-200 hover:border-green-500 transition-colors"
          />
        </Link>
        <Link 
          to={`/profile/${user.user_id}`}
          className="block font-semibold text-gray-900 hover:text-green-600 transition-colors"
        >
          {user.display_name || user.username}
        </Link>
        <p className="text-sm text-gray-500">@{user.username}</p>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-gray-600 text-center mb-4 line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* Follow button */}
      <div className="flex justify-center">
        <FollowButton userId={user.user_id} size="sm" />
      </div>
    </div>
  );
};

export default People;