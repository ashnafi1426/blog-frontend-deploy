import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDraftsDB, deletePostDB } from "../services/postService";
import { FaEdit, FaTrash } from "react-icons/fa";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const data = await getDraftsDB(token);
        setDrafts(data || []);
      } catch (err) {
        console.error("Failed to fetch drafts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this draft?")) return;
    
    try {
      await deletePostDB(token, id);
      setDrafts(drafts.filter(d => d.post_id !== id));
    } catch (err) {
      alert("Failed to delete draft");
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPreview = (html, maxLength = 100) => {
    const text = html?.replace(/<[^>]*>/g, '') || '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your drafts
        </h1>
        <Link
          to="/new-story"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition"
        >
          Write a story
        </Link>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            You have no drafts.
          </p>
          <Link to="/new-story" className="text-green-600 hover:underline">
            Start writing
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {drafts.map((draft) => (
            <div
              key={draft.post_id}
              className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link to={`/edit/${draft.post_id}`}>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-green-600">
                      {draft.title || "Untitled"}
                    </h2>
                  </Link>
                  <p className="text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {getPreview(draft.content) || "No content yet..."}
                  </p>
                  <p className="text-sm text-gray-400">
                    Last edited {formatDate(draft.updated_at || draft.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Link
                    to={`/edit/${draft.post_id}`}
                    className="p-2 text-gray-500 hover:text-green-600 transition"
                    title="Edit"
                  >
                    <FaEdit size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(draft.post_id)}
                    className="p-2 text-gray-500 hover:text-red-600 transition"
                    title="Delete"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Drafts;
