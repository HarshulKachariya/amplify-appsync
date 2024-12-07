import { redirect, useNavigate, useParams } from "react-router-dom";
import { getPost } from "../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { createComment } from "../graphql/mutations";
import { v4 } from "uuid";

const client = generateClient();

const PostsPage = () => {
  const [data, setData] = useState(null);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPostsData = async () => {
    try {
      if (!id) return redirect("/");

      const res = await client.graphql({
        query: getPost,
        variables: { id },
      });

      if (res.data.getPost) {
        setData(res.data.getPost);
        console.log(res.data.getPost);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostsData();
  }, []);

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const createComments = async () => {
    try {
      if (!comment) return;

      const commentValue = {
        id: v4(),
        message: comment,
        postID: data.id,
      };

      const res = await client.graphql({
        query: createComment,
        variables: {
          input: commentValue,
        },
        authMode: "userPool",
      });
      if (res.data.createComment) {
        setComment("");
        fetchPostsData();
      }
      console.log("createComment", res.data.createComment);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-800">
          No Data Found....
        </div>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
        >
          Go back to Home Page
        </button>
      </div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          {data.coverImage && (
            <StorageImage
              alt={data.title}
              path={data.coverImage}
              className="w-full rounded-lg"
            />
          )}
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {data.title}
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Posted by{" "}
            <span className="font-medium text-gray-800">{data.username}</span>{" "}
            on {new Date(data.createdAt).toLocaleDateString()}
          </p>
          <div className="mt-4 text-gray-700 leading-relaxed">
            {data.content}
          </div>
        </div>
        <div className="bg-gray-100 p-4 text-sm text-gray-500 flex justify-between items-center">
          <span>
            Last updated on {new Date(data.updatedAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Go back to Home Page
          </button>
        </div>
        <div className="bg-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Comments</h2>
          {data.comments?.items?.length > 0 ? (
            <div className="space-y-4">
              {data.comments.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-gray-200 rounded-lg shadow-sm"
                >
                  <p className="text-gray-800">{item.message}</p>
                  <span className="text-sm text-gray-600">
                    - {item.createdBy}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet...</p>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Add a Comment
          </h3>
          <textarea
            placeholder="Write your comment..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={comment}
            onChange={handleChange}
          />
          <button
            onClick={createComments}
            className="mt-3 px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition w-full"
          >
            Submit Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
