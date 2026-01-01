import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPostDB, updatePostDB, getPostByIdDB } from "../services/postService";
import { getTrendingTopics } from "../services/topicService";
import { addBookmark } from "../services/bookmarkService";
import { FaImage, FaSave, FaPaperPlane, FaEye, FaTimes, FaArrowLeft, FaClock, FaLightbulb } from "react-icons/fa";

const NewStory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(!!id);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [postId, setPostId] = useState(id || null);
  const [autoBookmark, setAutoBookmark] = useState(true);

  const token = localStorage.getItem("token");

  // Load existing post if editing
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const data = await getPostByIdDB(id, token);
          setTitle(data.title || "");
          setSubtitle(data.subtitle || "");
          setContent(data.content || "");
          setCoverImage(data.cover_image || "");
          setPostId(data.post_id);
        } catch (err) {
          console.error("Failed to load post:", err);
        } finally {
          setLoadingPost(false);
        }
      };
      fetchPost();
    }
  }, [id, token]);

  // Load topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topics = await getTrendingTopics(20);
        setAvailableTopics(topics || []);
      } catch (err) {
        console.error("Failed to load topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // Auto-save draft
  useEffect(() => {
    const autoSave = setInterval(async () => {
      if ((title || content) && token) {
        try {
          const payload = { title, subtitle, content, coverImage, status: "draft" };
          if (postId) {
            await updatePostDB(token, postId, payload);
          } else {
            const result = await createPostDB(token, payload);
            setPostId(result.post_id);
          }
          setAutoSaved(true);
          setTimeout(() => setAutoSaved(false), 2000);
        } catch (err) {
          console.log("Auto-save failed");
        }
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [title, subtitle, content, coverImage, postId, token]);

  const stripHtml = (html) => html?.replace(/<[^>]*>/g, "").trim() || "";

  const handleSaveDraft = async () => {
    if (!title.trim() && !stripHtml(content)) return;
    
    setLoading(true);
    try {
      const payload = { title, subtitle, content, coverImage, status: "draft" };
      if (postId) {
        await updatePostDB(token, postId, payload);
      } else {
        const result = await createPostDB(token, payload);
        setPostId(result.post_id);
      }
      navigate("/drafts");
    } catch (err) {
      alert(err.message || "Failed to save draft");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert("Title is required to publish");
      return;
    }
    if (!stripHtml(content)) {
      alert("Content is required to publish");
      return;
    }

    setLoading(true);
    try {
      const payload = { 
        title, 
        subtitle, 
        content, 
        coverImage, 
        status: "published",
        topics: selectedTopics.map(t => t.topic_id)
      };
      
      let result;
      if (postId) {
        result = await updatePostDB(token, postId, payload);
      } else {
        result = await createPostDB(token, payload);
      }
      
      // Auto-bookmark the post if enabled
      if (autoBookmark && result.post_id) {
        try {
          await addBookmark(result.post_id, token);
        } catch (err) {
          console.log("Auto-bookmark failed (non-critical):", err);
        }
      }
      
      setShowPublishModal(false);
      navigate(`/post/${result.post_id}`);
    } catch (err) {
      alert(err.message || "Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.find(t => t.topic_id === topic.topic_id)) {
      setSelectedTopics(selectedTopics.filter(t => t.topic_id !== topic.topic_id));
    } else if (selectedTopics.length < 5) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "code-block"],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header", "bold", "italic", "underline", "strike",
    "list", "bullet", "blockquote", "code-block",
    "link", "image", "color", "background"
  ];
  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-gray-900"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{id ? "Edit Story" : "Write New Story"}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                <FaClock size={12} />
                {autoSaved ? "Auto-saved" : "Unsaved changes"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              <FaSave size={16} />
              Draft
            </button>
            <button
              onClick={() => setShowPublishModal(true)}
              disabled={loading || (!title.trim() && !stripHtml(content))}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg"
            >
              <FaPaperPlane size={16} />
              <span className="hidden sm:inline">Publish</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cover Image Section */}
        <div className="mb-8">
          {coverImage ? (
            <div className="relative group">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-64 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-2xl transition flex items-center justify-center">
                <button
                  onClick={() => setCoverImage("")}
                  className="opacity-0 group-hover:opacity-100 p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-2xl p-12 text-center hover:border-green-500 hover:bg-green-50 transition cursor-pointer group">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-gray-200 rounded-xl group-hover:bg-green-100 transition">
                  <FaImage className="text-gray-600 group-hover:text-green-600 transition" size={32} />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold mb-2">Add a cover image</p>
                  <p className="text-gray-600 text-sm mb-4">Make your story stand out with an eye-catching cover</p>
                </div>
                <input
                  type="url"
                  placeholder="Paste image URL..."
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full max-w-md px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        {/* Title Section */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Your story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl md:text-5xl font-bold text-gray-900 placeholder-gray-400 outline-none bg-transparent mb-2"
          />
          <div className="h-1 w-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
        </div>

        {/* Subtitle Section */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Add a subtitle to hook your readers..."
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full text-xl text-gray-700 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>

        {/* Content Editor */}
        <div className="bg-gray-50 backdrop-blur-sm rounded-2xl border border-gray-300 p-6 shadow-2xl mb-8">
          <div className="mb-4 flex items-center gap-2 text-gray-600">
            <FaLightbulb size={14} />
            <p className="text-sm">Write your story here. Use formatting tools to make it engaging.</p>
          </div>
          <div className="story-editor">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Start writing your amazing story..."
              theme="snow"
              className="min-h-[400px] text-gray-900"
            />
          </div>
        </div>

        {/* Writing Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-sm">Words</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stripHtml(content).split(/\s+/).filter(w => w).length}</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-sm">Characters</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stripHtml(content).length}</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-sm">Read Time</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{Math.ceil(stripHtml(content).split(/\s+/).filter(w => w).length / 200)} min</p>
          </div>
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-300">
            {/* Modal Header */}
            <div className="sticky top-0 px-6 py-4 border-b border-gray-300 flex items-center justify-between bg-white/95 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900">Publish Your Story</h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600 hover:text-gray-900"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Story Preview</h3>
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-300">
                  {coverImage && (
                    <img src={coverImage} alt="Cover" className="w-full h-40 object-cover rounded-lg mb-4" />
                  )}
                  <h4 className="text-xl font-bold text-gray-900 line-clamp-2">{title || "Untitled Story"}</h4>
                  {subtitle && <p className="text-gray-600 text-sm mt-2 line-clamp-2">{subtitle}</p>}
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Topics (up to 5)</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedTopics.map((topic) => (
                    <button
                      key={topic.topic_id}
                      onClick={() => toggleTopic(topic)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-400 text-sm rounded-full hover:bg-green-600/30 transition border border-green-600/50"
                    >
                      {topic.name}
                      <FaTimes size={12} />
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                  {availableTopics
                    .filter(t => !selectedTopics.find(s => s.topic_id === t.topic_id))
                    .map((topic) => (
                      <button
                        key={topic.topic_id}
                        onClick={() => toggleTopic(topic)}
                        disabled={selectedTopics.length >= 5}
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 disabled:opacity-50 transition border border-gray-300"
                      >
                        {topic.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Info Boxes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Visibility */}
                <div className="bg-blue-950/30 border border-blue-900/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FaEye className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                    <div>
                      <p className="font-semibold text-blue-300">Public Story</p>
                      <p className="text-sm text-blue-400 mt-1">Visible to everyone and may appear in feeds</p>
                    </div>
                  </div>
                </div>

                {/* Bookmark */}
                <div className="bg-green-950/30 border border-green-900/50 rounded-xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoBookmark}
                      onChange={(e) => setAutoBookmark(e.target.checked)}
                      className="w-5 h-5 text-green-600 rounded mt-1 cursor-pointer"
                    />
                    <div>
                      <p className="font-semibold text-green-300">Auto-bookmark</p>
                      <p className="text-sm text-green-400 mt-1">Save to your reading list after publishing</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 px-6 py-4 bg-white/95 border-t border-gray-300 flex items-center justify-end gap-3 backdrop-blur-sm">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-6 py-2 text-gray-700 font-medium hover:text-gray-900 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition shadow-lg"
              >
                <FaPaperPlane size={16} />
                {loading ? "Publishing..." : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewStory;
