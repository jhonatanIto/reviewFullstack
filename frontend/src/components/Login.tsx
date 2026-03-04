import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const boxRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [signUp, setSignUp] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  useEffect(() => {
    const closeModal = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        navigate("/");
      }
    };

    window.addEventListener("mousedown", closeModal);

    return () => window.removeEventListener("mousedown", closeModal);
  }, [navigate]);

  const submitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUp) {
      if (!name || !email || !password || !confirmPassword)
        return alert("Missing fields");
      if (password !== confirmPassword) return alert("Password not matching ");
    } else {
      if (!email || !password) return alert("Missing fields");
    }

    const url = signUp ? "register" : "login";
    const body = signUp ? { name, email, password } : { email, password };

    try {
      const res = await fetch(`http://localhost:3000/auth/${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      navigate("/");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center w-full h-full fixed m-0 bg-black/65 top-0 z-50">
      <form
        onSubmit={submitForm}
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
        <button className="mt-10 bg-purple-500 p-2 text-white  font-semibold rounded-[10px] pl-7 pr-7 cursor-pointer">
          {signUp ? "Sign up" : "Login"}
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
