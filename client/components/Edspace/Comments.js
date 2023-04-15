import axios from "axios";
import { useEffect, useRef, useState } from "react";
import useUserStore from "../../store/useUserStore";
import CommentsList from "./CommentsList";

function Comments({ postId }) {
  const [isLoading, setIsLoading] = useState(false);
  const userId = useUserStore((state) => state.id);
  const [comments, setComments] = useState([]);
  const commentRef = useRef();

  useEffect(() => {
    setIsLoading(true);
    axios
      .post(
        "http://localhost:8888/get-all-comments",
        {
          postId: postId,
          userId,
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        setComments(res.data.comments);
        setIsLoading(false);
      });
  }, []);

  function addCommentHandler(e) {
    setIsLoading(true);
    e.preventDefault();
    if (commentRef.current.value.trim() === "")
      commentRef.current.value = "You so hot !!!!!";
    axios
      .post(
        "http://localhost:8888/make-comment",
        {
          postId: postId,
          userId,
          content: commentRef.current.value,
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        if (res.statusText === "OK") {
          axios
            .post(
              "http://localhost:8888/get-all-comments",
              {
                postId: postId,
                userId: userId,
              },
              {
                validateStatus: () => true,
                headers: {
                  Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
                },
              }
            )
            .then((res) => {
              console.log(res.data.comments);
              setComments(res.data.comments);
              setIsLoading(false);
            });
        }
      });
  }

  if (isLoading) return <h1>Loading...</h1>;

  if (!isLoading) {
    return (
      <div className="ml-2 mb-2 h-full relative flex flex-col justify-between ">
        <CommentsList comments={comments} />
        <div className="">
          <input
            ref={commentRef}
            className="rounded-md focus:text-red-400 w-52"
            type={"text"}
          />
          <button
            className="ml-2 text-md hover:opacity-30"
            onClick={addCommentHandler}
          >
            Add comment
          </button>
        </div>
      </div>
    );
  }
}

export default Comments;
