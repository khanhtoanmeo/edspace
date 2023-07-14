import Image from "next/image";
function PostsList({ posts }) {
  return (
    <ul className="grid grid-cols-3 h-full py-10">
      {posts.map((p) => (
        <div
          className="w-full flex flex-col justify-between items-cente border-2 border-gray-400 "
          key={Math.random()}
        >
          <p className="text-center font-semibold text-slate-800 text-md mb-8">
            {p.caption}
          </p>
          <div className="w-full h-48 hq flex flex-col justify-center items-center overflow-hidden rounded-md">
            <Image
              src={require(`../../public/images/${p.image}`)}
              alt={"My post"}
            />
          </div>
        </div>
      ))}
    </ul>
  );
}

export default PostsList;
