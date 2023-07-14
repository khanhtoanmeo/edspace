import { useRef, useState } from "react";
import isEmail from "validator/lib/isemail";
import axios from "axios";
import { useRouter } from "next/router";
import { data } from "autoprefixer";
import useAppStore from "../../store/useAppStore";

function Home() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const router = useRouter();
  // const logOut = useAppStore((state) => state.state);

  function resetInput() {
    emailRef.current.value = "";
    passwordRef.current.value = "";
  }

  const [auth, setAuth] = useState({
    type: "login",
    title: "Log In",
    status: "New to Ed Space?",
    switch: "Sign Up",
  });
  function toggleState() {
    if (auth.type === "login") {
      resetInput();
      setAuth({
        type: "signup",
        title: "Sign Up",
        status: "Already have an account?",
        switch: "Log In",
      });
      return;
    }

    if (auth.type === "signup") {
      resetInput();
      setAuth({
        type: "login",
        title: "Log In",
        status: "New to Ed Space?",
        switch: "Sign Up",
      });
      return;
    }
  }

  async function authHandler(e) {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const { type } = auth;
    if (isEmail(email) && password.length > 7 && password.length < 21) {
      if (type === "signup") {
        const res = await axios.post(
          "http://localhost:8888/signup",
          {
            email,
            password,
          },
          {
            validateStatus: () => true,
          }
        );

        if (res.statusText === "OK") {
          router.replace(`/edspace/${res.data.userId}`);
          localStorage.setItem("jwt", res.data.token);
        } else {
          resetInput();
          alert(res.data.message);
        }
      }

      if (type === "login") {
        const res = await axios.post(
          "http://localhost:8888/login",
          {
            email,
            password,
          },
          {
            validateStatus: () => true,
          }
        );
        if (res.statusText === "OK") {
          router.replace(`/edspace/${res.data.userId}`);
          localStorage.setItem("jwt", res.data.token);
        } else {
          resetInput();
          alert(res.data.message);
        }
      }
    } else {
      resetInput();
      alert("Invalid email or password");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-magenta-200 to-pink-100">
      <div className="mb-20 flex flex-col items-center justify-center border-4 w-3/5 border-secondary-200 bg-secondary-100 lg:w-1/4 h-3/5 rounded-lg relative">
        <h1 className="mb-10 text-4xl text-action">{auth.title}</h1>
        <form className=" h-3/4 grid grid-rows-3 gap-8 ">
          <div>
            <label htmlFor="email" className="mr-5 block font-bold">
              Email
            </label>
            <input
              ref={emailRef}
              className="rounded-md h-1/3 w-52 xl:w-64"
              name="email"
              type={"email"}
            ></input>
          </div>
          <div>
            <label htmlFor="password" className="mr-5 block font-bold">
              Password
            </label>
            <input
              className="rounded-md h-1/3 w-52 xl:w-64"
              name="password"
              type={"password"}
              maxLength="20"
              minLength={"8"}
              ref={passwordRef}
            ></input>
          </div>
          <button onClick={authHandler} className="button w-32 h-1/2">
            {auth.title}
          </button>
        </form>
        <div className="absolute bottom-3 right-3">
          <p>
            {auth.status}
            <a
              onClick={toggleState}
              className="underline hover:text-secondary-200 hover:cursor-pointer ml-2"
            >
              {auth.switch}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
