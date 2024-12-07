import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";
import PostCard from "./PostCard";

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
      {posts.length && posts.length !== 0 ? (
        <PostCard posts={posts} setPosts={setPosts} />
      ) : (
        <div className="flex justify-center items-center text-2xl font-bold text-gray-500 ">
          No Post available
        </div>
      )}
    </div>
  );
};

export default AllPosts;
