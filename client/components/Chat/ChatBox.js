import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import axios from "axios";
import FriendList from "./FriendList";
import io from "socket.io-client";
import Chat from "./Chat";
import { useRouter } from "next/router";

function ChatBox() {
  const [isLoading, setIsLoading] = useState(false);
  const [chatBox, setChatBox] = useState(null);
  const [friends, setFriends] = useState(null);
  const [socket, setSocket] = useState(null);
  const router = useRouter();

  const userId = useUserStore((state) => state.id);
  useEffect(() => {
    setSocket((state) => io.connect("http://localhost:8888"));
    setIsLoading(true);
    axios
      .post(
        "http://localhost:8888/get-friends",
        {
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
        setIsLoading(false);
        setFriends(res.data.friends);
      });
  }, []);

  if (isLoading) return <h1>Loading....</h1>;
  if (!isLoading && friends)
    return (
      <div className="grid grid-cols-12 min-h-screen">
        <FriendList friends={friends} setChatBox={setChatBox} />
        {chatBox ? (
          <Chat chatBox={chatBox} socket={socket} />
        ) : (
          <h1 className="col-span-9 min-h-full text-3xl text-center">
            Choose a friend to talk
          </h1>
        )}
      </div>
    );
}

export default ChatBox;
