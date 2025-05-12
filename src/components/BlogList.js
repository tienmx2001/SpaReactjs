import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { BlogCard } from "./BlogCard";

export function BlogList({ className }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/news")
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching news:", err));
  }, []);

  return (
    <div className={className}>
      {posts.map((post) => (
        <BlogCard key={post.news_id} post={post} />
      ))}
    </div>
  );
}

BlogList.propTypes = {
  className: PropTypes.string,
};

export default BlogList;
