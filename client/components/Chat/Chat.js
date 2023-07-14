import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
import useUserStore from "../../store/useUserStore";
// import ChatElement from "./ChatElement";
import axios from "axios";
import ChatList from "./ChatList";
import { data } from "autoprefixer";

function Chat({ chatBox, socket }) {
  const userId = useUserStore((state) => state.id);
  const messageRef = useRef();
  const [messages, setMessages] = useState([]);
  // const [hhh, sethhh] = useState("33");

  function sendMessageHandler(e) {
    const message = messageRef.current.value;
    e.preventDefault();
    if (!message.trim()) {
      messageRef.current.value = "";
      return alert("Don't leave the input field empty");
    }
    const createdAt = new Date().toLocaleString("vi");
    socket.emit("send", {
      roomId: chatBox.receiverId,
      message: message,
      createdAt,
    });

    setMessages((state) => {
      const newState = state.map((e) => e);
      newState.push({
        avatar: localStorage.getItem("avatar"),
        email: localStorage.getItem("username"),
        receiverId: userId,
        content: message,
        createdAt,
      });
      return newState;
    });

    messageRef.current.value = "";

    axios.post(
      "http://localhost:8888/send-message",
      {
        userId,
        receiverId: chatBox.receiverId,
        content: message,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
  }

  useEffect(() => {
    socket.emit("join", userId);
    axios
      .post(
        "http://localhost:8888/get-messages",
        {
          userId,
          receiverId: chatBox.receiverId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
      .then((res) => {
        setMessages(res.data.messages);
      });
  }, [chatBox]);

  useEffect(() => {
    socket.on("back", (data) => {
      setMessages((state) => {
        const newState = state.map((e) => e);
        newState.push({
          avatar: chatBox.avatar,
          email: chatBox.email,
          receiverId: chatBox.receiverId,
          content: data.message,
          createdAt: data.createdAt,
        });
        return newState;
      });
    });
    socket.on("disconnect", (message) => {
      alert("Disconnected...");
    });
  }, [socket]);

  // if (chatBox)
  return (
    <div className="col-span-9 p-3 flex flex-col h-full bg-gradient-to-r from-blue-100 via-purple-200 to-pink-100">
      <div className=" h-full">
        <ChatList messages={messages} />
      </div>
      <div className="m-2 w-full  flex justify-around">
        <input
          className="w-3/4 p-3 border-2 rounded-md bg-black text-white text-xl"
          type={"text"}
          placeholder="Type something"
          ref={messageRef}
        />
        <button
          onClick={sendMessageHandler}
          className="border-4 bg-black text-white ml-2 rounded-full hover:cursor-pointer hover:border-action py-3 px-6 "
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
