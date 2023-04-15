import Image from "next/image";
function PostsList({ posts }) {
  return (
    <ul className="grid grid-cols-3 h-full py-10">
      {posts.map((p) => (
        <div className="w-full flex flex-col items-center " key={Math.random()}>
          <h1 className="text-center text-dark text-md">{p.caption}</h1>
          <div className="w-full h-48 hq flex flex-col justify-center items-center mt-5 overflow-hidden rounded-md">
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
