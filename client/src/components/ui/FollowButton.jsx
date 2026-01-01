import { useState, useEffect } from "react";
import { followUser, unfollowUser, checkFollowing } from "../../services/followService";

const FollowButton = ({ userId, initialFollowing = false, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Don't show follow button for own profile
  if (userId === currentUserId) return null;

  useEffect(() => {
    const checkStatus = async () => {
      if (!token || !userId) return;
      try {
        const { isFollowing: status } = await checkFollowing(userId, token);
        setIsFollowing(status);
      } catch (err) {
        console.error("Failed to check follow status:", err);
      }
    };
    checkStatus();
  }, [userId, token]);

  const handleClick = async () => {
    if (!token) {
      alert("Please login to follow");
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId, token);
        setIsFollowing(false);
      } else {
        await followUser(userId, token);
        setIsFollowing(true);
      }
      onFollowChange?.(!isFollowing);
    } catch (err) {
      console.error("Follow action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
        ${isFollowing 
          ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30' 
          : 'bg-green-600 text-white hover:bg-green-700'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {loading ? '...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
