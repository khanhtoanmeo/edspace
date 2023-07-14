import { useEffect, useState } from "react";
import Edspace from "../../components/Edspace/Edspace";
import useAppStore from "../../store/useAppStore";
import useUserStore from "../../store/useUserStore";
function EdspacePage() {
  const [userId, setUserId] = useState(null);
  const setId = useUserStore((state) => state.setId);
  const logIn = useAppStore((state) => state.logIn);
  useEffect(() => {
    const id = localStorage.getItem("id");
    setId(id);
    setUserId(id);
    logIn();
  });

  if (!userId) return <h1>Loading.....</h1>;
  if (userId) return <Edspace userId={userId} />;
}

export default EdspacePage;
