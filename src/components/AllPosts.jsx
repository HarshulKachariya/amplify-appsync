import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/api";
import { listPosts } from "../graphql/queries";
import { NavLink } from "react-router-dom";
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post, index) => (
          <PostCard post={post} key={index} />
        ))}
      </div>
    </div>
  );
};

export default AllPosts;
