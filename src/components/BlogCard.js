import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";

export function BlogCard({ post }) {
  const formatDate = (date) => moment(date).format("MMMM Do YYYY, h:mm A");

  const getTypeLabel = (type) => {
    switch (type) {
      case 1:
        return "Kiến thức";
      case 2:
        return "Khuyến mãi";
      case 3:
        return "Tuyển dụng";
      default:
        return "Khác";
    }
  };

  return (
    <Link to={`/news/${post.new_id}`}>
      <article className="w-full max-w-sm rounded-xl overflow-hidden bg-white shadow-md dark:bg-zinc-900 hover:bg-white hover:shadow-xl dark:shadow-none dark:hover:bg-zinc-800 cursor-pointer">
        <img
          alt={post.new_title}
          src={`http://localhost:5000${post.new_image}`}
          className="h-64 w-full object-cover"
        />
        <div className="p-4 space-y-3">
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {getTypeLabel(Number(post.new_type))}
          </span>
          <h2 className="text-lg font-semibold text-black dark:text-white line-clamp-2">
            {post.new_title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {post.new_description}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(post.new_time)}
          </p>
        </div>
      </article>
    </Link>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    new_id: PropTypes.number.isRequired,  // Sửa đúng tên key
    new_title: PropTypes.string.isRequired,
    new_image: PropTypes.string.isRequired,
    new_type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    new_description: PropTypes.string.isRequired,
    new_time: PropTypes.string.isRequired,
  }).isRequired,
};
