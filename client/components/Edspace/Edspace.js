import { useQuery } from "react-query";
import axios from "axios";
// import useUserStore from "../../store/useUserStore";

import NavBar from "./NavBar";
import AllPosts from "./AllPosts";
function Edspace({ userId }) {
  if (!userId) return <h1>You can't access this route </h1>;
  const { data, isLoading, error } = useQuery("allPosts", () =>
    axios.post(
      "http://localhost:8888/get-all-posts",
      {
        userId: userId,
      },
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
  );
  return (
    <div className="grid grid-cols-7 min-h-screen ">
      <NavBar />
      <section className="lg:col-span-6 col-span-4 bg-gradient-to-t from-primary to-secondary-100 min-h-full flex  flex-col space-around">
        <div className="text-5xl h-20 uppercase font-semibold text-action">
          <h1 className="px-7 mt-3">Ed news</h1>
        </div>
        {error ? <h1>Can't fetch posts</h1> : ""}
        {isLoading ? <h1>Loading.....</h1> : ""}
        {data && data.data.data.length === 0 && <NoPost />}
        {data && <AllPosts posts={data.data.data} />}
        {/* {data && <PostsList posts={data.data.data} />} */}
      </section>
      {/* <div className="col-span-1 bg-gradient-to-t  from-primary to-secondary-100"></div> */}
    </div>
  );
}

export default Edspace;
