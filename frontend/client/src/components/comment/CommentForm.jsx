import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addComment } from "../../services/CommentService";

const CommentForm = ({ postId, parentId = null, onSuccess, onCancel }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!stripHtml(content)) return;

    setLoading(true);
    try {
      await addComment(postId, content, token, parentId);
      setContent("");
      onSuccess?.();
    } catch (err) {
      alert(err.message || "Failed to post response");
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "blockquote", "code-block",
    "link",
    "color", "background"
  ];

  return (
    <div className="mb-6">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
          <h4 className="text-white font-medium flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {parentId ? "Write a Reply" : "Write a Response"}
          </h4>
          <span className="text-xs text-gray-400">Rich text editor</span>
        </div>

        {/* Editor */}
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          placeholder={parentId ? "Write your reply..." : "Share your thoughts..."}
          theme="snow"
          className="comment-editor-dark"
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-t border-gray-700">
          <div className="text-xs text-gray-400">
            Use toolbar for formatting • H1, H2, H3 for headings
          </div>
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={() => {
                  setContent("");
                  onCancel();
                }}
                className="px-4 py-2 text-gray-400 text-sm font-medium hover:text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading || !stripHtml(content)}
              className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? "Posting..." : parentId ? "Reply" : "Publish Response"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;
