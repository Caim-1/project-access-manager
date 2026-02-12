import Image from "next/image";
import LoginForm from "@/components/LoginFrom";

export default function Login() {
  return (
    <>
      <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black ">
          Login
        </h1>

        <LoginForm />
      </div>
    </>
  );
}
