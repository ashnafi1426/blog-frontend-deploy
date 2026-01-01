import { useEffect, useState } from "react";
import { getBookmarks } from "../services/bookmarkService";
import PostList from "../components/post/PostList";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getBookmarks(token);
        setBookmarks(data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Your reading list
      </h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            You haven't saved any stories yet.
          </p>
          <p className="text-gray-400 text-sm">
            Tap the bookmark icon on any story to save it here.
          </p>
        </div>
      ) : (
        <PostList posts={bookmarks} />
      )}
    </div>
  );
};

export default Bookmarks;
