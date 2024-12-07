import { useCallback, useEffect, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { v4 } from "uuid";
import { updatePost } from "../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { getPost } from "../graphql/queries";

const client = generateClient();

const EditPostPage = () => {
  const { id } = useParams();
  const [value, setValue] = useState({
    title: "",
    content: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const setMdeValue = useCallback(
    (content) =>
      setValue((prevValue) => ({
        ...prevValue,
        content,
      })),
    []
  );

  const createNewPost = async () => {
    if (!value.title || !value.content) return;

    const postValue = {
      id: id,
      title: value.title,
      content: value.content,
    };

    try {
      const res = await client.graphql({
        query: updatePost,
        variables: { input: postValue },
        authMode: "userPool",
      });

      if (res.data) {
        navigate(`/${res.data.updatePost.id}`);
        setValue({
          title: "",
          content: "",
        });
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  useEffect(() => {
    const fetchPostsData = async () => {
      try {
        if (!id) return redirect("/");

        const res = await client.graphql({
          query: getPost,
          variables: { id },
        });

        if (res.data.getPost) {
          const { title, content } = res.data.getPost;
          setValue({
            title: title,
            content: content,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPostsData();
  }, []);

  return (
    <div className="flex flex-col items-center p-6  min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Post</h1>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title:
        </label>
        <input
          type="text"
          name="title"
          value={value.title}
          placeholder="Enter a post title"
          onChange={handleInputChange}
          required
          className="mt-1 mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Content:
        </label>
        <SimpleMDE
          value={value.content}
          onChange={setMdeValue}
          className="mt-2 mb-4"
        />
        <button
          onClick={createNewPost}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Post
        </button>
      </div>
    </div>
  );
};

export default EditPostPage;
