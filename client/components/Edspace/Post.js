import useUserStore from "../../store/useUserStore";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import Comments from "./Comments";

function Post({ p }) {
  const [likes, setLikes] = useState("");
  const [usersList, setUsersList] = useState([]);
  const userId = useUserStore((state) => state.id);
  const [follow, setFollow] = useState(null);

  function followHandler() {
    axios
      .post(
        "http://localhost:8888/follow",
        {
          userId,
          followedId: p.userId,
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        const isFollowed = res.data.followed;
        // setFollow(res.data.followed ? "Unfollow" : "Follow");
        if (isFollowed === true) return setFollow("Unfollow");
        if (isFollowed === false) return setFollow("Follow");
      });
  }

  useEffect(() => {
    axios
      .post(
        "http://localhost:8888/like-count",
        {
          postId: p.id,
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
        setLikes(res.data.likes);
        setUsersList(JSON.stringify(res.data.userIdList));
        if (usersList.includes(userId)) {
          document
            .getElementById("heart".concat(p.id))
            .classList.add("text-red-600");
          // console.log(document.getElementById("heart".concat(p.id)));
        }
      });
    axios
      .post(
        "http://localhost:8888/get-following",
        {
          userId,
          followedId: p.userId,
        },
        {
          validateStatus: () => true,
          headers: {
            Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
          },
        }
      )
      .then((res) => {
        setFollow(res.data.followed ? "Unfollow" : "Follow");
      });
  }, []);

  return (
    <div
      className={
        "mb-32 border-4 border-gray-400 shadow-lg shadow-gray-600 rounded-xl bg-secondary-light overflow-hidden w-4/5 font-general"
      }
    >
      <div className="flex items-center bg-slate-100 overflow-hidden py-3 pl-2">
        <div className="rounded-full w-14 h-14  overflow-hidden  ">
          <Image
            src={require("../../public/images/".concat(
              p.avatar || "default-user.webp"
            ))}
            style={{
              objectFit: "cover",
              height: "100%",
              with: "100%",
            }}
            alt={"Avatar"}
          />
        </div>
        <h1 className="text-3xl ml-3 text-action font-name">
          {p.email.split("@")[0]}
        </h1>
        <h1
          id={"heart".concat(p.id)}
          className="bg-gray ml-14 w-10 h-10 text-center flex "
          onClick={async (e) => {
            const res = await axios.post(
              "http://localhost:8888/like-post",
              {
                userId: userId,
                postId: p.id,
              },
              {
                validateStatus: () => true,
                headers: {
                  Authorization: "Bearer ".concat(localStorage.getItem("jwt")),
                },
              }
            );
            const likes = res.data.likes;
            setLikes(likes);
          }}
        >
          <i className="uil uil-heart text-4xl hover:cursor-pointer font-extrabold"></i>
          <span className="text-center text-3xl ml-4 text-black">{likes}</span>
        </h1>
        <h1
          onClick={followHandler}
          className="ml-20 text-2xl font-general text-red-600 hover:cursor-pointer "
        >
          {follow}
        </h1>
      </div>
      <div className="text-2xl h-96 flex">
        <div className="w-3/5 h-full">
          <h1 className="m-4  w-fit">{p.caption}</h1>
          <div className="mt-5 overflow-hidden rounded-md ">
            <Image
              src={require("../../public/images/".concat(p.image))}
              alt={"Image"}
            />
          </div>
        </div>
        <Comments postId={p.id} />
      </div>
    </div>
  );
}

export default Post;
