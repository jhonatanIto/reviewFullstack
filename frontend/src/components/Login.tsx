import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const boxRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [signUp, setSignUp] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [ConfirmEmail, setConfirmEmail] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        navigate("/");
      }
    };

    window.addEventListener("click", closeModal);

    return () => window.removeEventListener("click", closeModal);
  }, [navigate]);

  return (
    <div className="flex justify-center w-full h-full fixed m-0 bg-black/65 top-0 z-50">
      <form
        ref={boxRef}
        className="w-125 h-fit pb-16 mt-40 flex flex-col rounded-2xl items-center bg-white "
      >
        <div className="text-2xl mt-10">{signUp ? "Register" : "Login"}</div>
        {signUp && (
          <input
            className="mt-5 text-[18px] border border-zinc-300 p-2 w-80"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          className="mt-5 text-[18px] border border-zinc-300 p-2 w-80"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {signUp && (
          <input
            className="mt-5 text-[18px] border border-zinc-300 p-2 w-80"
            type="email"
            placeholder="Confirm Email"
            value={ConfirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        )}
        <input
          className="mt-5 text-[18px] border border-zinc-300 p-2 w-80"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {signUp && (
          <input
            className="mt-5 text-[18px] border border-zinc-300 p-2 w-80"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button className="mt-10 bg-purple-500 p-2 text-white rounded-2xl pl-5 pr-5 cursor-pointer">
          Login
        </button>
        <div className="mt-10">
          {signUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="text-purple-500 cursor-pointer font-bold"
            onClick={() => setSignUp((prev) => !prev)}
          >
            {signUp ? "Sign In" : "Sign Up"}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Login;
