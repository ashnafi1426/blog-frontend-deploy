import { useState, useEffect, useRef } from "react";
import { addClaps, getClapsCount, getUserClaps } from "../../services/clapsService";
import { FaHandsClapping } from "react-icons/fa6";

const ClapButton = ({ postId }) => {
  const [totalClaps, setTotalClaps] = useState(0);
  const [userClaps, setUserClaps] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCount, setShowCount] = useState(false);
  const pendingClaps = useRef(0);
  const timeoutRef = useRef(null);
  
  const token = localStorage.getItem("token");
  const maxClaps = 50;

  useEffect(() => {
    const fetchClaps = async () => {
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

    if (userClaps >= maxClaps) {
      return;
    }

    // Optimistic update
    setUserClaps(prev => Math.min(prev + 1, maxClaps));
    setTotalClaps(prev => prev + 1);
    setIsAnimating(true);
    setShowCount(true);
    pendingClaps.current += 1;

    // Debounce API call
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      try {
        await addClaps(postId, token, pendingClaps.current);
        pendingClaps.current = 0;
      } catch (err) {
        console.error("Clap failed:", err);
        // Revert on error
        setUserClaps(prev => Math.max(prev - pendingClaps.current, 0));
        setTotalClaps(prev => Math.max(prev - pendingClaps.current, 0));
        pendingClaps.current = 0;
      }
    }, 500);

    setTimeout(() => setIsAnimating(false), 300);
    setTimeout(() => setShowCount(false), 2000);
  };

  const formatCount = (count) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <button
          onClick={handleClap}
          disabled={userClaps >= maxClaps}
          className={`
            group flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
            ${userClaps > 0 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
            }
            ${isAnimating ? 'scale-110' : 'scale-100'}
            ${userClaps >= maxClaps ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={token ? `Clap (${userClaps}/${maxClaps})` : "Sign in to clap"}
        >
          <FaHandsClapping
            className={`w-5 h-5 transition-colors ${userClaps > 0 ? 'text-green-600' : 'text-gray-500 group-hover:text-green-600'}`}
          />
        </button>
        
        {/* Floating count indicator */}
        {showCount && userClaps > 0 && (
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
            +{userClaps}
          </span>
        )}
      </div>

      <span className="text-sm text-gray-600 font-medium">
        {formatCount(totalClaps)}
      </span>
    </div>
  );
};

export default ClapButton;
