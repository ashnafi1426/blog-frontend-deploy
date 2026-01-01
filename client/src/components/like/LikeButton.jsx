import { useState, useEffect } from "react";
import { addClaps, getClapsCount, getUserClaps } from "../../services/clapsService";
import { FaHeart } from "react-icons/fa";

const LikeButton = ({ postId }) => {
  const [totalClaps, setTotalClaps] = useState(0);
  const [userClaps, setUserClaps] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchClaps = async () => {
      if (!postId) return;
      try {
        const { count } = await getClapsCount(postId);
        setTotalClaps(count || 0);

        // Only fetch user claps if logged in
        if (token) {
          try {
            const { count: userCount } = await getUserClaps(postId, token);
            setUserClaps(userCount || 0);
          } catch (err) {
            // Token might be expired, just ignore
            console.log("Could not fetch user claps");
          }
        }
      } catch (err) {
        console.error("Failed to fetch claps:", err);
      }
    };
    fetchClaps();
  }, [postId, token]);

  const handleClap = async () => {
    if (!token) {
      alert("Please login to clap");
      return;
    }

    if (userClaps >= 50) return;

    setLoading(true);
    try {
      // Optimistic update
      setUserClaps(prev => Math.min(prev + 1, 50));
      setTotalClaps(prev => prev + 1);
      
      await addClaps(postId, token, 1);
    } catch (err) {
      // Revert on error
      setUserClaps(prev => Math.max(prev - 1, 0));
      setTotalClaps(prev => Math.max(prev - 1, 0));
      console.error("Clap failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClap}
      disabled={loading || userClaps >= 50}
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition
        ${userClaps > 0 ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
      title={token ? `Like (${userClaps}/50)` : "Sign in to like"}
    >
      <FaHeart className={`${userClaps > 0 ? "text-white" : "text-red-500"} transition`} />
      <span>{totalClaps}</span>
    </button>
  );
};

export default LikeButton;
