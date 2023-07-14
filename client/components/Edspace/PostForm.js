import axios from "axios";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

function PostForm() {
  const [image, setImage] = useState(null);
  const router = useRouter();
  const { userId } = router.query;
  const captionRef = useRef();

  async function postHandler(e) {
    e.preventDefault();

    if (image) {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("userId", userId);
      formData.append(
        "caption",
        captionRef.current.value.trim() || "Ed space is great!!!"
      );

      try {
        const res = await axios.post(
          `http://localhost:8888/upload-image`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
              "Content-Type": "multipart/form-data",
            },
            validateStatus: () => true,
          }
        );

        if (res.statusText === "OK") {
          captionRef.current.value = "";
          // setLoadImage(true);
          router.reload();
        }
      } catch (err) {
        alert(err.message);
      }
    }
  }

  function onChange(e) {
    setImage(e.target.files[0]);
  }

  return (
    <div className="bg-gradient-to-t from-primary to-secondary-100 flex flex-col items-center">
      <label htmlFor="caption" className="text-xl font-semibold my-3">
        Add Caption
      </label>
      <input
        ref={captionRef}
        name="caption"
        type={"text"}
        className={"rounded-md my-3 py-1 bg-gray-200"}
      />

      <label htmlFor="photo" className="block text-xl font-semibold my my-3">
        Add Photo
      </label>
      <input
        type={"file"}
        name="photo"
        accept="image/*"
        onChange={onChange}
        className={"my-3 w-full"}
        title="Add an image"
      />

      <button className="button w-14 mt-6" onClick={postHandler}>
        Post
      </button>
    </div>
  );
}

export default PostForm;
