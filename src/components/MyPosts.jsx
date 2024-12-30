import { generateClient } from "aws-amplify/api";
import { memo, useEffect, useState } from "react";
import PostCard from "./PostCard";
import { getCurrentUser } from "@aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { postsByUsername } from "../graphql/queries";
import Loader from "./Loader";

const client = generateClient();

const MyPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function currentAuthenticatedUser() {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        fetchPosts(currentUser.username, currentUser.userId);
      } else {
        navigate("/sign-in");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  }

  const fetchPosts = async (username, id) => {
    try {
      const res = await client.graphql({
        query: postsByUsername,
        variables: {
          username: `${id}::${username}`,
          limit: 10,
          nextToken: null,
        },
      });
      setPosts(res.data.postsByUsername.items);
      setLoading(false);
    } catch (error) {
      console.log("Error fetchig posts..", error.message);
    }
  };

  useEffect(() => {
    currentAuthenticatedUser();
  }, []);

  if (loading) {
    return <Loader length={8} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">My Posts</h1>
      {posts.length !== 0 ? (
        <PostCard posts={posts} mypost={true} setPosts={setPosts} />
      ) : (
        <div className="flex justify-center items-center text-2xl font-bold text-gray-500 ">
          No Post available
        </div>
      )}
    </div>
  );
};

export default memo(MyPostsPage);
