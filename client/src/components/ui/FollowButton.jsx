import { useState, useEffect } from "react";
import { followUser, unfollowUser, checkFollowing } from "../../services/followService";
import { FaUserPlus, FaUserCheck, FaSpinner } from "react-icons/fa";

const FollowButton = ({ 
  userId, 
  size = "md", 
  variant = "primary",
  showIcon = true,
  className = "",
  onFollowChange = null 
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Don't show follow button for own profile
  if (!token || !userId || userId === currentUserId) {
    return null;
  }

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        setCheckingStatus(true);
        const result = await checkFollowing(userId, token);
        setIsFollowing(result.isFollowing);
      } catch (err) {
        console.error("Error checking follow status:", err);
        setIsFollowing(false);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkFollowStatus();
  }, [userId, token]);

  const handleFollowToggle = async () => {
    if (loading) return;

    try {
      setLoading(true);
      
      if (isFollowing) {
        await unfollowUser(userId, token);
        setIsFollowing(false);
        onFollowChange?.(false);
      } else {
        await followUser(userId, token);
        setIsFollowing(true);
        onFollowChange?.(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
      // Revert state on error
      setIsFollowing(!isFollowing);
    } finally {
      setLoading(false);
    }
  };

  // Size variants
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  // Style variants
  const getVariantClasses = () => {
    if (isFollowing) {
      return variant === "outline" 
        ? "border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        : "bg-gray-600 text-white hover:bg-gray-700";
    } else {
      return variant === "outline"
        ? "border border-blue-500 text-blue-600 hover:bg-blue-50"
        : "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  if (checkingStatus) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-1 ${sizeClasses[size]} bg-gray-200 text-gray-500 rounded-full font-medium transition cursor-not-allowed ${className}`}
      >
        <FaSpinner className="animate-spin" size={12} />
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`inline-flex items-center gap-1 ${sizeClasses[size]} ${getVariantClasses()} rounded-full font-medium transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <FaSpinner className="animate-spin" size={12} />
      ) : (
        showIcon && (isFollowing ? <FaUserCheck size={12} /> : <FaUserPlus size={12} />)
      )}
      <span>
        {loading ? "..." : isFollowing ? "Following" : "Follow"}
      </span>
    </button>
  );
};

export default FollowButton;