import Image from "next/image";

function CommentsList({ comments }) {
  return (
    <ul className="p-3 overflow-scroll">
      {comments.map((c) => (
        <div className="mb-5" key={Math.random()}>
          <div className="flex">
            <div className="h-10 w-10 rounded-full overflow-hidden hover:scale-150 transition duration-300">
              <Image
                src={require(`../../public/images/${
                  c.avatar || "default-user.webp"
                }`)}
                alt="Avatar"
                style={{
                  height: "100%",
                  width: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <h1 className="font-name text-action ml-3 mr-5">
              {c.email.split("@")[0] + ":"}
            </h1>
            <h1>{c.content}</h1>
          </div>
          <h1 className="text-sm opacity-50">
            {new Date(c.createdAt).toLocaleString("vi")}
          </h1>
        </div>
      ))}
    </ul>
  );
}

export default CommentsList;
