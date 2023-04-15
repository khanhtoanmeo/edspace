import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import MyPosts from "./MyPosts";
import useUserStore from "../../store/useUserStore";
import useAppStore from "../../store/useAppStore";
function Profile({ userInfor }) {
  const { username, id, avatar } = userInfor;

  const logIn = useAppStore((state) => state.logIn);

  useEffect(() => {
    localStorage.setItem("id", id);
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar);
    logIn();
  }, []);

  const setId = useUserStore((state) => state.setId);
  setId(id);

  const [image, setImage] = useState(avatar || "default-user.webp");
  const [imageName, setImageName] = useState("default-user.webp");

  async function setAvatarHandler(e) {
    e.preventDefault();
    if (imageName === image) {
      alert("Please enter a valid avatar");
      return;
    }
    if (imageName !== image) {
      const res = await axios.post(
        "http://localhost:8888/set-avatar",
        {
          userId: id,
          avatar: imageName,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          validateStatus: () => true,
        }
      );
      if ((res.statusText = "OK")) setImage(imageName);
      else {
        alert("Can't set avatar");
      }
    }
  }

  return (
    <div>
      <header className="bg-gradient-to-b from-primary to-secondary-200 flex flex-col justify-center items-center h-screen ">
        <div className="rounded-full  overflow-hidden ">
          <Image
            style={{
              height: 400,
              width: 400,
            }}
            src={require("../../public/images/" + image)}
            alt="Avatar"
          />
        </div>
        <div className="my-10">
          <h1 className="text-4xl text-action font-bold uppercase">
            {username}
          </h1>
        </div>
        <div className=" w-2/5 flex justify-around items-center text-xl">
          <h1 className="">Set new avatar</h1>
          <input
            className="block"
            type={"file"}
            title="Set avatar"
            onChange={(e) => {
              setImageName(e.target.files[0].name);
            }}
            name="file"
            accept="image/*"
          />
          <button
            onClick={setAvatarHandler}
            className="py-3 px-7 rounded-full bg-action text-light text-bold hover:opacity-50"
          >
            Ok
          </button>
        </div>
      </header>

      <MyPosts />
    </div>
  );
}

export default Profile;
