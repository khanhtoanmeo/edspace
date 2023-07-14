import { useRouter } from "next/router";
import useAppStore from "../../store/useAppStore";
import useUserStore from "../../store/useUserStore";
function Layout(props) {
  const appState = useAppStore((state) => state.state);
  const setId = useUserStore((state) => state.setId);

  const router = useRouter();
  function logOutHandler() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("id");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
    router.replace("/");
    setTimeout(() => {
      setId(null);
    }, 1000);
  }
  return (
    <div className="h-full rounded-t-xl overflow-hidden font-general text-md">
      <div className="py-5 bg-secondary-200 sticky top-0">
        <h3 className="text-action text-center text-6xl font-medium uppercase font-head grad">
          Ed Space
        </h3>
        {appState === "ACTIVE" && (
          <h1
            onClick={logOutHandler}
            className="absolute top-8 right-8 bg-gradient-to-r bg-clip-text text-transparent from-emerald-700 to-amber-800  text-2xl text-dark font-semibold hover:text-red-600 hover:cursor-pointer hover:scale-125"
          >
            Log out
          </h1>
        )}
      </div>

      <main>{props.children}</main>
    </div>
  );
}

export default Layout;
