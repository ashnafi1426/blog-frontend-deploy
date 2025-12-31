// src/components/likes/LikesList.jsx
import React, { useEffect, useState } from "react";
import { getLikesList } from "../../services/likeService";

const LikesList = ({ postId }) => {
  const [likes, setLikes] = useState([]);
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const data = await getLikesList(postId);
        setLikes(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchLikes();
  }, [postId]);

  if (!likes.length) {
    return <p className="text-sm text-gray-400 mt-2">No likes yet</p>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {likes.map((user) => (
        <span
          key={user.user_id}
          className="bg-gray-200 px-2 py-1 rounded-full text-sm"
        >
          {user.username}
        </span>
      ))}
    </div>
  );
};

export default LikesList;
