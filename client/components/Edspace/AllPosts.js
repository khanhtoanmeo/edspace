import Image from "next/image";
import useUserStore from "../../store/useUserStore";
import axios from "axios";
import Post from "./Post";

function AllPosts({ posts }) {
  const userId = useUserStore((state) => state.id);
  return (
    <div className="w-full flex flex-col">
      {posts.map((p) => {
        return <Post key={Math.random()} p={p} />;
      })}
    </div>
  );
}

export default AllPosts;
