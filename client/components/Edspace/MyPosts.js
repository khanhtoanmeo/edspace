import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import NavBar from "./NavBar";
import NoPost from "./NoPost";
import PostForm from "./PostForm";
import PostsList from "./PostsList";

function MyPosts() {
  const router = useRouter();
  const { userId } = router.query;

  const { data, isLoading, error } = useQuery("myData", () =>
    axios.post(
      "http://localhost:8888/get-all-my-posts",
      {
        userId,
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
      <section className="col-span-5 bg-gradient-to-t min-h-full from-primary to-secondary-200 flex flex-col space-around">
        <div className="text-5xl h-20 uppercase font-semibold text-action">
          <h1 className="px-5 ">My Posts</h1>
        </div>
        {error ? <h1>Can't fetch posts</h1> : ""}
        {isLoading ? <h1>Loading.....</h1> : ""}
        {data && data.data.data.length === 0 && <NoPost />}
        {data && <PostsList posts={data.data.data} />}
      </section>
      <PostForm />
    </div>
  );
}
export default MyPosts;
