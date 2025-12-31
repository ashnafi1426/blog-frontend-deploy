import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createPostDB, updatePostDB } from "../../services/postService";

const PostForm = ({ post, onSuccess, onCancel }) => {
  const [title, setTitle] = useState(post?.title || "");
  const [subtitle, setSubtitle] = useState(post?.subtitle || "");
  const [content, setContent] = useState(post?.content || "");
  const [coverImage, setCoverImage] = useState(post?.cover_image || "");
  const [status, setStatus] = useState(post?.status || "draft");
  const [loading, setLoading] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const autoSaveRef = useRef(null);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (status === 'draft' && (title || content)) {
      autoSaveRef.current = setInterval(() => {
        handleSave(true);
      }, 30000);
    }
    return () => clearInterval(autoSaveRef.current);
  }, [title, content, status]);

  const handleSave = async (isAutoSave = false, publishStatus = null) => {
    const strippedContent = content.replace(/<(.|\n)*?>/g, "").trim();
    if (!title.trim() && !strippedContent) return;

    if (!isAutoSave) setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in.");
        return;
      }

      const finalStatus = publishStatus || (isAutoSave ? 'draft' : status);

      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim(),
        content: content,
        coverImage,
        status: finalStatus
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      let result;
      if (post?.post_id) {
        result = await updatePostDB(token, post.post_id, payload);
      } else {
        result = await createPostDB(token, payload);
      }

      if (isAutoSave) {
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      } else {
        onSuccess?.(result);
      }
    } catch (err) {
      console.error(err);
      if (!isAutoSave) alert("Error: " + (err.message || "Something went wrong"));
    } finally {
      if (!isAutoSave) setLoading(false);
    }
  };

  const handlePublish = async () => {
    console.log("handlePublish called");
    console.log("title:", title);
    console.log("content:", content);
    
    const strippedContent = content.replace(/<(.|\n)*?>/g, "").trim();
    console.log("strippedContent:", strippedContent);
    
    if (!title.trim()) {
      console.log("Title validation failed");
      return alert("Title is required to publish");
    }
    if (!strippedContent) {
      console.log("Content validation failed");
      return alert("Content is required to publish");
    }
    setStatus('published');
    await handleSave(false, 'published');
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Auto-save indicator */}
      {autoSaved && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
          Draft saved
        </div>
      )}

      {/* Cover image input */}
      <div className="mb-6">
        <input
          type="url"
          placeholder="Add a cover image URL (optional)"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          className="w-full px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:border-green-500"
        />
        {coverImage && (
          <img src={coverImage} alt="Cover preview" className="mt-2 max-h-48 rounded object-cover" />
        )}
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-4xl font-bold mb-4 outline-none placeholder-gray-300 text-gray-900 dark:text-white bg-transparent"
      />

      {/* Subtitle */}
      <input
        type="text"
        placeholder="Add a subtitle..."
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        className="w-full text-xl text-gray-500 dark:text-gray-400 mb-6 outline-none placeholder-gray-300 bg-transparent"
      />

      {/* Content editor */}
      <div className="prose-editor mb-6">
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={quillModules}
          formats={quillFormats}
          placeholder="Tell your story..."
          className="min-h-[400px]"
          theme="snow"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleSave()}
            disabled={loading}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            {loading ? "Saving..." : "Save draft"}
          </button>
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          )}
        </div>

        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium disabled:opacity-50 transition"
        >
          {loading ? "Publishing..." : post?.status === 'published' ? "Update" : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default PostForm;
