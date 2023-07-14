import Image from "next/image";
import { useState } from "react";

function FriendList({ friends, setChatBox, chatBox }) {
  const [currentChatBox, setCurrentChatBox] = useState(null);
  function startChatHandler(f) {
    if (f.userId !== currentChatBox) {
      setChatBox({
        receiverId: f.userId,
        avatar: f.avatar,
        email: f.email.split("@")[0],
      });

      setCurrentChatBox(f.userId);
    } else return;
  }

  if (friends.length === 0)
    return <h1 className="col-span-3">Make friend to start chatting</h1>;
  return (
    <div className=" bg-primary h-full col-span-3">
      <h1 className="text-center text-4xl pt-3">{`${friends.length} Friends`}</h1>
      <ul className="pb-10 pt-4 ">
        {friends.map((f) => (
          <li
            key={Math.random()}
            className="flex items-center p-4 border-2 border-light rounded-md m-1 bg-secondary-100 hover:cursor-pointer hover:border-dark"
            onClick={startChatHandler.bind(null, f)}
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-400">
              <Image
                src={require("../../public/images/".concat(
                  f.avatar || "default-user.webp"
                ))}
                className="object-cover w-full h-full"
                alt="Avatar"
              />
            </div>
            <h1 className="ml-5 font-name text-2xl text-action">
              {f.email.split("@")[0]}
            </h1>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FriendList;
