import { useState, useEffect } from "react";
import { addBookmark, removeBookmark, checkBookmark } from "../../services/bookmarkService";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

const BookmarkButton = ({ postId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkStatus = async () => {
      if (!token || !postId) return;
      try {
        const { isBookmarked: status } = await checkBookmark(postId, token);
        setIsBookmarked(status);
      } catch (err) {
        console.error("Failed to check bookmark:", err);
      }
    };
    checkStatus();
  }, [postId, token]);

  const handleClick = async () => {
    if (!token) {
      alert("Please login to bookmark");
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        await removeBookmark(postId, token);
        setIsBookmarked(false);
      } else {
        await addBookmark(postId, token);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error("Bookmark action failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        p-2 rounded-full transition-colors
        ${isBookmarked 
          ? 'text-gray-900 dark:text-white' 
          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
        }
        ${loading ? 'opacity-50' : ''}
      `}
      title={isBookmarked ? "Remove bookmark" : "Save"}
    >
      {isBookmarked ? <FaBookmark size={18} /> : <FaRegBookmark size={18} />}
    </button>
  );
};

export default BookmarkButton;
