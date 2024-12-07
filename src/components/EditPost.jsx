import { useCallback, useEffect, useRef, useState } from "react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "../graphql/mutations";
import { generateClient } from "aws-amplify/api";
import { useNavigate, useParams } from "react-router-dom";
import { getPost } from "../graphql/queries";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { uploadData } from "aws-amplify/storage";

const client = generateClient();

const EditPostPage = () => {
  const { id } = useParams();
  const [value, setValue] = useState({
    title: "",
    content: "",
  });
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const inputImageRef = useRef();
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

  const handleFIleInput = () => {
    inputImageRef.current.click();
  };

  const handleFileInputChange = () => {
    const file = inputImageRef.current.files[0];

    if (!file) return;
    setImageURL(null);
    setImage(file);
  };

  const createNewPost = async () => {
    if (!value.title || !value.content) return;

    const postValue = {
      id: id,
      title: value.title,
      content: value.content,
    };

    try {
      if (image) {
        try {
          const result = await uploadData({
            path: ({ identityId }) =>
              `protected/${identityId}/album/2024/1.jpg`,
            data: image,
            options: {
              onProgress: ({ transferredBytes, totalBytes }) => {
                if (totalBytes) {
                  console.log(
                    `Upload progress ${Math.round(
                      (transferredBytes / totalBytes) * 100
                    )} %`
                  );
                }
              },
            },
          }).result;
          postValue.coverImage = result.path;
          console.log("Path from Response: ", result);
        } catch (error) {
          console.log("Error : ", error);
        }
      }

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
        if (!id) return navigate("/");

        const res = await client.graphql({
          query: getPost,
          variables: { id },
        });

        if (res.data.getPost) {
          const { title, content, coverImage } = res.data.getPost;
          setValue({
            title: title,
            content: content,
          });
          setImageURL(coverImage);
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
        {imageURL ? (
          <StorageImage
            alt={value.title}
            path={imageURL ?? ""}
            onGetUrlError={(error) => console.error(error)}
          />
        ) : image ? (
          <div className="w-full h-full rounded-lg overflow-hidden">
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <></>
        )}
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
        <input
          type="file"
          name="PostImage"
          id="PostImage"
          ref={inputImageRef}
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div>
          <button
            onClick={handleFIleInput}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Upload Cover Image
          </button>
          <button
            onClick={createNewPost}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Update Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
