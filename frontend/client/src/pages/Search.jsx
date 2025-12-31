import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPostsDB } from "../services/postService";
import PostList from "../components/post/PostList";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchPostsDB(query);
        setResults(data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {query ? `Results for "${query}"` : "Search"}
      </h1>
      
      {query && (
        <p className="text-gray-500 mb-8">
          {loading ? "Searching..." : `${results.length} stories found`}
        </p>
      )}

      {!query && (
        <p className="text-gray-500 text-center py-16">
          Enter a search term to find stories
        </p>
      )}

      {query && !loading && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">
            No stories found for "{query}"
          </p>
          <p className="text-gray-400 text-sm">
            Try different keywords or check your spelling
          </p>
        </div>
      )}

      {results.length > 0 && <PostList posts={results} />}
    </div>
  );
};

export default Search;
