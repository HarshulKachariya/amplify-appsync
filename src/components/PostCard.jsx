/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { deletePost } from "../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { StorageImage } from "@aws-amplify/ui-react-storage";

const client = generateClient();

const PostCard = ({ posts, mypost, setPosts }) => {
  const handleDeletePost = async (id, e) => {
    e.preventDefault();
    await client.graphql({
      query: deletePost,
      variables: { input: { id } },
      authMode: "userPool",
    });
    setPosts(posts.filter((post) => post.id !== id));
  };
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {posts.map((post, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <div className="w-full h-48 object-contain">
            <StorageImage
              alt={post.title}
              path={post.coverImage ?? ""}
              onGetUrlError={(error) => console.error(error)}
              imgKey="guest"
              className="object-contain !w-full"
            />
            {/* <img
              src={post.coverImage}
              alt="Post Cover"
              className="w-full h-full object-cover"
            /> */}
          </div>
          <div className="p-4 flex flex-col gap-3">
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {post.title}
            </h2>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
            <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
            <div className="flex justify-between items-center">
              <NavLink
                to={`/${post.id}`}
                className="mt-auto text-blue-500 hover:underline self-start"
              >
                Read More →
              </NavLink>
              {mypost && (
                <div className="flex gap-3 items-center">
                  <NavLink
                    to={`/edit-post/${post.id}`}
                    className="p-2 bg-blue-200 text-blue-500   rounded-lg"
                  >
                    Edit
                  </NavLink>
                  <button
                    className="p-2 bg-red-200 text-red-500  rounded-lg"
                    onClick={(e) => handleDeletePost(post.id, e)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostCard;
