import Image from "next/image";
import useUserStore from "../../store/useUserStore";
function ChatElement({ information }) {
  const { receiverId } = information;
  const userId = useUserStore((state) => state.id);
  return (
    <div
      className={"flex flex-col w-full".concat(
        receiverId === userId ? " items-end" : ""
      )}
    >
      {receiverId === userId ? (
        <div
          className={
            "flex w-fit border-2 rounded-full items-center p-2 max-w-3xl bg-secondary-200"
          }
        >
          <h1 className="text-lg mr-5">{information.content}</h1>

          <h1 className="mr-5 font-name text-2xl text-action">{": You"}</h1>
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400">
            <Image
              src={require("../../public/images/".concat(
                information.avatar !== "null" && information.avatar !== null
                  ? information.avatar
                  : "default-user.webp"
              ))}
              className="object-cover w-full h-full"
              alt="Avatar"
            />
          </div>
        </div>
      ) : (
        <div
          className={
            "flex w-fit border-2 rounded-full items-center p-2 max-w-3xl bg-receiver"
          }
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-400">
            <Image
              src={require("../../public/images/".concat(
                information.avatar !== "null" && information.avatar !== null
                  ? information.avatar
                  : "default-user.webp"
              ))}
              className="object-cover w-full h-full"
              alt="Avatar"
            />
          </div>
          <h1 className="ml-5 font-name text-2xl text-action">
            {information.email + ":"}
          </h1>
          <h1 className="text-lg ml-5">{information.content}</h1>
        </div>
      )}
      <h1 className="text-gray-500">{information.createdAt}</h1>
    </div>
  );
}

export default ChatElement;
