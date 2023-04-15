import Link from "next/link";
import { useRouter } from "next/router";
import useUserStore from "../../store/useUserStore";

function NavBar() {
  const router = useRouter();
  const path = router.pathname;
  const userId = useUserStore((state) => state.id);
  return (
    <section className="bg-gradient-to-t from-primary to-secondary-100 ">
      <nav className={path === "/edspace" ? "fixed left-10 w-20" : ""}>
        <ul className="flex flex-col items-center text-lg ">
          <li className="nav-child ">
            <Link href={"/edspace"}>EDspace</Link>
          </li>
          <li className="nav-child">Shop</li>
          <li className="nav-child">
            <Link href={`/edspace/${userId}/ed-message`}>Chat</Link>
          </li>
          <li className="nav-child">
            <Link href={`/edspace/${userId}`}>Profile</Link>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default NavBar;
