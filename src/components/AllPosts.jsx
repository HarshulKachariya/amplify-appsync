import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";

const client = generateClient();

const AllPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await client.graphql({
        query: listPosts,
      });
      setPosts(res.data.listPosts.items);
    } catch (error) {
      console.log("Error fetchig posts..", error.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Posts</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
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
              <p className="text-gray-600 text-sm line-clamp-3">
                {post.content}
              </p>
              <button className="mt-auto text-blue-500 hover:underline self-start">
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
