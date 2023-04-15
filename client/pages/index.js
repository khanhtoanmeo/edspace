import { useEffect } from "react";
import Home from "../components/Home/Home";
import useAppStore from "../store/useAppStore";

function HomePage() {
  const logOut = useAppStore((state) => state.logOut);
  useEffect(() => {
    logOut();
  });
  return <Home></Home>;
}

export default HomePage;
