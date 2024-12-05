import { redirect, useNavigate, useParams } from "react-router-dom";
import { getPost } from "../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { useEffect, useState } from "react";

const client = generateClient();

const PostsPage = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchPostsData();
  }, []);

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
            <img
              src={data.coverImage}
              alt={data.title}
              className="w-full h-64 object-cover"
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
            onClick={() => redirect("/")}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition"
          >
            Go back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostsPage;
