import { NavLink } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="w-full h-48 overflow-hidden">
        <img
          src={post.coverImage}
          alt="Post Cover"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-gray-800 truncate">
          {post.title}
        </h2>
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
        <NavLink
          to={`/${post.id}`}
          className="mt-auto text-blue-500 hover:underline self-start"
        >
          Read More →
        </NavLink>
      </div>
    </div>
  );
};

export default PostCard;
